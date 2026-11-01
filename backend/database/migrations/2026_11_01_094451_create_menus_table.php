<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('menus')->cascadeOnDelete();
            
            $table->string('vi_tri')->default('header');
            $table->string('ten');                       
            $table->integer('thu_tu')->default(0);      
            $table->boolean('trang_thai')->default(true);
            $table->string('target')->default('_self');  
            $table->string('icon')->nullable();      
            
            $table->string('loai_lien_ket')->default('tuy_chinh'); 
            $table->unsignedBigInteger('lien_ket_id')->nullable();  
            $table->string('duong_dan_tuy_chinh')->nullable();  
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};