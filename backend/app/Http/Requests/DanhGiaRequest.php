<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class DanhGiaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'so_sao'    => 'required|integer|between:1,5',
            'noi_dung'  => 'required|string|max:1000',
            'tep_tin.*' => 'nullable|file|mimes:jpeg,jpg,png,webp,mp4,mov|max:20480', 
        ];
    }

    public function messages(): array
    {
        return [
            'so_sao.required'   => 'Vui lòng chọn số sao đánh giá.',
            'so_sao.between'    => 'Số sao chỉ từ 1 đến 5.',
            'noi_dung.required' => 'Vui lòng nhập nội dung đánh giá.',
            'tep_tin.*.mimes'   => 'Tệp phải là hình ảnh (jpg, png) hoặc video (mp4, mov).',
            'tep_tin.*.max'     => 'Kích thước mỗi tệp không được vượt quá 20MB.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'Dữ liệu đánh giá không hợp lệ!',
            'errors'  => $validator->errors(),
        ], 422));
    }
}