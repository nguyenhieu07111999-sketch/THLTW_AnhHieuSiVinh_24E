<?php

namespace App\Http\Controllers;

use App\Models\ThuongHieu;
use App\Http\Resources\ThuongHieuResource;
use App\Http\Requests\StoreThuongHieuRequest;
use App\Http\Requests\UpdateThuongHieuRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ThuongHieuController extends Controller
{
   
    public function index(Request $request)
    {
        $query = ThuongHieu::query();

        if ($request->filled('search')) {
            $query->where('ten_thuong_hieu', 'like', '%' . $request->search . '%');
        }

        $perPage = $request->get('per_page', 10);
        $thuongHieus = $query->latest('ngay_tao')->paginate($perPage);
        

        return ThuongHieuResource::collection($thuongHieus);
    }

    public function store(StoreThuongHieuRequest $request)
    {
        $validated = $request->validated();

        if (empty($validated['duong_dan_th'])) {
            $validated['duong_dan_th'] = Str::slug($validated['ten_thuong_hieu']) . '-' . time();
        }

        $thuongHieu = ThuongHieu::create($validated);

        return (new ThuongHieuResource($thuongHieu))
            ->additional(['message' => 'Thêm thương hiệu thành công!'])
            ->response()
            ->setStatusCode(201);
    }

    public function show($id)
    {
        $thuongHieu = ThuongHieu::findOrFail($id);
        return new ThuongHieuResource($thuongHieu);
    }

    public function update(UpdateThuongHieuRequest $request, $id)
    {
        $thuongHieu = ThuongHieu::findOrFail($id);
        $validated = $request->validated();

        if (isset($validated['ten_thuong_hieu']) && empty($validated['duong_dan_th'])) {
            $validated['duong_dan_th'] = Str::slug($validated['ten_thuong_hieu']) . '-' . $thuongHieu->id;
        }

        $thuongHieu->update($validated);

        return (new ThuongHieuResource($thuongHieu))
            ->additional(['message' => 'Cập nhật thương hiệu thành công!']);
    }

    public function destroy($id)
    {
        $thuongHieu = ThuongHieu::findOrFail($id);
        $thuongHieu->delete();

        return response()->json([
            'message' => 'Đã chuyển thương hiệu vào thùng rác!'
        ], 200);
    }

    public function trashed()
    {
        $thuongHieus = ThuongHieu::onlyTrashed()->latest('ngay_xoa')->paginate(10);
        return ThuongHieuResource::collection($thuongHieus);
    }

    public function restore($id)
    {
        $thuongHieu = ThuongHieu::onlyTrashed()->findOrFail($id);
        $thuongHieu->restore();

        return (new ThuongHieuResource($thuongHieu))
            ->additional(['message' => 'Khôi phục thương hiệu thành công!']);
    }

    public function forceDelete($id)
    {
        $thuongHieu = ThuongHieu::onlyTrashed()->findOrFail($id);
        $thuongHieu->forceDelete();

        return response()->json([
            'message' => 'Đã xóa vĩnh viễn thương hiệu khỏi hệ thống!'
        ], 200);
    }
}