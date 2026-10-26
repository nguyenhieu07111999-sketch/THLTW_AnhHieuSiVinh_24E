<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDonHangRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ten_nguoi_nhan' => 'required|string|max:255',
            'so_dien_thoai_nhan' => ['required', 'string', 'regex:/^(?:\+?84|0)(?:3|5|7|8|9)[0-9]{8}$/'],
            'dia_chi_nhan' => 'required|string|max:1000',
            'ghi_chu' => 'nullable|string|max:1000',
            'phuong_thuc_thanh_toan' => 'required|string|in:COD,VNPAY',
        ];
    }

    public function messages(): array
    {
        return [
            'ten_nguoi_nhan.required' => 'Vui lòng nhập tên người nhận.',
            'so_dien_thoai_nhan.required' => 'Vui lòng nhập số điện thoại nhận hàng.',
            'so_dien_thoai_nhan.regex' => 'Số điện thoại không đúng định dạng (VD: 090xxxxxxx).',
            'dia_chi_nhan.required' => 'Vui lòng nhập địa chỉ nhận hàng.',
            'phuong_thuc_thanh_toan.in' => 'Phương thức thanh toán không hợp lệ.',
        ];
    }
}