<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChiTietDonHang extends Model
{
    use HasFactory;

    protected $table = 'chi_tiet_don_hang';

    protected $fillable = [
        'don_hang_id',
        'san_pham_id',
        'ten_san_pham',
        'hinh_anh',
        'gia_ban',
        'gia_giam',
        'so_luong',
        'thanh_tien',
    ];

    // Mối quan hệ: Chi tiết thuộc về một đơn hàng
    public function donHang()
    {
        return $this->belongsTo(DonHang::class, 'don_hang_id');
    }

    // Mối quan hệ: Liên kết ngược lại sản phẩm gốc (nếu sản phẩm còn tồn tại)
    public function sanPham()
    {
        return $this->belongsTo(SanPham::class, 'san_pham_id');
    }
}