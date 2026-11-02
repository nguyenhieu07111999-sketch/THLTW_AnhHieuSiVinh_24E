<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChuDeBaiViet extends Model
{
    protected $table = 'chu_de_bai_viet';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';



    protected $fillable = [
        'ten_chu_de',
        'duong_dan_bv',
        'mo_ta',
    ];
}