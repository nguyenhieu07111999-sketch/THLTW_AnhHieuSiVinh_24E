<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CapNhatGioHangRequest extends FormRequest
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
            'so_luong' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'so_luong.required' => 'Vui lòng nhập số lượng mới.',
            'so_luong.integer'  => 'Số lượng phải là số nguyên.',
            'so_luong.min'      => 'Số lượng tối thiểu phải là 1.',
        ];
    }
}
