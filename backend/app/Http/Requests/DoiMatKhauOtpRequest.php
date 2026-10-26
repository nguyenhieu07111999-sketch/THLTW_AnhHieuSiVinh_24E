<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DoiMatKhauOtpRequest extends FormRequest
{
    /**
     * Xác định người dùng có quyền thực hiện request này hay không.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Các quy tắc xác thực (Validation Rules).
     */
    public function rules(): array
    {
        return [
            'mat_khau_cu'  => 'required|string',
            'mat_khau_moi' => 'required|string|min:6|confirmed',
            'ma_otp'       => 'required|string|size:6',
        ];
    }

    /**
     * Tùy chỉnh thông báo lỗi trả về cho Frontend.
     */
    public function messages(): array
    {
        return [
            'mat_khau_cu.required'   => 'Vui lòng nhập mật khẩu hiện tại.',
            'mat_khau_moi.required'  => 'Vui lòng nhập mật khẩu mới.',
            'mat_khau_moi.min'       => 'Mật khẩu mới phải có tối thiểu 6 ký tự.',
            'mat_khau_moi.confirmed' => 'Mật khẩu xác nhận không trùng khớp.',
            'ma_otp.required'        => 'Vui lòng nhập mã OTP.',
            'ma_otp.size'            => 'Mã OTP phải có đúng 6 chữ số.',
        ];
    }
}