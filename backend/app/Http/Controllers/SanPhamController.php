<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use App\Http\Resources\SanPhamResource;
use App\Http\Requests\StoreSanPhamRequest;
use App\Http\Requests\UpdateSanPhamRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Illuminate\Support\Str;

class SanPhamController extends Controller
{
   
    public function index(Request $request)
    {
        $sanPhams = SanPham::query()
            ->hienThi()
            ->timKiem($request->input('search'))
            ->theoDanhMuc($request->input('danh_muc_id'))
            ->theoThuongHieu($request->input('thuong_hieu_id'))
            ->theoKhoangGia($request->input('gia_min'), $request->input('gia_max'))
            ->sapXep($request->input('sort', 'moi_nhat'))
            ->paginate($request->get('per_page', 10));

        return SanPhamResource::collection($sanPhams);
    }

    public function store(StoreSanPhamRequest $request)
    {
        $validated = $request->validated();
        $imagePath = $request->file('hinh_anh')->store('products', 'public');
        if (!$imagePath) {
            throw new RuntimeException('Không thể lưu hình ảnh sản phẩm.');
        }
        $validated['hinh_anh'] = $imagePath;

        if (empty($validated['duong_dan_sp'])) {
            $validated['duong_dan_sp'] = Str::slug($validated['ten_san_pham']) . '-' . time();
        }

        $sanPham = SanPham::create($validated);

        return (new SanPhamResource($sanPham))
            ->additional(['message' => 'Thêm sản phẩm thành công!'])
            ->response()
            ->setStatusCode(201);
    }

    public function show($id)
    {
        $sanPham = SanPham::findOrFail($id);
        return new SanPhamResource($sanPham);
    }

    public function update(UpdateSanPhamRequest $request, $id)
    {
        $sanPham = SanPham::findOrFail($id);
        $validated = $request->validated();
        $oldImagePath = $sanPham->hinh_anh;

        if ($request->hasFile('hinh_anh')) {
            $imagePath = $request->file('hinh_anh')->store('products', 'public');
            if (!$imagePath) {
                throw new RuntimeException('Không thể lưu hình ảnh sản phẩm.');
            }
            $validated['hinh_anh'] = $imagePath;
        } else {
            unset($validated['hinh_anh']);
        }

        if (isset($validated['ten_san_pham']) && empty($validated['duong_dan_sp'])) {
            $validated['duong_dan_sp'] = Str::slug($validated['ten_san_pham']) . '-' . $sanPham->id;
        }

        $sanPham->update($validated);

        if ($request->hasFile('hinh_anh') && $oldImagePath && str_starts_with($oldImagePath, 'products/')) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return (new SanPhamResource($sanPham))
            ->additional(['message' => 'Cập nhật sản phẩm thành công!']);
    }

    public function destroy($id)
    {
        $sanPham = SanPham::findOrFail($id);
        $sanPham->delete();

        return response()->json([
            'message' => 'Đã chuyển sản phẩm vào thùng rác!'
        ], 200);
    }

    public function trashed()
    {
        $sanPhams = SanPham::onlyTrashed()->latest('ngay_xoa')->paginate(8);
        return SanPhamResource::collection($sanPhams);
    }

    public function restore($id)
    {
        $sanPham = SanPham::onlyTrashed()->findOrFail($id);
        $sanPham->restore();

        return (new SanPhamResource($sanPham))
            ->additional(['message' => 'Khôi phục sản phẩm thành công!']);
    }

    public function forceDelete($id)
    {
        $sanPham = SanPham::onlyTrashed()->findOrFail($id);
        $sanPham->forceDelete();

        return response()->json([
            'message' => 'Đã xóa vĩnh viễn sản phẩm khỏi hệ thống!'
        ], 200);
    }
}