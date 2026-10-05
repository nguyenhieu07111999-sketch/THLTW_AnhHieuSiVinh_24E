<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSanPhamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {

        $sanPhamId = $this->route('id');

        return [
            'danh_muc_id'      => 'sometimes|required|integer',
            'thuong_hieu_id'    => 'nullable|integer',
            'ten_san_pham'     => 'sometimes|required|string|max:255',
            'duong_dan_sp'     => ['nullable', 'string', Rule::unique('san_pham', 'duong_dan_sp')->ignore($sanPhamId)],
            'hinh_anh'         => 'sometimes|nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'gia_ban'          => 'sometimes|required|numeric|min:0',
            'gia_giam'         => 'nullable|numeric|min:0',
            'so_luong_ton_kho' => 'sometimes|required|integer|min:0',
            'don_vi_tinh'      => 'nullable|string|max:50',
            'mo_ta_ngan'       => 'nullable|string',
            'chi_tiet'         => 'nullable|string',
            'trang_thai'       => ['nullable', Rule::in(['hien_thi', 'an'])],
        ];
    }

    public function messages(): array
    {
        return [
            'duong_dan_sp.unique' => 'Đường dẫn sản phẩm (slug) đã tồn tại.',
            'gia_ban.min'          => 'Giá bán phải lớn hơn hoặc bằng 0.',
        ];
    }
}