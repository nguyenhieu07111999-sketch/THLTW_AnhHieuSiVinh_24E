<?php

namespace App\Http\Controllers;

use App\Models\DonHang;
use App\Models\GioHang;
use App\Http\Resources\DonHangResource;
use App\Http\Requests\StoreDonHangRequest;
use App\Http\Requests\UpdateDonHangRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use RuntimeException;

class DonHangController extends Controller
{

    public function store(StoreDonHangRequest $request)
    {
        $validated = $request->validated();
        $phuongThuc = $validated['phuong_thuc_thanh_toan'];

        if ($phuongThuc === 'VNPAY') {
            $this->ensureVnpayConfigured();
        }

        $donHang = DB::transaction(function () use ($request, $validated, $phuongThuc) {
            $gioHang = GioHang::with('chiTiets.sanPham')
                ->where('nguoi_dung_id', $request->user()->id)
                ->lockForUpdate()
                ->first();

            if (!$gioHang || $gioHang->chiTiets->isEmpty()) {
                abort(422, 'Giỏ hàng đang trống.');
            }

            $tongTien = 0;
            $chiTiets = [];
            foreach ($gioHang->chiTiets as $item) {
                $sanPham = $item->sanPham;
                if (!$sanPham || $sanPham->trang_thai !== 'hien_thi') {
                    abort(422, 'Một sản phẩm trong giỏ hàng hiện không còn kinh doanh.');
                }
                if ($item->so_luong > $sanPham->so_luong_ton_kho) {
                    abort(422, "Sản phẩm {$sanPham->ten_san_pham} không đủ số lượng trong kho.");
                }

                $giaBan = (float) $sanPham->gia_ban;
                $giaGiam = (float) ($sanPham->gia_giam ?? 0);
                $giaHienTai = $giaGiam > 0 && $giaGiam < $giaBan ? $giaGiam : $giaBan;
                $thanhTien = round($giaHienTai * $item->so_luong, 2);
                $tongTien += $thanhTien;

                $chiTiets[] = [
                    'san_pham_id' => $sanPham->id,
                    'ten_san_pham' => $sanPham->ten_san_pham,
                    'hinh_anh' => $sanPham->hinh_anh,
                    'gia_ban' => $giaBan,
                    'gia_giam' => $giaHienTai < $giaBan ? $giaHienTai : null,
                    'so_luong' => $item->so_luong,
                    'thanh_tien' => $thanhTien,
                ];
            }

            $phiVanChuyen = 0;
            $donHang = DonHang::create([
                'nguoi_dung_id' => $request->user()->id,
                'ten_nguoi_nhan' => $validated['ten_nguoi_nhan'],
                'so_dien_thoai_nhan' => $validated['so_dien_thoai_nhan'],
                'dia_chi_nhan' => $validated['dia_chi_nhan'],
                'ghi_chu' => $validated['ghi_chu'] ?? null,
                'tong_tien' => $tongTien,
                'phi_vanchuyen' => $phiVanChuyen,
                'thanh_tien' => $tongTien + $phiVanChuyen,
                'trang_thai_don_hang' => 'cho_xac_nhan',
                'trang_thai_thanh_toan' => 'chua_thanh_toan',
                'phuong_thuc_thanh_toan' => $phuongThuc,
            ]);
            $donHang->chiTiet()->createMany($chiTiets);
            $gioHang->chiTiets()->delete();

            return $donHang;
        });

        if ($phuongThuc === 'VNPAY') {
            return response()->json([
                'message' => 'Đơn hàng đã được tạo. Đang chuyển đến VNPAY.',
                'data' => [
                    'don_hang_id' => $donHang->id,
                    'url_thanh_toan' => $this->taoUrlVnpay($request, $donHang),
                ],
            ], 201);
        }

        return response()->json([
            'message' => 'Đặt hàng thành công.',
            'data' => ['don_hang_id' => $donHang->id],
        ], 201);
    }

    public function vnpayReturn(Request $request)
    {
        $params = $request->query();
        $donHang = $this->donHangTuCallback($params);
        $hopLe = $donHang && $this->xacThucChuKyVnpay($params)
            && $this->soTienCallbackHopLe($params, $donHang);

        if ($hopLe && $this->vnpayThanhToanThanhCong($params)) {
            $this->xacNhanDaThanhToan($donHang);
        }

        $ketQua = $hopLe && $this->vnpayThanhToanThanhCong($params)
            ? 'thanh_cong'
            : 'that_bai';

        return redirect()->away(
            rtrim(config('services.vnpay.frontend_url'), '/')
            . '/thanh-toan/ket-qua?thanh_toan=' . $ketQua
            . '&don_hang=' . ($donHang?->id ?? '')
        );
    }

