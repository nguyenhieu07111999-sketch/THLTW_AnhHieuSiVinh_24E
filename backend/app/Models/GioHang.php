<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class GioHang extends Model
{
    use HasFactory;

    protected $table = 'gio_hang';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'nguoi_dung_id',
    ];

    protected $casts = [
        'ngay_tao'      => 'datetime',
        'ngay_cap_nhat' => 'datetime',
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(TaiKhoanNguoiDung::class, 'nguoi_dung_id');
    }

    public function chiTiets()
    {
        return $this->hasMany(ChiTietGioHang::class, 'gio_hang_id');
    }

    // --- LOCAL SCOPES ---

    /**
     * Scope lọc giỏ hàng theo ID người dùng
     */
    public function scopeTheoNguoiDung(Builder $query, int $nguoiDungId): Builder
    {
        return $query->where('nguoi_dung_id', $nguoiDungId);
    }

    /**
     * Scope eagel load sẵn các chi tiết và sản phẩm liên quan
     */
    public function scopeKemChiTiet(Builder $query): Builder
    {
        return $query->with(['chiTiets.sanPham']);
    }
}