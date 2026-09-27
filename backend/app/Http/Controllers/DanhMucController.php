<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDanhMucRequest;
use App\Http\Requests\UpdateDanhMucRequest;
use App\Http\Resources\DanhMucResource;
use App\Models\DanhMuc;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class DanhMucController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->get('per_page', 10);

        $danhMucs = DanhMuc::orderBy('ngay_tao', 'desc')->paginate($perPage);

        return DanhMucResource::collection($danhMucs);
    }

    public function show($id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        return response()->json(['success' => true, 'data' => new DanhMucResource($danhMuc)]);
    }

    public function store(StoreDanhMucRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['duong_dan_dm'] = $validated['duong_dan_dm'] ?? Str::slug($validated['ten_danh_muc']);

        $danhMuc = DanhMuc::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm danh mục thành công',
            'data'    => new DanhMucResource($danhMuc),
        ], 201);
    }

    public function update(UpdateDanhMucRequest $request, $id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        $validated = $request->validated();
        $validated['duong_dan_dm'] = $validated['duong_dan_dm'] ?? Str::slug($validated['ten_danh_muc']);

        $danhMuc->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data'    => new DanhMucResource($danhMuc),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        $danhMuc->delete();

        return response()->json(['success' => true, 'message' => 'Xoá danh mục thành công']);
    }
}