<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class DonHangResource extends JsonResource
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
            'nguoi_dung_id' => $this->nguoi_dung_id,
            'ten_nguoi_nhan' => $this->ten_nguoi_nhan,
            'so_dien_thoai_nhan' => $this->so_dien_thoai_nhan,
            'dia_chi_nhan' => $this->dia_chi_nhan,
            'ghi_chu' => $this->ghi_chu,
            
            // Tài chính 
            'tong_tien' => (float) $this->tong_tien,
            'phi_vanchuyen' => (float) $this->phi_vanchuyen,
            'thanh_tien' => (float) $this->thanh_tien,

            // Trạng thái
            'trang_thai_don_hang' => $this->trang_thai_don_hang,
            'trang_thai_thanh_toan' => $this->trang_thai_thanh_toan,
            'phuong_thuc_thanh_toan' => $this->phuong_thuc_thanh_toan,

            // Danh sách sản phẩm chi tiết trong đơn hàng 
            'chi_tiet' => $this->whenLoaded('chiTiet', function () {
                return $this->chiTiet->map(function ($item) {
                    $hinhAnh = $item->hinh_anh;
                    if ($hinhAnh && !Str::startsWith($hinhAnh, 'http')) {
                        if (!Str::startsWith($hinhAnh, 'products/')) {
                            $hinhAnh = 'products/' . $hinhAnh;
                        }
                        $hinhAnh = asset('storage/' . $hinhAnh);
                    }

                    return [
                        'id' => $item->id,
                        'san_pham_id' => $item->san_pham_id,
                        'ten_san_pham' => $item->ten_san_pham,
                        'hinh_anh' => $hinhAnh,
                        'gia_ban' => (float) $item->gia_ban,
                        'gia_giam' => $item->gia_giam ? (float) $item->gia_giam : null,
                        'so_luong' => (int) $item->so_luong,
                        'thanh_tien' => (float) $item->thanh_tien,
                    ];
                });
            }),

            // Thời gian
            'ngay_tao'      => $this->created_at?->toIso8601String(),
            'ngay_cap_nhat' => $this->updated_at?->toIso8601String(),
        ];
    }
}