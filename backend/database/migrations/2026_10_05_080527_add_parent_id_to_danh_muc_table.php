<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Thêm cột parent_id vào bảng danh_muc (đã tồn tại nhưng thiếu cột này)
     */
    public function up(): void
    {
        Schema::table('danh_muc', function (Blueprint $table) {
            // Thêm parent_id nullable, tự tham chiếu chính bảng
            $table->foreignId('parent_id')
                  ->nullable()
                  ->after('id')
                  ->constrained('danh_muc')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('danh_muc', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropColumn('parent_id');
        });
    }
};
