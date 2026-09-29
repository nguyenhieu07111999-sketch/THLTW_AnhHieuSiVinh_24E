<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class ChiTietGioHang extends Model
{
    use HasFactory;

    protected $table = 'chi_tiet_gio_hang';
    public $timestamps = false; 

    protected $fillable = [
        'gio_hang_id',
        'san_pham_id',
        'so_luong',
    ];

    public function gioHang()
    {
        return $this->belongsTo(GioHang::class, 'gio_hang_id');
    }

    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'san_pham_id');
    }

    // --- LOCAL SCOPES ---

    public function scopeTheoSanPham(Builder $query, int $gioHangId, int $sanPhamId): Builder
    {
        return $query->where('gio_hang_id', $gioHangId)
                     ->where('san_pham_id', $sanPhamId);
    }
}