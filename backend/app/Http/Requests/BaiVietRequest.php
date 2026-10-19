<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class BaiVietRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tieu_de'    => 'required|string|max:255',
            'anh_bia'    => 'nullable|string|max:500',
            'mo_ta_ngan' => 'nullable|string|max:500',
            'noi_dung'   => 'required|string',
            'trang_thai' => ['required', Rule::in(['nhap', 'dang'])],
        ];
    }

    public function messages(): array
    {
        return [
            'tieu_de.required'    => 'Vui lòng nhập tiêu đề bài viết.',
            'tieu_de.max'         => 'Tiêu đề bài viết không được vượt quá 255 ký tự.',
            'mo_ta_ngan.max'      => 'Mô tả ngắn không được vượt quá 500 ký tự.',
            'noi_dung.required'   => 'Vui lòng nhập nội dung bài viết.',
            'trang_thai.required' => 'Vui lòng chọn trạng thái bài viết.',
            'trang_thai.in'       => 'Trạng thái bài viết chỉ có thể là "nhap" hoặc "dang".',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Dữ liệu không hợp lệ!',
            'errors'  => $validator->errors(),
        ], 422));
    }
}