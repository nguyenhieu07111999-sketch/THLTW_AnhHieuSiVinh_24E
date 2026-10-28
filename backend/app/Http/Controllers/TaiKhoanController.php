<?php

namespace App\Http\Controllers;

use App\Http\Resources\DonHangResource;
use App\Http\Resources\TaiKhoanNguoiDungResource;
use App\Models\DonHang;
use App\Models\TaiKhoanNguoiDung;
use Illuminate\Http\Request;
use App\Http\Requests\CapNhatHoSoRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\DoiMatKhauOtpRequest; 
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use App\Mail\GuiOtpDoiMatKhauMail;

class TaiKhoanController extends Controller
{
    private function khach(Request $request): TaiKhoanNguoiDung
    {
        $user = $request->user();
        abort_unless($user, 403, 'Vui lòng đăng nhập để tiếp tục.');
        
        $khach = TaiKhoanNguoiDung::find($user->id);
        
        abort_unless($khach !== null, 403, 'Chỉ dành cho tài khoản khách hàng.');
        abort_if($khach->trang_thai === 'khoa', 403, 'Tài khoản của bạn đã bị khóa.');

        return $khach;
    }

    public function hoSo(Request $request)
    {
        return new TaiKhoanNguoiDungResource($this->khach($request));
    }

    public function danhSachDonHang(Request $request)
    {
        $khach = $this->khach($request);

        $request->validate([
            'trang_thai' => 'nullable|in:cho_xac_nhan,da_xac_nhan,dang_giao,hoan_thanh',
            'per_page'   => 'nullable|integer|min:1|max:50',
        ]);

        $donHangs = DonHang::query()
            ->where('nguoi_dung_id', $khach->id)
            ->when($request->filled('trang_thai'),
                fn ($q) => $q->where('trang_thai_don_hang', $request->trang_thai))
            ->with('chiTiet')
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate($request->integer('per_page', 10));

        return DonHangResource::collection($donHangs);
    }

    public function chiTietDonHang(Request $request, $id)
    {
        $donHang = DonHang::where('nguoi_dung_id', $this->khach($request)->id)
            ->with('chiTiet')
            ->findOrFail($id);

        return new DonHangResource($donHang);
    }

    public function capNhatHoSo(CapNhatHoSoRequest $request)
    {
        $user = $request->user();
        $data = $request->validated();

        if ($request->hasFile('anh_dai_dien')) {
            if ($user->anh_dai_dien && Storage::disk('public')->exists($user->anh_dai_dien)) {
                Storage::disk('public')->delete($user->anh_dai_dien);
            }

            $data['anh_dai_dien'] = $request->file('anh_dai_dien')->store('avatars', 'public');
        }

        $user->update($data);

        return (new TaiKhoanNguoiDungResource($user))->additional([
            'message' => 'Cập nhật thông tin hồ sơ thành công!',
        ]);
    }

    public function guiOtpDoiMatKhau(Request $request)
    {
        $user = auth()->user();

        if (empty($user->email)) {
            return response()->json(['message' => 'Tài khoản chưa có email để nhận mã OTP.'], 400);
        }

        // Chống spam: Mỗi lần gửi cách nhau tối thiểu 60 giây
        $lockKey = "otp_resend_lock_{$user->id}";
        if (Cache::has($lockKey)) {
            return response()->json(['message' => 'Vui lòng chờ 60 giây trước khi yêu cầu mã mới.'], 429);
        }

        // Sinh mã ngẫu nhiên 6 chữ số
        $otp = sprintf("%06d", mt_rand(1, 999999));

        // Lưu Cache hiệu lực 5 phút
        Cache::put("otp_doi_mk_{$user->id}", $otp, now()->addMinutes(5));
        Cache::put($lockKey, true, now()->addSeconds(60));

        try {
            Mail::to($user->email)->send(new GuiOtpDoiMatKhauMail($user->ho_ten ?? 'Quý khách', $otp));
        } catch (\Exception $e) {
            \Log::error('Lỗi gửi mail OTP: ' . $e->getMessage());
            return response()->json(['message' => 'Không thể gửi email lúc này. Vui lòng kiểm tra lại cấu hình mail.'], 500);
        }

        return response()->json(['message' => 'Mã OTP đã được gửi về email của bạn!']);
    }

    /**
     * 2. Xác nhận OTP và đổi mật khẩu mới (Sử dụng DoiMatKhauOtpRequest)
     */
    public function xacNhanDoiMatKhau(DoiMatKhauOtpRequest $request)
    {
        // Dữ liệu đã được validate an toàn qua DoiMatKhauOtpRequest
        $user = auth()->user();

        // 1. Kiểm tra mã OTP trong Cache
        $cacheOtp = Cache::get("otp_doi_mk_{$user->id}");
        if (!$cacheOtp || $cacheOtp !== trim($request->ma_otp)) {
            return response()->json([
                'errors' => ['ma_otp' => ['Mã OTP không chính xác hoặc đã hết hạn.']]
            ], 422);
        }

        // 2. Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->mat_khau_cu, $user->mat_khau)) {
            return response()->json([
                'errors' => ['mat_khau_cu' => ['Mật khẩu hiện tại không chính xác.']]
            ], 422);
        }

        // 3. Cập nhật mật khẩu mới & Xóa cache OTP
        $user->mat_khau = Hash::make($request->mat_khau_moi);
        $user->save();

        Cache::forget("otp_doi_mk_{$user->id}");
        Cache::forget("otp_resend_lock_{$user->id}");

        return response()->json([
            'message' => 'Đổi mật khẩu thành công!'
        ]);
    }
}