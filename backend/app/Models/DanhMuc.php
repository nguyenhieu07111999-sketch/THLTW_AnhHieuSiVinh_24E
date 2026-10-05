<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DanhMuc extends Model
{
    use SoftDeletes;

    protected $table = 'danh_muc';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'deleted_at';

    protected $fillable = [
        'parent_id',
        'ten_danh_muc',
        'duong_dan_dm',
        'hinh_anh',
        'mo_ta',
        'sp_noi_bat',
    ];

    protected $casts = [
        'sp_noi_bat' => 'boolean',
    ];

    // Danh mục cha
    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    // Danh mục con
    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }
}