    public function vnpayIpn(Request $request)
    {
        $params = $request->query();
        if (!$this->xacThucChuKyVnpay($params)) {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }

        $donHang = $this->donHangTuCallback($params);
        if (!$donHang) {
            return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
        }
        if (!$this->soTienCallbackHopLe($params, $donHang)) {
            return response()->json(['RspCode' => '04', 'Message' => 'Invalid amount']);
        }
        if ($donHang->trang_thai_thanh_toan === 'da_thanh_toan') {
            return response()->json(['RspCode' => '02', 'Message' => 'Order already confirmed']);
        }

        if ($this->vnpayThanhToanThanhCong($params)) {
            $this->xacNhanDaThanhToan($donHang);
        }

        return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
    }

    private function ensureVnpayConfigured(): void
    {
        if (!config('services.vnpay.tmn_code') || !config('services.vnpay.hash_secret')) {
            throw new RuntimeException('Thiếu cấu hình VNPAY_TMN_CODE hoặc VNPAY_HASH_SECRET.');
        }
    }

    private function taoUrlVnpay(Request $request, DonHang $donHang): string
    {
        $params = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => config('services.vnpay.tmn_code'),
            'vnp_Amount' => (string) round((float) $donHang->thanh_tien * 100),
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => (string) $donHang->id,
            'vnp_OrderInfo' => 'Thanh toan don hang ' . $donHang->id,
            'vnp_OrderType' => 'other',
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => route('vnpay.return'),
            'vnp_IpAddr' => $request->ip(),
            'vnp_CreateDate' => now('Asia/Ho_Chi_Minh')->format('YmdHis'),
            'vnp_ExpireDate' => now('Asia/Ho_Chi_Minh')->addMinutes(15)->format('YmdHis'),
        ];
        ksort($params);

        $queryParts = [];
        foreach ($params as $key => $value) {
            $queryParts[] = urlencode($key) . '=' . urlencode((string) $value);
        }
        $hashData = implode('&', $queryParts);
        $signature = hash_hmac('sha512', $hashData, config('services.vnpay.hash_secret'));

        return config('services.vnpay.url') . '?' . $hashData . '&vnp_SecureHash=' . $signature;
    }

    private function xacThucChuKyVnpay(array $params): bool
    {
        $signature = $params['vnp_SecureHash'] ?? null;
        $secret = config('services.vnpay.hash_secret');
        if (!is_string($signature) || !$secret) {
            return false;
        }

        unset($params['vnp_SecureHash'], $params['vnp_SecureHashType']);
        if (collect($params)->contains(fn($value) => !is_scalar($value))) {
            return false;
        }
        ksort($params);

        $hashData = collect($params)
            ->map(fn($value, $key) => urlencode($key) . '=' . urlencode((string) $value))
            ->implode('&');

        return hash_equals(hash_hmac('sha512', $hashData, $secret), $signature);
    }

    private function donHangTuCallback(array $params): ?DonHang
    {
        $txnRef = $params['vnp_TxnRef'] ?? '';
        if (!is_string($txnRef) || !ctype_digit($txnRef)) {
            return null;
        }

        return DonHang::find((int) $txnRef);
    }

    private function soTienCallbackHopLe(array $params, DonHang $donHang): bool
    {
        return isset($params['vnp_Amount'])
            && ctype_digit((string) $params['vnp_Amount'])
            && (int) $params['vnp_Amount'] === (int) round((float) $donHang->thanh_tien * 100);
    }

    private function vnpayThanhToanThanhCong(array $params): bool
    {
        return ($params['vnp_ResponseCode'] ?? null) === '00'
            && ($params['vnp_TransactionStatus'] ?? null) === '00';
    }

    private function xacNhanDaThanhToan(DonHang $donHang): void
    {
        DB::transaction(function () use ($donHang) {
            $donHang = DonHang::whereKey($donHang->id)->lockForUpdate()->first();
            if ($donHang && $donHang->trang_thai_thanh_toan === 'chua_thanh_toan') {
                $donHang->update(['trang_thai_thanh_toan' => 'da_thanh_toan']);
            }
        });
    }

    public function index(Request $request)
    {
        $query = DonHang::with(['nguoiDung', 'chiTiet.sanPham']);

        if ($request->filled('trang_thai')) {
            $query->where('trang_thai_don_hang', $request->trang_thai);
        }

        if ($request->filled('search')) {
            $query->timKiem($request->search);
        }

        // Sắp xếp mã đơn hàng tăng dần: 1, 2, 3, ..., 10, 11, 12
        $donHangs = $query->orderBy('id', 'asc')->paginate(10);

        return DonHangResource::collection($donHangs);
    }

    public function show($id)
    {
        $donHang = DonHang::with(['nguoiDung', 'chiTiet.sanPham'])->findOrFail($id);

        return new DonHangResource($donHang);
    }

    public function update(UpdateDonHangRequest $request, $id)
    {
        $donHang = DonHang::findOrFail($id);

        $donHang->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn hàng thành công!',
            'data' => new DonHangResource($donHang->load(['nguoiDung', 'chiTiet.sanPham']))
        ], 200);
    }
}