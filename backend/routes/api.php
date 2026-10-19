<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\ThuongHieuController;
use App\Http\Controllers\GioHangController;
use App\Http\Controllers\NguoiDungController;
use App\Http\Controllers\BaiVietController;
use App\Http\Controllers\DonHangController;
use App\Http\Controllers\TaiKhoanController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working!']);
});

// Đăng ký / đăng nhập
Route::post('/dang-ky', [AuthController::class, 'register'])->middleware('throttle:10,1');
Route::post('/dang-nhap', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/admin/dang-nhap', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1');

// Đăng xuất
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/dang-xuat', [AuthController::class, 'logout']);

    Route::prefix('tai-khoan')->group(function () {
        Route::get('/', [TaiKhoanController::class, 'hoSo']);
        Route::get('/don-hang', [TaiKhoanController::class, 'danhSachDonHang']);
        Route::post('/cap-nhat', [TaiKhoanController::class, 'capNhatHoSo']);
        Route::get('/don-hang/{id}', [TaiKhoanController::class, 'chiTietDonHang'])->whereNumber('id');
    });

    Route::prefix('gio-hang')->group(function () {
        Route::get('/', [GioHangController::class, 'index']);
        Route::post('/', [GioHangController::class, 'store']);
        Route::put('/{id}', [GioHangController::class, 'update']);
        Route::delete('/{id}', [GioHangController::class, 'destroy']);
    });
});

Route::apiResource('danh-muc', DanhMucController::class)
    ->only(['index', 'show'])
    ->whereNumber('danh_muc');

Route::get('/san-pham', [SanPhamController::class, 'index']);
Route::get('/san-pham/{id}', [SanPhamController::class, 'show'])->whereNumber('id');

Route::get('/thuong-hieu', [ThuongHieuController::class, 'index']);
Route::get('/thuong-hieu/{id}', [ThuongHieuController::class, 'show'])->whereNumber('id');

Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    Route::get('/danh-muc/thung-rac', [DanhMucController::class, 'trashed']);
    Route::post('/danh-muc/{id}/khoi-phuc', [DanhMucController::class, 'restore'])->whereNumber('id');
    Route::delete('/danh-muc/{id}/xoa-vinh-vien', [DanhMucController::class, 'forceDelete'])->whereNumber('id');
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

    Route::prefix('nguoi-dung')->group(function () {
        Route::get('/', [NguoiDungController::class, 'index']);
        Route::get('/thung-rac', [NguoiDungController::class, 'thungRac']);
        Route::get('/{id}/don-hang', [NguoiDungController::class, 'donHang'])->whereNumber('id');
        Route::post('/', [NguoiDungController::class, 'store']);
        Route::put('/{id}', [NguoiDungController::class, 'update']);
        Route::patch('/{id}/khoa', [NguoiDungController::class, 'doiTrangThai']);
        Route::delete('/{id}', [NguoiDungController::class, 'destroy']);
        Route::post('/{id}/khoi-phuc', [NguoiDungController::class, 'khoiPhuc']);
        Route::delete('/{id}/xoa-vinh-vien', [NguoiDungController::class, 'xoaVinhVien']);
    });

    Route::prefix('bai-viet')->group(function () {
        Route::get('/', [BaiVietController::class, 'index']);
        Route::get('/chu-de', [BaiVietController::class, 'chuDe']);
        Route::post('/', [BaiVietController::class, 'store']);
        Route::put('/{id}', [BaiVietController::class, 'update']);
        Route::patch('/{id}/trang-thai', [BaiVietController::class, 'doiTrangThai']);
        Route::delete('/{id}', [BaiVietController::class, 'destroy']);
    });

    Route::apiResource('don-hang', DonHangController::class)->except(['store']);
});