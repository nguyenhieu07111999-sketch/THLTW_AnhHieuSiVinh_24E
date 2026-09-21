<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanPham extends Model
{
    use HasFactory;
    protected $table = 'san_pham';
    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'danh_muc_id',
        'thuong_hieu_id',
        'ten_san_pham',
        'duong_dan_sp',
        'hinh_anh',
        'gia_ban',
        'gia_giam',
        'so_luong_ton_kho',
        'don_vi_tinh',
        'mo_ta_ngan',
        'chi_tiet',
        'trang_thai',
    ];
    protected $casts = [
        'gia_ban' => 'float',
        'gia_giam' => 'float',
        'so_luong_ton_kho' => 'integer',
        'ngay_tao' => 'datetime',
        'ngay_cap_nhat' => 'datetime',
    ];
}