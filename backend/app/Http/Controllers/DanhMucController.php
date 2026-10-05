<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDanhMucRequest;
use App\Http\Requests\UpdateDanhMucRequest;
use App\Http\Resources\DanhMucResource;
use App\Models\DanhMuc;
use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DanhMucController extends Controller
{
    // GET /api/danh-muc?per_page=10&page=1        -> danh mục cha (kèm children)
    // GET /api/danh-muc?parent_id=2               -> các danh mục con của id=2
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->input('per_page', 10);

        $query = DanhMuc::with('children')->orderBy('ngay_tao', 'desc');

        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->input('parent_id'));
        } else {
            $query->whereNull('parent_id');
        }

        return DanhMucResource::collection($query->paginate($perPage));
    }

    // GET /api/danh-muc/{id}
    public function show($id): JsonResponse
    {
        $danhMuc = DanhMuc::with(['children', 'parent'])->find($id);

        if (!$danhMuc) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy danh mục'], 404);
        }

        return response()->json(['success' => true, 'data' => new DanhMucResource($danhMuc)]);
    }

    // POST /api/danh-muc
    public function store(StoreDanhMucRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $gocSlug = !empty($validated['duong_dan_dm']) ? $validated['duong_dan_dm'] : $validated['ten_danh_muc'];
        $validated['duong_dan_dm'] = $this->taoSlugDuyNhat($gocSlug);

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
        if (isset($validated['ten_danh_muc'])) {
            $gocSlug = !empty($validated['duong_dan_dm']) ? $validated['duong_dan_dm'] : $validated['ten_danh_muc'];
            $validated['duong_dan_dm'] = $this->taoSlugDuyNhat($gocSlug, $danhMuc->id);
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

        DB::transaction(function () use ($danhMuc) {
            $this->chuyenDanhMucConVaoThungRac($danhMuc);
            $danhMuc->delete();
        });

        return response()->json(['success' => true, 'message' => 'Đã chuyển danh mục vào thùng rác']);
    }

    // GET /api/danh-muc/thung-rac
    public function trashed(Request $request): AnonymousResourceCollection
    {
        $perPage = min(max((int) $request->input('per_page', 10), 1), 200);

        return DanhMucResource::collection(
            DanhMuc::onlyTrashed()
                ->with(['parent' => fn ($query) => $query->withTrashed()])
                ->orderByDesc('deleted_at')
                ->paginate($perPage)
        );
    }

    // POST /api/danh-muc/{id}/khoi-phuc
    public function restore($id): JsonResponse
    {
        $danhMuc = DanhMuc::withTrashed()->find($id);

        if (!$danhMuc || !$danhMuc->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Danh mục không còn trong thùng rác. Danh sách sẽ được tải lại.',
            ], 404);
        }

        if ($danhMuc->parent_id) {
            $danhMucCha = DanhMuc::withTrashed()->find($danhMuc->parent_id);
            if ($danhMucCha && $danhMucCha->trashed()) {
                $danhMucCha->restore();
            }
        }

        DB::transaction(function () use ($danhMuc) {
            $danhMuc->restore();
            $this->khoiPhucDanhMucCon($danhMuc);
        });

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục danh mục thành công',
            'data' => new DanhMucResource($danhMuc),
        ]);
    }

    // DELETE /api/danh-muc/{id}/xoa-vinh-vien
    public function forceDelete($id): JsonResponse
    {
        $danhMuc = DanhMuc::withTrashed()->find($id);

        if (!$danhMuc || !$danhMuc->trashed()) {
            return response()->json([
                'success' => false,
                'message' => 'Danh mục không còn trong thùng rác. Danh sách sẽ được tải lại.',
            ], 404);
        }

        $idsDanhMucCon = $this->layIdDanhMucCon($danhMuc);
        $idsCanXoa = [$danhMuc->id, ...$idsDanhMucCon];

        if (SanPham::withTrashed()->whereIn('danh_muc_id', $idsCanXoa)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa vĩnh viễn vì danh mục vẫn có sản phẩm liên kết. Hãy chuyển sản phẩm sang danh mục khác trước.',
            ], 409);
        }

        DB::transaction(function () use ($danhMuc, $idsDanhMucCon) {
            DanhMuc::withTrashed()->whereIn('id', $idsDanhMucCon)->forceDelete();
            $danhMuc->forceDelete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Đã xóa vĩnh viễn danh mục',
        ]);
    }

    private function chuyenDanhMucConVaoThungRac(DanhMuc $danhMuc): void
    {
        foreach ($danhMuc->children()->get() as $danhMucCon) {
            $this->chuyenDanhMucConVaoThungRac($danhMucCon);
            $danhMucCon->delete();
        }
    }

    private function khoiPhucDanhMucCon(DanhMuc $danhMuc): void
    {
        foreach ($danhMuc->children()->onlyTrashed()->get() as $danhMucCon) {
            $danhMucCon->restore();
            $this->khoiPhucDanhMucCon($danhMucCon);
        }
    }

    private function layIdDanhMucCon(DanhMuc $danhMuc): array
    {
        $ids = [];
        foreach ($danhMuc->children()->withTrashed()->get() as $danhMucCon) {
            $ids[] = $danhMucCon->id;
            $ids = [...$ids, ...$this->layIdDanhMucCon($danhMucCon)];
        }

        return $ids;
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