<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThuongHieu extends Model
{
    use HasFactory;

    protected $table = 'thuong_hieu';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'ten_thuong_hieu',
        'duong_dan_th',
        'logo',
        'mo_ta',
        'trang_thai',
    ];

    protected $casts = [
        'trang_thai' => 'integer',
        'ngay_tao' => 'datetime',
        'ngay_cap_nhat' => 'datetime',
    ];

    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'thuong_hieu_id');
    }
}