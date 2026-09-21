<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'parent_id'   => $this->danh_muc_cha_id,
            'name'        => $this->ten_danh_muc,
            'slug'        => $this->duong_dan_dm,
            'image'       => $this->hinh_anh,
            'description' => $this->mo_ta,
            'is_featured' => $this->sp_noi_bat,
            'status'      => $this->trang_thai,
            'sort_order'  => $this->thu_tu,
            // chỉ xuất ra khi controller đã with('children')
            'children'    => CategoryResource::collection($this->whenLoaded('children')),
        ];
    }
}