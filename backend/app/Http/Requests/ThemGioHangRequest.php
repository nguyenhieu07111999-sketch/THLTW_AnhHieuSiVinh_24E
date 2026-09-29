<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ThemGioHangRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'san_pham_id' => ['required', 'integer', 'exists:san_pham,id'],
            'so_luong'    => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'san_pham_id.required' => 'Vui lòng chọn sản phẩm.',
            'san_pham_id.exists'   => 'Sản phẩm không tồn tại trên hệ thống.',
            'so_luong.required'    => 'Vui lòng nhập số lượng.',
            'so_luong.integer'     => 'Số lượng phải là số nguyên.',
            'so_luong.min'         => 'Số lượng tối thiểu phải là 1.',
        ];
    }
}
