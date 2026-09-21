<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\ThuongHieuController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working!']);
});

//Sp
Route::get('/san-pham', [SanPhamController::class, 'index']);

//Thương hiệu
Route::get('/thuong-hieu', [ThuongHieuController::class, 'index']);