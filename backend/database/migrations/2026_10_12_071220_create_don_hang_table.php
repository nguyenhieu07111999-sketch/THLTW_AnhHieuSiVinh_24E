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
        Schema::create('don_hang', function (Blueprint $table) {
        $table->id();
        $table->foreignId('nguoi_dung_id')->nullable()->constrained('tai_khoan_nguoi_dung')->nullOnDelete(); 
        
        // Thông tin người nhận 
        $table->string('ten_nguoi_nhan');
        $table->string('so_dien_thoai_nhan');
        $table->text('dia_chi_nhan');
        $table->text('ghi_chu')->nullable();

        // Tài chính
        $table->decimal('tong_tien', 12, 2); 
        $table->decimal('phi_vanchuyen', 10, 2)->default(0);
        $table->decimal('thanh_tien', 12, 2); 

        // Trạng thái đơn hàng & Thanh toán
        $table->enum('trang_thai_don_hang', [
            'cho_xac_nhan', 
            'da_xac_nhan',  
            'dang_giao',    
            'hoan_thanh',   
            'da_huy'        
        ])->default('cho_xac_nhan');

        $table->enum('trang_thai_thanh_toan', [
            'chua_thanh_toan',
            'da_thanh_toan',
            'hoan_tien'
        ])->default('chua_thanh_toan');

        $table->string('phuong_thuc_thanh_toan')->default('COD'); 

        $table->timestamps();
        $table->timestamp('ngay_xoa')->nullable();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('don_hang');
    }
};
