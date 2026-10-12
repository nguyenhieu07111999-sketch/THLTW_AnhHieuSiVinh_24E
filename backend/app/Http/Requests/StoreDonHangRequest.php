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
            'nguoi_dung_id' => 'nullable|exists:nguoi_dung,id',
            'ten_nguoi_nhan' => 'required|string|max:255',
            'so_dien_thoai_nhan' => 'required|string|max:20',
            'dia_chi_nhan' => 'required|string',
            'ghi_chu' => 'nullable|string',
            'phuong_thuc_thanh_toan' => 'nullable|string|max:50',
            
            // Danh sách sản phẩm mua
            'san_pham' => 'required|array|min:1',
            'san_pham.*.san_pham_id' => 'required|exists:san_pham,id',
            'san_pham.*.so_luong' => 'required|integer|min:1',
        ];
    }

    
    public function messages(): array
    {
        return [
            'ten_nguoi_nhan.required' => 'Vui lòng nhập tên người nhận.',
            'so_dien_thoai_nhan.required' => 'Vui lòng nhập số điện thoại nhận hàng.',
            'dia_chi_nhan.required' => 'Vui lòng nhập địa chỉ nhận hàng.',
            'san_pham.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'san_pham.*.san_pham_id.exists' => 'Sản phẩm không tồn tại trong hệ thống.',
            'san_pham.*.so_luong.min' => 'Số lượng sản phẩm mua phải lớn hơn hoặc bằng 1.',
        ];
    }
}