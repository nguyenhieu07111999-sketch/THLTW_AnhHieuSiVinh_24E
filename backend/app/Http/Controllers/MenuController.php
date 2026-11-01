<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Http\Resources\MenuResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class MenuController extends Controller
{
    
    public function layTheoViTri(string $viTri): JsonResponse
    {
        $cacheKey = "menu_public_{$viTri}";

        $menus = Cache::rememberForever($cacheKey, function () use ($viTri) {
            return Menu::where('vi_tri', $viTri)
                ->whereNull('parent_id')
                ->where('trang_thai', true)
                ->orderBy('thu_tu', 'asc')
                ->with(['children' => function ($query) {
                    $query->where('trang_thai', true)->orderBy('thu_tu', 'asc');
                }, 'danhMuc', 'baiViet', 'chuDeBaiViet'])
                ->get();
        });

        return response()->json([
            'status' => 'success',
            'data'   => MenuResource::collection($menus)
        ]);
    }
}