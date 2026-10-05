<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Xóa các sản phẩm lỗi ID 8 và 11 (hoặc sản phẩm không có hình ảnh / tên sai)
$deleted = Illuminate\Support\Facades\DB::table('san_pham')
    ->whereIn('id', [8, 11])
    ->orWhereNull('hinh_anh')
    ->orWhere('hinh_anh', '')
    ->delete();

echo "Đã xóa {$deleted} sản phẩm lỗi khỏi cơ sở dữ liệu!\n";
