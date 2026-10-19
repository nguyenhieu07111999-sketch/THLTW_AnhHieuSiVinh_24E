<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChuDeBaiViet extends Model
{
    protected $table = 'chu_de_bai_viet';

    // Khai báo đúng tên cột timestamp của bảng này
    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    // Hoặc nếu không cần Eloquent tự quản lý thời gian, bạn có thể tắt luôn:
    // public $timestamps = false;

    protected $fillable = [
        'ten_chu_de',
        'duong_dan_bv',
        'mo_ta',
    ];
}