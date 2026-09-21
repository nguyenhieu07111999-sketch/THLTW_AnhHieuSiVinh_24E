<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'danh_muc_cha_id', 'ten_danh_muc', 'duong_dan_dm',
    'hinh_anh', 'mo_ta', 'sp_noi_bat', 'trang_thai', 'thu_tu',
])]
class Category extends Model
{
    protected $table = 'danh_muc';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected function casts(): array
    {
        return ['sp_noi_bat' => 'boolean'];
    }

    // Quan hệ: một danh mục có nhiều danh mục con
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'danh_muc_cha_id');
    }

    // Scope: Category::active() -> lọc trang_thai = 'hien_thi'
    public function scopeActive(Builder $query): void
    {
        $query->where('trang_thai', 'hien_thi');
    }
}