<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\ThuongHieuController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working!']);
});

// Đăng ký / đăng nhập
Route::post('/dang-ky', [AuthController::class, 'register']);
Route::post('/dang-nhap', [AuthController::class, 'login']);
Route::post('/admin/dang-nhap', [AuthController::class, 'adminLogin']);

// ===== CÔNG KHAI: chỉ xem =====
Route::apiResource('danh-muc', DanhMucController::class)->only(['index', 'show']);

Route::get('/san-pham', [SanPhamController::class, 'index']);
Route::get('/san-pham/{id}', [SanPhamController::class, 'show'])->whereNumber('id');

Route::get('/thuong-hieu', [ThuongHieuController::class, 'index']);
Route::get('/thuong-hieu/{id}', [ThuongHieuController::class, 'show'])->whereNumber('id');

// ===== CHỈ ADMIN (có token): thêm, sửa, xóa =====
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::apiResource('danh-muc', DanhMucController::class)->except(['index', 'show']);

    Route::prefix('san-pham')->group(function () {
        Route::get('/thung-rac', [SanPhamController::class, 'trashed']);
        Route::post('/{id}/khoi-phuc', [SanPhamController::class, 'restore']);
        Route::delete('/{id}/xoa-vinh-vien', [SanPhamController::class, 'forceDelete']);

        Route::post('/', [SanPhamController::class, 'store']);
        Route::put('/{id}', [SanPhamController::class, 'update']);
        Route::delete('/{id}', [SanPhamController::class, 'destroy']);
    });

    Route::prefix('thuong-hieu')->group(function () {
        Route::get('/thung-rac', [ThuongHieuController::class, 'trashed']);
        Route::post('/{id}/khoi-phuc', [ThuongHieuController::class, 'restore']);
        Route::delete('/{id}/xoa-vinh-vien', [ThuongHieuController::class, 'forceDelete']);

        Route::post('/', [ThuongHieuController::class, 'store']);
        Route::put('/{id}', [ThuongHieuController::class, 'update']);
        Route::delete('/{id}', [ThuongHieuController::class, 'destroy']);
    });
});