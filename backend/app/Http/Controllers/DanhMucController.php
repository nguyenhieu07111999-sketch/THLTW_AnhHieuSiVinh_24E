<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDanhMucRequest;
use App\Http\Requests\UpdateDanhMucRequest;
use App\Http\Resources\DanhMucResource;
use App\Models\DanhMuc;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class DanhMucController extends Controller
{
    // GET /api/danh-muc?per_page=10&page=1
    // GET /api/danh-muc?search=rau
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->input('per_page', 10);
        $hasParentCol = Schema::hasColumn('danh_muc', 'parent_id');

        $query = DanhMuc::query()->orderBy('ngay_tao', 'desc');

        if ($hasParentCol) {
            $query->with('children');
            if ($request->filled('parent_id')) {
                $query->where('parent_id', $request->input('parent_id'));
            } else if (!$request->filled('all') && !$request->filled('search')) {
                $query->whereNull('parent_id');
            }
        }

        if ($request->filled('search')) {
            $keyword = $request->input('search');
            $query->where('ten_danh_muc', 'LIKE', "%{$keyword}%");
        }

        if ($request->boolean('all')) {
            return DanhMucResource::collection($query->get());
        }

        return DanhMucResource::collection($query->paginate($perPage));
    }

    // GET /api/danh-muc/{id}
    public function show($id): JsonResponse
    {
        $hasParentCol = Schema::hasColumn('danh_muc', 'parent_id');
        $query = DanhMuc::query();
        if ($hasParentCol) {
            $query->with(['children', 'parent']);
        }
        $danhMuc = $query->find($id);

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

        if (!Schema::hasColumn('danh_muc', 'parent_id')) {
            unset($validated['parent_id']);
        }

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

        if (!Schema::hasColumn('danh_muc', 'parent_id')) {
            unset($validated['parent_id']);
        }

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

        // Không cho xoá danh mục cha khi còn danh mục con (nếu bảng có parent_id)
        if (Schema::hasColumn('danh_muc', 'parent_id') && $danhMuc->children()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xoá: danh mục còn danh mục con',
            ], 409);
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