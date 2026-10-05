<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDanhMucRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'integer',
                // Cha phải tồn tại và phải là danh mục cấp 1 (không có cha)
                Rule::exists('danh_muc', 'id')->whereNull('parent_id'),
            ],
            'ten_danh_muc' => 'required|string|max:255',
            'duong_dan_dm' => 'nullable|string|max:255',
            'hinh_anh' => 'nullable|string',
            'mo_ta' => 'nullable|string',
            'sp_noi_bat' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'ten_danh_muc.required' => 'Tên danh mục là bắt buộc',
            'duong_dan_dm.unique' => 'Đường dẫn này đã tồn tại',
            'parent_id.exists' => 'Danh mục cha không tồn tại hoặc không phải danh mục cấp 1',
        ];
    }
}