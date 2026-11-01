<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $table = 'menus';

    protected $fillable = [
        'parent_id',
        'vi_tri',
        'ten',
        'thu_tu',
        'trang_thai',
        'target',
        'icon',
        'loai_lien_ket',
        'lien_ket_id',
        'duong_dan_tuy_chinh',
    ];

    protected $casts = [
        'trang_thai' => 'boolean',
        'thu_tu'     => 'integer',
        'parent_id'  => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Menu::class, 'parent_id')
                    ->orderBy('thu_tu', 'asc')
                    ->with('children');
    }

    public function danhMuc()
    {
        return $this->belongsTo(DanhMuc::class, 'lien_ket_id');
    }

    public function baiViet()
    {
        return $this->belongsTo(BaiViet::class, 'lien_ket_id');
    }

    public function chuDeBaiViet()
    {
        return $this->belongsTo(ChuDeBaiViet::class, 'lien_ket_id');
    }

    // Accessor: Tự động phân giải URL chuẩn trả về cho Frontend
    public function getUrlChuanAttribute(): string
    {
        return match ($this->loai_lien_ket) {
            'danh_muc'        => $this->danhMuc ? '/danh-muc/' . $this->danhMuc->duong_dan_dm : '#',
            'bai_viet'        => $this->baiViet ? '/bai-viet/' . $this->baiViet->duong_dan_bv : '#',
            'chu_de_bai_viet' => $this->chuDeBaiViet ? '/chu-de/' . $this->chuDeBaiViet->duong_dan_bv : '#',
            default           => $this->duong_dan_tuy_chinh ?? '#',
        };
    }
}