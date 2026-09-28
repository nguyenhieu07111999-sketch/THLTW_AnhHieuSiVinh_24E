<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ThuongHieu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'thuong_hieu';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ten_thuong_hieu',
        'duong_dan_th',
        'logo',
        'mo_ta',
        'trang_thai',
    ];

    protected $casts = [
        'trang_thai'   => 'string', 
        'ngay_tao'     => 'datetime',
        'ngay_cap_nhat' => 'datetime',
        'ngay_xoa'      => 'datetime',
    ];

    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'thuong_hieu_id');
    }

    // ==================== LOCAL SCOPES ====================

    /**
     * 1. Lọc thương hiệu đang hiển thị/hoạt động (Dùng cho Client)
     */
    public function scopeHienThi($query)
    {
        return $query->where('trang_thai', 'hien_thi'); // Hoặc 'hoat_dong' tùy giá trị enum/string trong CSDL
    }

    /**
     * 2. Tìm kiếm thương hiệu theo tên
     */
    public function scopeTimKiem($query, $keyword)
    {
        if (!empty($keyword)) {
            return $query->where('ten_thuong_hieu', 'LIKE', "%{$keyword}%");
        }
        return $query;
    }

    /**
     * 3. Lọc các thương hiệu đang có sản phẩm (Dành cho trang lọc sản phẩm)
     */
    public function scopeCoSanPham($query)
    {
        return $query->has('sanPhams');
    }

    /**
     * 4. Sắp xếp thương hiệu (Mới nhất, tên A-Z hoặc Z-A)
     */
    public function scopeSapXep($query, $sortBy = 'moi_nhat')
    {
        return match ($sortBy) {
            'ten_az'  => $query->orderBy('ten_thuong_hieu', 'asc'),
            'ten_za'  => $query->orderBy('ten_thuong_hieu', 'desc'),
            'cu_nhat' => $query->orderBy('ngay_tao', 'asc'),
            default   => $query->orderBy('ngay_tao', 'desc'),
        };
    }
}