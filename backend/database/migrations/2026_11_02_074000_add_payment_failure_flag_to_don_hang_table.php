<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('don_hang', function (Blueprint $table) {
            $table->boolean('thanh_toan_that_bai')->default(false)->after('trang_thai_thanh_toan');
        });
    }

    public function down(): void
    {
        Schema::table('don_hang', function (Blueprint $table) {
            $table->dropColumn('thanh_toan_that_bai');
        });
    }
};
