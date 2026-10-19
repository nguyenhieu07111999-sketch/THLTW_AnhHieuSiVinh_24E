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
        Schema::table('don_hang', function (Blueprint $table) {
            $table->index(['nguoi_dung_id', 'created_at'], 'don_hang_nguoi_dung_created_idx');
        });
    }

    public function down(): void
    {
        Schema::table('don_hang', function (Blueprint $table) {
            $table->dropIndex('don_hang_nguoi_dung_created_idx');
        });
    }
};
