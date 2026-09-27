<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDanhMucRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('danh_muc');

        return [
            'ten_danh_muc' => 'required|string|max:255',
            'duong_dan_dm' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'duong_dan_dm')->ignore($id),
            ],
            'hinh_anh' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'sp_noi_bat' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'ten_danh_muc.required' => 'Tên danh mục là bắt buộc',
            'duong_dan_dm.unique' => 'Đường dẫn này đã tồn tại',
        ];
    }
}