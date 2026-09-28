<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use App\Http\Resources\SanPhamResource;
use App\Http\Requests\StoreSanPhamRequest;
use App\Http\Requests\UpdateSanPhamRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SanPhamController extends Controller
{
   
    public function index(Request $request)
    {
        $query = SanPham::query();

        if ($request->filled('search')) {
            $query->where('ten_san_pham', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('danh_muc_id')) {
            $query->where('danh_muc_id', $request->danh_muc_id);
        }

        $perPage = $request->get('per_page', 10);
        $sanPhams = $query->latest('ngay_tao')->paginate($perPage);

        return SanPhamResource::collection($sanPhams);
    }

    public function store(StoreSanPhamRequest $request)
    {
        $validated = $request->validated();

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

        if (isset($validated['ten_san_pham']) && empty($validated['duong_dan_sp'])) {
            $validated['duong_dan_sp'] = Str::slug($validated['ten_san_pham']) . '-' . $sanPham->id;
        }

        $sanPham->update($validated);

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
        $sanPhams = SanPham::onlyTrashed()->latest('ngay_xoa')->paginate(10);
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