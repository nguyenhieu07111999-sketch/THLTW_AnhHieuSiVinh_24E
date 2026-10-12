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
       
        $sanPhamId = $this->route('id');

        return [
            'danh_muc_id'      => 'required|integer|exists:danh_muc,id',
            'thuong_hieu_id'   => 'nullable|integer|exists:thuong_hieu,id',
            
            'ten_san_pham' => [
                'required',
                'string',
                'min:2',
                'max:255',
                Rule::unique('san_pham', 'ten_san_pham')->ignore($sanPhamId),
            ],
            
            'duong_dan_sp'     => [
                'nullable',
                'string',
                Rule::unique('san_pham', 'duong_dan_sp')->ignore($sanPhamId),
            ],
            
            'hinh_anh'         => 'sometimes|required|image|mimes:jpg,jpeg,png,webp|max:5120',
            
            'gia_ban'          => 'required|numeric|min:0|max:9999999999',
            'gia_giam'         => 'nullable|numeric|min:0|lte:gia_ban',
            'so_luong_ton_kho' => 'required|integer|min:0|max:999999',
            
            'don_vi_tinh'      => 'nullable|string|max:50',
            'mo_ta_ngan'       => 'nullable|string|max:1500', 
            'chi_tiet'         => 'nullable|string|max:65000', 
            
            'trang_thai'       => ['nullable', Rule::in(['hien_thi', 'an'])],
        ];
    }

    public function messages(): array
    {
        return [
            'danh_muc_id.required'    => 'Vui lòng chọn danh mục.',
            'danh_muc_id.exists'      => 'Danh mục đã chọn không tồn tại trong hệ thống.',
            
            'thuong_hieu_id.exists'   => 'Thương hiệu đã chọn không tồn tại.',
            
            'ten_san_pham.required'   => 'Tên sản phẩm không được để trống.',
            'ten_san_pham.min'        => 'Tên sản phẩm quá ngắn.',
            
            'duong_dan_sp.unique'     => 'Đường dẫn sản phẩm (slug) này đã được sử dụng.',
            
            'hinh_anh.required'       => 'Vui lòng chọn hình ảnh đại diện cho sản phẩm.',
            'hinh_anh.image'          => 'Tệp tải lên phải là định dạng hình ảnh.',
            'hinh_anh.mimes'          => 'Hình ảnh phải có định dạng JPG, JPEG, PNG hoặc WEBP.',
            'hinh_anh.max'            => 'Kích thước hình ảnh tối đa cho phép là 5 MB.',
            
            'gia_ban.required'        => 'Giá bán không được để trống.',
            'gia_ban.min'             => 'Giá bán không được là số âm.',
            'gia_ban.max'             => 'Giá bán vượt quá giới hạn cho phép.',
            
            'gia_giam.min'            => 'Giá giảm không được là số âm.',
            'gia_giam.lte'            => 'Giá giảm không hợp lý (phải nhỏ hơn hoặc bằng giá bán).',
            
            'so_luong_ton_kho.required' => 'Số lượng tồn kho không được để trống.',
            'so_luong_ton_kho.min'      => 'Số lượng tồn kho không hợp lệ.',
            'so_luong_ton_kho.max'      => 'Số lượng tồn kho vượt quá giới hạn hệ thống.',
            
            'mo_ta_ngan.max'          => 'Mô tả ngắn không được vượt quá 1500 ký tự.',
            'chi_tiet.max'            => 'Nội dung chi tiết quá dài, vui lòng rút gọn.',
            
            'trang_thai.in'           => 'Trạng thái không hợp lệ.',
        ];
    }
}