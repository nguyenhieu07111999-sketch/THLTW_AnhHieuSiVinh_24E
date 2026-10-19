<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class TaiKhoanNguoiDungResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $anh = $this->anh_dai_dien;
        if ($anh && !Str::startsWith($anh, 'http')) {
            $anh = asset('storage/' . $anh);
        }

        return [
            'id'            => $this->id,
            'ho_ten'        => $this->ho_ten,
            'email'         => $this->email,
            'so_dien_thoai' => $this->so_dien_thoai,
            'dia_chi'       => $this->dia_chi,
            'anh_dai_dien'  => $anh,
            'trang_thai'    => $this->trang_thai,
            'ngay_tao'      => $this->ngay_tao ? Carbon::parse($this->ngay_tao)->toIso8601String() : null,
        ];
    }
}