<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                  => $this->id,
            'parent_id'           => $this->parent_id,
            'vi_tri'              => $this->vi_tri,
            'ten'                 => $this->ten,
            'thu_tu'              => $this->thu_tu,
            'trang_thai'          => $this->trang_thai,
            'target'              => $this->target,
            'icon'                => $this->icon,
            'loai_lien_ket'       => $this->loai_lien_ket,
            'lien_ket_id'         => $this->lien_ket_id,
            'duong_dan_tuy_chinh' => $this->duong_dan_tuy_chinh,
            'url'                 => $this->url_chuan,
            'children'            => MenuResource::collection($this->whenLoaded('children')),
            'created_at'          => $this->created_at?->format('H:i d/m/Y'),
        ];
    }
}