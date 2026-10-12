<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDonHangRequest extends FormRequest
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
            'ten_nguoi_nhan' => 'sometimes|required|string|max:255',
            'so_dien_thoai_nhan' => 'sometimes|required|string|max:20',
            'dia_chi_nhan' => 'sometimes|required|string',
            'ghi_chu' => 'nullable|string',
            
            'trang_thai_don_hang' => 'sometimes|required|in:cho_xac_nhan,da_xac_nhan,dang_giao,hoan_thanh',
            'trang_thai_thanh_toan' => 'sometimes|required|in:chua_thanh_toan,da_thanh_toan,hoan_tien',
            'phuong_thuc_thanh_toan' => 'nullable|string|max:50',
        ];
    }

    
    public function messages(): array
    {
        return [
            'trang_thai_don_hang.in' => 'Trạng thái đơn hàng không hợp lệ.',
            'trang_thai_thanh_toan.in' => 'Trạng thái thanh toán không hợp lệ.',
            'ten_nguoi_nhan.required' => 'Tên người nhận không được để trống.',
            'so_dien_thoai_nhan.required' => 'Số điện thoại nhận hàng không được để trống.',
            'dia_chi_nhan.required' => 'Địa chỉ nhận hàng không được để trống.',
        ];
    }
}