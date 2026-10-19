<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class BaiViet extends Model
{
    // use SoftDeletes;

    protected $table = 'bai_viet';

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';

    protected $fillable = [
        'tieu_de',
        'duong_dan',
        'anh_bia',
        'mo_ta_ngan',
        'noi_dung',
        'tac_gia',
        'trang_thai',
        'ngay_dang',
    ];

    protected $casts = [
        'ngay_dang' => 'datetime',
    ];

    /**
     * Scope tìm kiếm bài viết theo tiêu đề
     */
    public function scopeTimKiem($query, $tuKhoa = null)
    {
        if (!empty($tuKhoa)) {
            return $query->where('tieu_de', 'like', '%' . trim($tuKhoa) . '%');
        }
        return $query;
    }

    /**
     * Scope lọc theo trạng thái (nhap / dang)
     */
    public function scopeTheoTrangThai($query, $trangThai = null)
    {
        if (!empty($trangThai) && $trangThai !== 'tat-ca') {
            return $query->where('trang_thai', $trangThai);
        }
        return $query;
    }

    /**
     * Scope chỉ lấy các bài đã đăng công khai (cho trang khách)
     */
    public function scopeDaDang($query)
    {
        return $query->where('trang_thai', 'dang');
    }

    /**
     * Helper tạo slug duy nhất cho bài viết
     */
    public static function taoDuongDanDuyNhat(string $tieuDe, ?int $boQuaId = null): string
    {
        $goc = Str::slug($tieuDe) ?: 'bai-viet';
        $duongDan = $goc;
        $i = 2;

        while (
            static::where('duong_dan', $duongDan)
                ->when($boQuaId, fn($q) => $q->where('id', '!=', $boQuaId))
                ->exists()
        ) {
            $duongDan = $goc . '-' . $i++;
        }

        return $duongDan;
    }
}