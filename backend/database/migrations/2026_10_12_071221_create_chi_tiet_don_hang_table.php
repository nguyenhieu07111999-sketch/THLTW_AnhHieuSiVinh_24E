<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chi_tiet_don_hang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('don_hang_id')->constrained('don_hang')->cascadeOnDelete(); 
            $table->foreignId('san_pham_id')->nullable()->constrained('san_pham')->nullOnDelete(); 
            
            // Lưu cứng thông tin tại thời điểm mua 
            $table->string('ten_san_pham'); 
            $table->string('hinh_anh')->nullable();
            $table->decimal('gia_ban', 12, 2); 
            $table->decimal('gia_giam', 12, 2)->nullable(); 
            $table->integer('so_luong');
            $table->decimal('thanh_tien', 12, 2); 

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_don_hang');
    }
};
