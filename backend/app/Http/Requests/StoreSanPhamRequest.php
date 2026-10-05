<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSanPhamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; 
    }

    public function rules(): array
    {
        return [
            'danh_muc_id'      => 'required|integer',
            'thuong_hieu_id'    => 'nullable|integer',
            'ten_san_pham'     => 'required|string|max:255',
            'duong_dan_sp'     => 'nullable|string|unique:san_pham,duong_dan_sp',
            'hinh_anh'         => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
            'gia_ban'          => 'required|numeric|min:0',
            'gia_giam'         => 'nullable|numeric|min:0|lte:gia_ban',
            'so_luong_ton_kho' => 'required|integer|min:0',
            'don_vi_tinh'      => 'nullable|string|max:50',
            'mo_ta_ngan'       => 'nullable|string',
            'chi_tiet'         => 'nullable|string',
            'trang_thai'       => ['nullable', Rule::in(['hien_thi', 'an'])],
        ];
    }

    public function messages(): array
    {
        return [
            'danh_muc_id.required'   => 'Danh mục không được để trống.',
            'ten_san_pham.required'  => 'Tên sản phẩm không được để trống.',
            'duong_dan_sp.unique'    => 'Đường dẫn sản phẩm (slug) đã tồn tại.',
            'hinh_anh.required'      => 'Vui lòng chọn hình ảnh sản phẩm từ máy tính.',
            'hinh_anh.image'         => 'Tệp tải lên phải là hình ảnh.',
            'hinh_anh.mimes'         => 'Hình ảnh phải có định dạng JPG, PNG hoặc WEBP.',
            'hinh_anh.max'           => 'Kích thước hình ảnh không được vượt quá 5 MB.',
            'gia_ban.required'       => 'Giá bán không được để trống.',
            'gia_giam.lte'           => 'Giá giảm phải nhỏ hơn hoặc bằng giá bán.',
            'so_luong_ton_kho.required' => 'Số lượng tồn kho không được để trống.',
        ];
    }
}