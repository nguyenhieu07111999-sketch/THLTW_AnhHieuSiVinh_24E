<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DanhMucController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return response()->json(['message' => 'API is working!']);
});


Route::apiResource('danh-muc', DanhMucController::class);