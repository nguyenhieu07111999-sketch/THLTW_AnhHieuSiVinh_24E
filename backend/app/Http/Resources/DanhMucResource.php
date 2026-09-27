<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DanhMucResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ten_danh_muc' => $this->ten_danh_muc,
            'duong_dan_dm' => $this->duong_dan_dm,
            'hinh_anh' => $this->hinh_anh,
            'mo_ta' => $this->mo_ta,
            'sp_noi_bat' => $this->sp_noi_bat,
            'ngay_tao' => $this->ngay_tao,
            'ngay_cap_nhat' => $this->ngay_cap_nhat,
        ];
    }
}