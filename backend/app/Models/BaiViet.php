<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BaiViet extends Model
{
    protected $table = 'bai_viet';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'chu_de_id',
        'tieu_de',
        'duong_dan_bv',
        'anh_dai_dien', 
        'tom_tat',      
        'noi_dung',
        'luot_xem',
        'trang_thai',
    ];

    public function chuDe(): BelongsTo
    {
        return $this->belongsTo(ChuDeBaiViet::class, 'chu_de_id', 'id');
    }

    public function scopeTimKiem($query, $tuKhoa = null)
    {
        if (!empty($tuKhoa)) {
            return $query->where('tieu_de', 'like', '%' . trim($tuKhoa) . '%');
        }
        return $query;
    }

    public function scopeTheoTrangThai($query, $trangThai = null)
    {
        if (!empty($trangThai) && $trangThai !== 'tat-ca') {
            return $query->where('trang_thai', $trangThai);
        }
        return $query;
    }

    public static function taoDuongDanDuyNhat(string $tieuDe, ?int $boQuaId = null): string
    {
        $goc = Str::slug($tieuDe) ?: 'bai-viet';
        $duongDan = $goc;
        $i = 2;

        while (
            static::where('duong_dan_bv', $duongDan)
                ->when($boQuaId, fn($q) => $q->where('id', '!=', $boQuaId))
                ->exists()
        ) {
            $duongDan = $goc . '-' . $i++;
        }

        return $duongDan;
    }
}