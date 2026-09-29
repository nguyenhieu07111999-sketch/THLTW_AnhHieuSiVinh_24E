<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GioHangResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tongTien = $this->chiTiets ? $this->chiTiets->sum(function ($item) {
            $giaBan = $item->sanPham->gia_khuyen_mai ?? $item->sanPham->gia ?? 0;
            return $item->so_luong * $giaBan;
        }) : 0;

        return [
            'id'            => $this->id,
            'nguoi_dung_id' => $this->nguoi_dung_id,
            'chi_tiet'      => $this->chiTiets ? $this->chiTiets->map(function ($item) {
                $giaBan = $item->sanPham->gia_khuyen_mai ?? $item->sanPham->gia ?? 0;
                return [
                    'id'           => $item->id,
                    'san_pham_id'  => $item->san_pham_id,
                    'ten_san_pham' => $item->sanPham->ten_san_pham ?? null,
                    'hinh_anh'     => $item->sanPham->hinh_anh ?? null,
                    'gia'          => (float) $giaBan,
                    'so_luong'     => (int) $item->so_luong,
                    'thanh_tien'   => (float) ($item->so_luong * $giaBan),
                ];
            }) : [],
            'tong_tien'     => (float) $tongTien,
            'ngay_tao'      => $this->ngay_tao ? $this->ngay_tao->format('Y-m-d H:i:s') : null,
            'ngay_cap_nhat' => $this->ngay_cap_nhat ? $this->ngay_cap_nhat->format('Y-m-d H:i:s') : null,
        ];
    }
}