<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('danh_gia_san_pham', function (Blueprint $table) {
            $table->id();
            
            $table->unsignedBigInteger('san_pham_id');
            $table->unsignedBigInteger('nguoi_dung_id');
            
            $table->tinyInteger('so_sao')->default(5); 
            $table->text('noi_dung'); 
            $table->json('tep_dinh_kem')->nullable(); 
            
            $table->enum('trang_thai', ['hien_thi', 'an'])->default('hien_thi');
            
            $table->timestamp('ngay_tao')->useCurrent();
            $table->timestamp('ngay_cap_nhat')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('san_pham_id')->references('id')->on('san_pham')->onDelete('cascade');
            $table->foreign('nguoi_dung_id')->references('id')->on('tai_khoan_nguoi_dung')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('danh_gia_san_pham');
    }
};