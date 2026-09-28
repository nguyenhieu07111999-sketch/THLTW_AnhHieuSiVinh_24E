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
    // GET /api/danh-muc?per_page=10&page=1
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->input('per_page', 10);

        $danhMucs = DanhMuc::orderBy('ngay_tao', 'desc')->paginate($perPage);

        return DanhMucResource::collection($danhMucs);
    }

    // GET /api/danh-muc/{id}
    public function show($id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        return response()->json(['success' => true, 'data' => new DanhMucResource($danhMuc)]);
    }

    // POST /api/danh-muc
    public function store(StoreDanhMucRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['duong_dan_dm'] = $validated['duong_dan_dm']
            ?? $this->taoSlugDuyNhat($validated['ten_danh_muc']);

        $danhMuc = DanhMuc::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Thêm danh mục thành công',
            'data' => new DanhMucResource($danhMuc),
        ], 201);
    }

    // PUT/PATCH /api/danh-muc/{id}
    public function update(UpdateDanhMucRequest $request, $id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        $validated = $request->validated();
        $validated['duong_dan_dm'] = $validated['duong_dan_dm']
            ?? $this->taoSlugDuyNhat($validated['ten_danh_muc'], $danhMuc->id);

        $danhMuc->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật danh mục thành công',
            'data' => new DanhMucResource($danhMuc),
        ]);
    }

    // DELETE /api/danh-muc/{id}
    public function destroy($id): JsonResponse
    {
        $danhMuc = DanhMuc::find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        $danhMuc->delete();

        return response()->json(['success' => true, 'message' => 'Xoá danh mục thành công']);
    }

    // Tạo slug không trùng: thit-sach, thit-sach-2, thit-sach-3...
    private function taoSlugDuyNhat(string $ten, ?int $boQuaId = null): string
    {
        $goc = Str::slug($ten);
        $slug = $goc;
        $i = 2;

        while (
            DanhMuc::where('duong_dan_dm', $slug)
                ->when($boQuaId, fn($q) => $q->where('id', '!=', $boQuaId))
                ->exists()
        ) {
            $slug = $goc . '-' . $i++;
        }

        return $slug;
    }
}