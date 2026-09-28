<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginNguoiDungRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email'    => 'required|string|email',
            'mat_khau' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'    => 'Vui lòng nhập email.',
            'email.email'       => 'Email không đúng định dạng.',
            'mat_khau.required' => 'Vui lòng nhập mật khẩu.',
        ];
    }
}