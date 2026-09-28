<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class TaiKhoanQuanTri extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'tai_khoan_quan_tri';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = ['ho_ten', 'email', 'mat_khau', 'vai_tro', 'trang_thai'];

    protected $hidden = ['mat_khau'];
}