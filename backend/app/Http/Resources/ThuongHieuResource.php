<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThuongHieuResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ten_thuong_hieu' => $this->ten_thuong_hieu,
            'duong_dan_th' => $this->duong_dan_th,
            'logo' => $this->logo,
            'mo_ta' => $this->mo_ta,
            'trang_thai' => (int) $this->trang_thai,
            'ngay_tao' => $this->ngay_tao ? $this->ngay_tao->format('Y-m-d H:i:s') : null,
            'ngay_cap_nhat' => $this->ngay_cap_nhat ? $this->ngay_cap_nhat->format('Y-m-d H:i:s') : null,
        ];
    }
}