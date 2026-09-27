<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateThuongHieuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $thuongHieuId = $this->route('id');

        return [
            'ten_thuong_hieu' => 'sometimes|required|string|max:255',
            'duong_dan_th'    => ['nullable', 'string', 'max:255', Rule::unique('thuong_hieu', 'duong_dan_th')->ignore($thuongHieuId)],
            'logo'            => 'nullable|string|max:255',
            'mo_ta'           => 'nullable|string',
            'trang_thai'      => ['nullable', Rule::in(['hien_thi', 'an'])],
        ];
    }

    public function messages(): array
    {
        return [
            'ten_thuong_hieu.required' => 'Tên thương hiệu không được để trống.',
            'duong_dan_th.unique'       => 'Đường dẫn thương hiệu (slug) đã tồn tại.',
        ];
    }
}