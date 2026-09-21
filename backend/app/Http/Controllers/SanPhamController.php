<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use App\Http\Resources\SanPhamResource;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SanPhamController extends Controller
{
    /**
     * Lấy danh sách sản phẩm (có phân trang)
     */
    public function index()
    {
        $sanPhams = SanPham::latest('ngay_tao')->paginate(10);
        return SanPhamResource::collection($sanPhams);
    }

    /**
     * Thêm mới sản phẩm
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'danh_muc_id' => 'required|integer',
            'thuong_hieu_id' => 'nullable|integer',
            'ten_san_pham' => 'required|string|max:255',
            'duong_dan_sp' => 'required|string|max:255|unique:san_pham,duong_dan_sp',
            'hinh_anh' => 'nullable|string|max:255',
            'gia_ban' => 'required|numeric|min:0',
            'gia_giam' => 'nullable|numeric|min:0',
            'so_luong_ton_kho' => 'required|integer|min:0',
            'don_vi_tinh' => 'nullable|string|max:50',
            'mo_ta_ngan' => 'nullable|string',
            'chi_tiet' => 'nullable|string',
            'trang_thai' => ['nullable', Rule::in(['hien_thi', 'an'])],
        ]);

        $sanPham = SanPham::create($validated);

        return (new SanPhamResource($sanPham))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Lấy thông tin chi tiết một sản phẩm
     */
    public function show($id)
    {
        $sanPham = SanPham::findOrFail($id);
        return new SanPhamResource($sanPham);
    }

    /**
     * Cập nhật thông tin sản phẩm
     */
    public function update(Request $request, $id)
    {
        $sanPham = SanPham::findOrFail($id);

        $validated = $request->validate([
            'danh_muc_id' => 'sometimes|required|integer',
            'thuong_hieu_id' => 'nullable|integer',
            'ten_san_pham' => 'sometimes|required|string|max:255',
            'duong_dan_sp' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('san_pham', 'duong_dan_sp')->ignore($sanPham->id)
            ],
            'hinh_anh' => 'nullable|string|max:255',
            'gia_ban' => 'sometimes|required|numeric|min:0',
            'gia_giam' => 'nullable|numeric|min:0',
            'so_luong_ton_kho' => 'sometimes|required|integer|min:0',
            'don_vi_tinh' => 'nullable|string|max:50',
            'mo_ta_ngan' => 'nullable|string',
            'chi_tiet' => 'nullable|string',
            'trang_thai' => ['nullable', Rule::in(['hien_thi', 'an'])],
        ]);

        $sanPham->update($validated);

        return new SanPhamResource($sanPham);
    }

    /**
     * Xóa sản phẩm
     */
    public function destroy($id)
    {
        $sanPham = SanPham::findOrFail($id);
        $sanPham->delete();

        return response()->json([
            'message' => 'Xóa sản phẩm thành công'
        ], 200);
    }
}