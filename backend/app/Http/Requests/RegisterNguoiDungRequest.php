<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterNguoiDungRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ho_ten'        => 'required|string|max:255',
            'email'         => 'required|string|email|max:255|unique:tai_khoan_nguoi_dung,email',
            'mat_khau'      => 'required|string|min:6|confirmed',
            'so_dien_thoai' => 'nullable|string|max:20',
            'dia_chi'       => 'nullable|string|max:255',
            'anh_dai_dien'  => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'ho_ten.required'    => 'Họ tên không được để trống.',
            'email.required'     => 'Email không được để trống.',
            'email.email'        => 'Email không đúng định dạng.',
            'email.unique'       => 'Email này đã được đăng ký.',
            'mat_khau.required'  => 'Mật khẩu không được để trống.',
            'mat_khau.min'       => 'Mật khẩu phải từ 6 ký tự trở lên.',
            'mat_khau.confirmed' => 'Mật khẩu nhập lại không trùng khớp.',
        ];
    }
}