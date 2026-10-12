<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class DonHang extends Model
{
    use HasFactory;

    protected $table = 'don_hang';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'nguoi_dung_id',
        'ten_nguoi_nhan',
        'so_dien_thoai_nhan',
        'dia_chi_nhan',
        'ghi_chu',
        'tong_tien',
        'phi_vanchuyen',
        'thanh_tien',
        'trang_thai_don_hang',
        'trang_thai_thanh_toan',
        'phuong_thuc_thanh_toan',
    ];

    public function chiTiet()
    {
        return $this->hasMany(ChiTietDonHang::class, 'don_hang_id');
    }

    public function nguoiDung()
    {
        return $this->belongsTo(TaiKhoanNguoiDung::class, 'nguoi_dung_id');
    }

    public function scopeTrangThai($query, $trangThai)
    {
        if (!empty($trangThai)) {
            return $query->where('trang_thai_don_hang', $trangThai);
        }
        return $query;
    }

    public function scopeTimKiem($query, $tuKhoa)
    {
        if (!empty($tuKhoa)) {
            return $query->where(function($q) use ($tuKhoa) {
                $q->where('id', 'like', "%{$tuKhoa}%")
                  ->orWhere('ten_nguoi_nhan', 'like', "%{$tuKhoa}%")
                  ->orWhere('so_dien_thoai_nhan', 'like', "%{$tuKhoa}%");
            });
        }
        return $query;
    }
}