<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SanPham extends Model
{
    use HasFactory, SoftDeletes;
    protected $table = 'san_pham';
    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'danh_muc_id',
        'thuong_hieu_id',
        'ten_san_pham',
        'duong_dan_sp',
        'hinh_anh',
        'gia_ban',
        'gia_giam',
        'so_luong_ton_kho',
        'don_vi_tinh',
        'mo_ta_ngan',
        'chi_tiet',
        'trang_thai',
    ];
    protected $casts = [
        'gia_ban' => 'float',
        'gia_giam' => 'float',
        'so_luong_ton_kho' => 'integer',
        'ngay_tao' => 'datetime',
        'ngay_cap_nhat' => 'datetime',
        'ngay_xoa'         => 'datetime',
    ];

    // public function danhMuc()
    // {
    //     return $this->belongsTo(DanhMuc::class, 'danh_muc_id');
    // }

    public function thuongHieu()
    {
        return $this->belongsTo(ThuongHieu::class, 'thuong_hieu_id');
    }

    public function danhGias()
    {
        return $this->hasMany(\App\Models\DanhGiaSanPham::class, 'san_pham_id', 'id');
    }
    

    public function scopeHienThi($query)
    {
        return $query->where('trang_thai', 'hien_thi'); 
    }

   
    public function scopeConHang($query)
    {
        return $query->where('so_luong_ton_kho', '>', 0);
    }

   
    public function scopeDangGiamGia($query)
    {
        return $query->whereNotNull('gia_giam')
                     ->where('gia_giam', '>', 0)
                     ->whereColumn('gia_giam', '<', 'gia_ban');
    }

    public function scopeTimKiem($query, $keyword)
    {
        if ($keyword) {
            return $query->where('ten_san_pham', 'LIKE', "%{$keyword}%");
        }
        return $query;
    }

    public function scopeTheoDanhMuc($query, $danhMucId)
    {
        if ($danhMucId) {
            return $query->where('danh_muc_id', $danhMucId);
        }
        return $query;
    }

    public function scopeTheoThuongHieu($query, $thuongHieuId)
    {
        if ($thuongHieuId) {
            return $query->where('thuong_hieu_id', $thuongHieuId);
        }
        return $query;
    }

    public function scopeTheoKhoangGia($query, $min = null, $max = null)
    {
        $bieuThucGia = 'COALESCE(NULLIF(gia_giam, 0), gia_ban)';

        if ($min !== null && $min !== '') {
            $query->whereRaw("{$bieuThucGia} >= ?", [(float) $min]);
        }

        if ($max !== null && $max !== '') {
            $query->whereRaw("{$bieuThucGia} <= ?", [(float) $max]);
        }

        return $query;
    }

    public function scopeSapXep($query, $sortBy = 'moi_nhat')
    {
        return match ($sortBy) {
            'gia_tang' => $query->orderBy('gia_ban', 'asc'),
            'gia_giam' => $query->orderBy('gia_ban', 'desc'),
            'oldest'   => $query->orderBy('ngay_tao', 'asc'),
            default    => $query->orderBy('ngay_tao', 'desc'),
        };
    }

    public function scopeTheoTieuChi($query, $tieuChi = null, $sort = 'moi_nhat')
    {
        if ($tieuChi === 'khuyen-mai') {
            return $query->whereNotNull('gia_giam')
                         ->where('gia_giam', '>', 0)
                         ->whereColumn('gia_giam', '<', 'gia_ban');
        }

        if ($tieuChi === 'noi-bat') {
            return $query->orderBy('gia_ban', 'desc');
        }

        if ($tieuChi === 'ban-chay') {
            return $query->orderBy('id', 'desc');
        }

        return $query->sapXep($sort);
    }

    public function scopeCoDanhGiaVaThongKe($query, $tuKhoa = null)
    {
        return $query->has('danhGias')
            ->withCount('danhGias')
            ->withAvg('danhGias as diem_trung_binh', 'so_sao')
            ->when($tuKhoa, fn($q) => $q->where('ten_san_pham', 'like', '%' . trim($tuKhoa) . '%'))
            ->orderByDesc('danh_gias_count');
    }
}