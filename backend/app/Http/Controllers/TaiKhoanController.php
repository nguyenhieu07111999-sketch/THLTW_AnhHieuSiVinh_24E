<?php

namespace App\Http\Controllers;

use App\Http\Resources\DonHangResource;
use App\Http\Resources\TaiKhoanNguoiDungResource;
use App\Models\DonHang;
use App\Models\TaiKhoanNguoiDung;
use Illuminate\Http\Request;
use App\Http\Requests\CapNhatHoSoRequest;
use Illuminate\Support\Facades\Storage;

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
}