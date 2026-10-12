<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreThuongHieuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ten_thuong_hieu' => [
                'required',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'ten_thuong_hieu'),
            ],
            'duong_dan_th'    => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'duong_dan_th'),
            ],
            'logo'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'mo_ta'           => 'nullable|string',
            'trang_thai'      => ['nullable', Rule::in(['hien_thi', 'an'])],
        ];
    }

    public function messages(): array
    {
        return [
            'ten_thuong_hieu.required' => 'Tên thương hiệu không được để trống.',
            'ten_thuong_hieu.unique'   => 'Tên thương hiệu này đã tồn tại trong hệ thống.',
            'duong_dan_th.unique'      => 'Đường dẫn thương hiệu (slug) đã tồn tại.',
            'logo.image'               => 'Tệp tải lên phải là hình ảnh.',
            'logo.mimes'               => 'Logo phải có định dạng JPEG, PNG, JPG hoặc WEBP.',
            'logo.max'                 => 'Kích thước logo không được vượt quá 2 MB.',
            'trang_thai.in'            => 'Trạng thái không hợp lệ.',
        ];
    }
}