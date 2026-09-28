<?php

use App\Http\Controllers\DanhMucController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\ThuongHieuController;
use App\Http\Controllers\DanhMucController;
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working!']);
});



Route::apiResource('danh-muc', DanhMucController::class);


Route::prefix('san-pham')->group(function () {
    Route::get('/thung-rac', [SanPhamController::class, 'trashed']);
    Route::post('/{id}/khoi-phuc', [SanPhamController::class, 'restore']);
    Route::delete('/{id}/xoa-vinh-vien', [SanPhamController::class, 'forceDelete']);

    Route::get('/', [SanPhamController::class, 'index']);
    Route::post('/', [SanPhamController::class, 'store']);
    Route::get('/{id}', [SanPhamController::class, 'show']);
    Route::put('/{id}', [SanPhamController::class, 'update']);
    Route::delete('/{id}', [SanPhamController::class, 'destroy']);
});

//Thương hiệu
Route::prefix('thuong-hieu')->group(function () {
    Route::get('/thung-rac', [ThuongHieuController::class, 'trashed']);
    Route::post('/{id}/khoi-phuc', [ThuongHieuController::class, 'restore']);
    Route::delete('/{id}/xoa-vinh-vien', [ThuongHieuController::class, 'forceDelete']);

<<<<<<< Updated upstream
    Route::get('/', [ThuongHieuController::class, 'index']);          
    Route::post('/', [ThuongHieuController::class, 'store']);         
    Route::get('/{id}', [ThuongHieuController::class, 'show']);       
    Route::put('/{id}', [ThuongHieuController::class, 'update']);     
    Route::delete('/{id}', [ThuongHieuController::class, 'destroy']);  
});
=======
    Route::get('/', [ThuongHieuController::class, 'index']);
    Route::post('/', [ThuongHieuController::class, 'store']);
    Route::get('/{id}', [ThuongHieuController::class, 'show']);
    Route::put('/{id}', [ThuongHieuController::class, 'update']);
    Route::delete('/{id}', [ThuongHieuController::class, 'destroy']);

});
Route::apiResource('danh-muc', DanhMucController::class);
>>>>>>> Stashed changes
