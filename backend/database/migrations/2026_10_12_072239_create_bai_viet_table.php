<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bai_viet', function (Blueprint $table) {
            $table->id();
            $table->string('tieu_de');
            $table->string('duong_dan')->unique();
            $table->string('anh_bia', 500)->nullable();
            $table->string('mo_ta_ngan', 500)->nullable();
            $table->longText('noi_dung');
            $table->string('tac_gia')->nullable();
            $table->string('trang_thai', 20)->default('nhap'); // nhap | dang
            $table->timestamp('ngay_dang')->nullable();
            $table->timestamp('ngay_tao')->nullable();
            $table->timestamp('ngay_cap_nhat')->nullable();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bai_viet');
    }
};