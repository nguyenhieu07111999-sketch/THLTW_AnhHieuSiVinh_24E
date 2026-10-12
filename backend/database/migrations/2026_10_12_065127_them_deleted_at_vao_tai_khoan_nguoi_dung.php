<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private string $bang = 'tai_khoan_nguoi_dung';

    public function up(): void
    {
        if (Schema::hasTable($this->bang) && !Schema::hasColumn($this->bang, 'deleted_at')) {
            Schema::table($this->bang, function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn($this->bang, 'deleted_at')) {
            Schema::table($this->bang, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};