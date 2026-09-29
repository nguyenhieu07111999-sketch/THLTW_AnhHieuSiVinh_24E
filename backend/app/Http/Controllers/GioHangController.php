<?php

namespace App\Http\Controllers;

use App\Models\GioHang;
use App\Models\ChiTietGioHang;
use App\Http\Resources\GioHangResource;
use App\Http\Requests\ThemGioHangRequest;
use App\Http\Requests\CapNhatGioHangRequest;
use Illuminate\Http\Request;

class GioHangController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $gioHang = GioHang::theoNguoiDung($user->id)
            ->kemChiTiet()
            ->first();

        if (!$gioHang) {
            $gioHang = GioHang::create(['nguoi_dung_id' => $user->id]);
            $gioHang->load('chiTiets.sanPham');
        }

        return new GioHangResource($gioHang);
    }

    public function store(ThemGioHangRequest $request)
    {
        $validated = $request->validated();
        $user = $request->user();

        $gioHang = GioHang::firstOrCreate([
            'nguoi_dung_id' => $user->id,
        ]);

        $item = ChiTietGioHang::theoSanPham($gioHang->id, $validated['san_pham_id'])->first();

        if ($item) {
            $item->so_luong += $validated['so_luong'];
            $item->save();
        } else {
            ChiTietGioHang::create([
                'gio_hang_id' => $gioHang->id,
                'san_pham_id' => $validated['san_pham_id'],
                'so_luong'    => $validated['so_luong'],
            ]);
        }

        $gioHang->load('chiTiets.sanPham');

        return response()->json([
            'message' => 'Thêm sản phẩm vào giỏ hàng thành công!',
            'data'    => new GioHangResource($gioHang),
        ]);
    }

    public function update(CapNhatGioHangRequest $request, $id)
    {
        $validated = $request->validated();
        $user = $request->user();

        $gioHang = GioHang::theoNguoiDung($user->id)->firstOrFail();

        $item = ChiTietGioHang::where('gio_hang_id', $gioHang->id)
            ->where('id', $id)
            ->firstOrFail();

        $item->so_luong = $validated['so_luong'];
        $item->save();

        $gioHang->load('chiTiets.sanPham');

        return response()->json([
            'message' => 'Cập nhật số lượng thành công!',
            'data'    => new GioHangResource($gioHang),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $gioHang = GioHang::theoNguoiDung($user->id)->firstOrFail();

        $item = ChiTietGioHang::where('gio_hang_id', $gioHang->id)
            ->where('id', $id)
            ->firstOrFail();

        $item->delete();

        $gioHang->load('chiTiets.sanPham');

        return response()->json([
            'message' => 'Đã xóa sản phẩm khỏi giỏ hàng!',
            'data'    => new GioHangResource($gioHang),
        ]);
    }
}