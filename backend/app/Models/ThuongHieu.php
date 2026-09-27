<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ThuongHieu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'thuong_hieu';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ten_thuong_hieu',
        'duong_dan_th',
        'logo',
        'mo_ta',
        'trang_thai',
    ];

    protected $casts = [
        'trang_thai'   => 'string', 
        'ngay_tao'     => 'datetime',
        'ngay_cap_nhat' => 'datetime',
        'ngay_xoa'      => 'datetime',
    ];

    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'thuong_hieu_id');
    }
}