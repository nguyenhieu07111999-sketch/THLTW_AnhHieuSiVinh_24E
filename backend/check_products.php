<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$products = Illuminate\Support\Facades\DB::table('san_pham')->get();
echo "TOTAL PRODUCTS: " . count($products) . "\n";
foreach ($products as $p) {
    echo "ID: {$p->id} | Name: {$p->ten_san_pham} | Image: " . ($p->hinh_anh ? 'YES' : 'NO') . " | DeletedAt: " . ($p->ngay_xoa ?? 'NONE') . "\n";
}
