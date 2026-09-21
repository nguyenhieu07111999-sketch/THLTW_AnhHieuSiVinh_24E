<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SanPhamResource extends JsonResource
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
            'danh_muc_id' => $this->danh_muc_id,
            'thuong_hieu_id' => $this->thuong_hieu_id,
            'ten_san_pham' => $this->ten_san_pham,
            'duong_dan_sp' => $this->duong_dan_sp,
            'hinh_anh' => $this->hinh_anh,
            'gia_ban' => (float) $this->gia_ban,
            'gia_giam' => (float) $this->gia_giam,
            'so_luong_ton_kho' => (int) $this->so_luong_ton_kho,
            'don_vi_tinh' => $this->don_vi_tinh,
            'mo_ta_ngan' => $this->mo_ta_ngan,
            'chi_tiet' => $this->chi_tiet,
            'trang_thai' => $this->trang_thai,
            'ngay_tao' => $this->ngay_tao ? $this->ngay_tao->format('Y-m-d H:i:s') : null,
            'ngay_cap_nhat' => $this->ngay_cap_nhat ? $this->ngay_cap_nhat->format('Y-m-d H:i:s') : null,
        ];
    }
}