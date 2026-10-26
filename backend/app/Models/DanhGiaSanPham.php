<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DanhGiaSanPham extends Model
{
    protected $table = 'danh_gia_san_pham';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'san_pham_id',
        'nguoi_dung_id',
        'so_sao',
        'noi_dung',
        'tep_dinh_kem',
        'trang_thai',
    ];

    protected $casts = [
        'tep_dinh_kem' => 'array',
        'so_sao'       => 'integer',
    ];

    public function nguoiDung()
    {
        return $this->belongsTo(TaiKhoanNguoiDung::class, 'nguoi_dung_id', 'id');
    }

    public function scopeCuaSanPham($query, $sanPhamId)
    {
        return $query->where('san_pham_id', $sanPhamId);
    }

    public function scopeHienThi($query)
    {
        return $query->where('trang_thai', 'hien_thi');
    }

    public function scopeTheoSoSao($query, $soSao = null)
    {
        if (!empty($soSao)) {
            return $query->where('so_sao', (int)$soSao);
        }
        return $query;
    }
}