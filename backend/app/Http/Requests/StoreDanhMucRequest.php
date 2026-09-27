<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDanhMucRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ten_danh_muc' => 'required|string|max:255',
            'duong_dan_dm' => 'nullable|string|max:255|unique:danh_muc,duong_dan_dm',
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