<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SanPhamReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'ten_san_pham'    => $this->ten_san_pham,
            'hinh_anh'        => $this->hinh_anh ? url(Storage::url($this->hinh_anh)) : null,
            'tong_review'     => $this->danh_gias_count ?? 0,
            'diem_trung_binh' => round($this->diem_trung_binh ?? 5.0, 1),
        ];
    }
}
