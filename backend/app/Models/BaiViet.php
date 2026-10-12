<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BaiViet extends Model
{
    // use SoftDeletes;

    protected $table = 'bai_viet';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'tieu_de',
        'duong_dan',
        'anh_bia',
        'mo_ta_ngan',
        'noi_dung',
        'tac_gia',
        'trang_thai',
        'ngay_dang',
    ];

    protected $casts = [
        'ngay_dang' => 'datetime',
    ];
}