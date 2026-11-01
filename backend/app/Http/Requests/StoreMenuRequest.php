<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vi_tri'              => 'required|string|in:header,footer_chinh_sach,footer_lien_ket',
            'ten'                 => 'required|string|max:100',
            'parent_id'           => 'nullable|exists:menus,id',
            'thu_tu'              => 'nullable|integer|min:0',
            'trang_thai'          => 'boolean',
            'target'              => 'nullable|in:_self,_blank',
            'icon'                => 'nullable|string|max:50',
            'loai_lien_ket'       => 'required|in:tuy_chinh,danh_muc,bai_viet,chu_de_bai_viet',
            'lien_ket_id'         => 'nullable|integer',
            'duong_dan_tuy_chinh' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'vi_tri.required'        => 'Vui lòng chọn vị trí đặt menu.',
            'vi_tri.in'              => 'Vị trí menu không hợp lệ.',
            'ten.required'           => 'Tên hiển thị menu không được để trống.',
            'loai_lien_ket.required' => 'Vui lòng chọn loại liên kết.',
            'parent_id.exists'       => 'Menu cha không tồn tại.',
        ];
    }
}