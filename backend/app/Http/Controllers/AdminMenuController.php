<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Menu;
use App\Models\DanhMuc;
use App\Models\BaiViet;
use App\Models\ChuDeBaiViet;
use App\Http\Requests\StoreMenuRequest;
use App\Http\Requests\UpdateMenuRequest;
use App\Http\Requests\CapNhatThuTuMenuRequest;
use App\Http\Resources\MenuResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminMenuController extends Controller
{
    /**
     * Lấy danh sách toàn bộ menu cho Admin 
     */
    public function index(): JsonResponse
    {
        $menus = Menu::whereNull('parent_id')
            ->orderBy('vi_tri', 'asc')
            ->orderBy('thu_tu', 'asc')
            ->with(['children', 'danhMuc', 'baiViet', 'chuDeBaiViet'])
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => MenuResource::collection($menus)
        ]);
    }

    public function danhSachNguonLienKet(): JsonResponse
    {
        $danhMuc = DB::table('danh_muc')
            ->whereNull('deleted_at')
            ->select('id', 'ten_danh_muc as ten', 'duong_dan_dm as slug')
            ->get();

        $chuDe = DB::table('chu_de_bai_viet')
            ->select('id', 'ten_chu_de as ten', 'duong_dan_bv as slug')
            ->get();

        $baiViet = DB::table('bai_viet')
            ->where('trang_thai', 'xuat_ban')
            ->select('id', 'tieu_de as ten', 'duong_dan_bv as slug')
            ->latest('id')
            ->limit(50)
            ->get();

        return response()->json([
            'danh_muc' => $danhMuc,
            'chu_de'   => $chuDe,
            'bai_viet' => $baiViet,
        ]);
    }

    public function store(StoreMenuRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Nếu không truyền thứ tự, xếp cuối cùng
        if (!isset($validated['thu_tu'])) {
            $validated['thu_tu'] = Menu::where('vi_tri', $validated['vi_tri'])
                ->where('parent_id', $validated['parent_id'] ?? null)
                ->max('thu_tu') + 1;
        }

        $menu = Menu::create($validated);
        $this->xoaCacheMenu($menu->vi_tri);

        return response()->json([
            'status'  => 'success',
            'message' => 'Thêm menu thành công!',
            'data'    => new MenuResource($menu)
        ], 201);
    }

    /**
     * Chi tiết 1 menu item
     */
    public function show(int $id): JsonResponse
    {
        $menu = Menu::with(['children', 'danhMuc', 'baiViet'])->findOrFail($id);
        return response()->json(['data' => new MenuResource($menu)]);
    }

    /**
     * Cập nhật Menu item
     */
    public function update(UpdateMenuRequest $request, int $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $viTriCu = $menu->vi_tri;

        $menu->update($request->validated());

        // Xóa cache vị trí cũ và vị trí mới 
        $this->xoaCacheMenu($viTriCu);
        if ($menu->vi_tri !== $viTriCu) {
            $this->xoaCacheMenu($menu->vi_tri);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Cập nhật menu thành công!',
            'data'    => new MenuResource($menu)
        ]);
    }

    /**
     * Xóa menu item 
     */
    public function destroy(int $id): JsonResponse
    {
        $menu = Menu::findOrFail($id);
        $viTri = $menu->vi_tri;
        
        $menu->delete();
        $this->xoaCacheMenu($viTri);

        return response()->json([
            'status'  => 'success',
            'message' => 'Đã xóa menu thành công!'
        ]);
    }

    /**
     * Cập nhật thứ tự và cấp độ cha con sau khi kéo thả 
     */
    public function capNhatThuTu(CapNhatThuTuMenuRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            foreach ($request->menus as $item) {
                Menu::where('id', $item['id'])->update([
                    'thu_tu'    => $item['thu_tu'],
                    'parent_id' => $item['parent_id'] ?? null,
                ]);
            }
            DB::commit();

            // Xóa toàn bộ cache các vị trí menu
            $this->xoaToanBoCacheMenu();

            return response()->json([
                'status'  => 'success',
                'message' => 'Đã cập nhật vị trí các mục menu!'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status'  => 'error',
                'message' => 'Lỗi khi cập nhật thứ tự: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper xóa cache
     */
    private function xoaCacheMenu(string $viTri): void
    {
        Cache::forget("menu_public_{$viTri}");
    }

    private function xoaToanBoCacheMenu(): void
    {
        Cache::forget('menu_public_header');
        Cache::forget('menu_public_footer_chinh_sach');
        Cache::forget('menu_public_footer_lien_ket');
    }
}