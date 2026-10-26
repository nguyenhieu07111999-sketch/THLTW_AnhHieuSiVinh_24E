<?php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DanhGiaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Xử lý gắn URL đầy đủ cho mảng ảnh / video
        $danhSachMediaUrl = [];
        if (!empty($this->tep_dinh_kem) && is_array($this->tep_dinh_kem)) {
            $danhSachMediaUrl = array_map(function ($path) {
                return url(Storage::url($path));
            }, $this->tep_dinh_kem);
        }

        return [
            'id'             => $this->id,
            'san_pham_id'    => $this->san_pham_id,
            'so_sao'         => $this->so_sao,
            'noi_dung'       => $this->noi_dung,
            'tep_dinh_kem'   => $danhSachMediaUrl,
            'ngay_tao'       => $this->ngay_tao ? $this->ngay_tao->format('d/m/Y H:i') : null,
            'nguoi_dung'     => [
                'id'           => $this->nguoiDung?->id,
                'ho_ten'       => $this->nguoiDung?->ho_ten ?? 'Khách hàng',
                'anh_dai_dien' => $this->nguoiDung?->anh_dai_dien 
                                    ? url(Storage::url($this->nguoiDung->anh_dai_dien)) 
                                    : null,
            ],
        ];
    }
}