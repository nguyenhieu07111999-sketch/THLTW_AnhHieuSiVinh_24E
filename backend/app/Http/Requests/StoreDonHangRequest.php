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
            
            'so_dien_thoai_nhan' => ['required', 'string', 'regex:/(84|0)[3|5|7|8|9][0-9]{8}\b/'],
            
            'dia_chi_nhan' => 'required|string|max:1000',
            'ghi_chu' => 'nullable|string|max:1000',
            
            'phuong_thuc_thanh_toan' => 'nullable|string|in:COD,VNPAY,MOMO,BANK',
            
            'san_pham' => 'required|array|min:1',
            
            'san_pham.*.san_pham_id' => 'required|exists:san_pham,id|distinct',
            
            'san_pham.*.so_luong' => 'required|integer|min:1|max:100',
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
            
            'san_pham.required' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            'san_pham.min' => 'Đơn hàng phải có ít nhất một sản phẩm.',
            
            'san_pham.*.san_pham_id.exists' => 'Một hoặc nhiều sản phẩm không tồn tại.',
            'san_pham.*.san_pham_id.distinct' => 'Có sản phẩm bị trùng lặp trong giỏ hàng.',
            
            'san_pham.*.so_luong.min' => 'Số lượng sản phẩm mua phải lớn hơn hoặc bằng 1.',
            'san_pham.*.so_luong.max' => 'Số lượng vượt quá giới hạn cho phép.',
        ];
    }
}