<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CapNhatHoSoRequest extends FormRequest
{
   
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ho_ten' => [
                'required',
                'string',
                'min:2',
                'max:100',
            ],
            'so_dien_thoai' => [
                'nullable',
                'string',
                'regex:/^(0[3|5|7|8|9])[0-9]{8}$/',
            ],
            'dia_chi' => [
                'nullable',
                'string',
                'max:255',
            ],
            'anh_dai_dien' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,webp',
                'max:2048', 
            ],
        ];
    }

    /**
     * Thông báo lỗi tiếng Việt tương ứng.
     */
    public function messages(): array
    {
        return [
            'ho_ten.required'     => 'Vui lòng nhập họ và tên.',
            'ho_ten.min'          => 'Họ và tên phải có ít nhất 2 ký tự.',
            'ho_ten.max'          => 'Họ và tên không được vượt quá 100 ký tự.',
            'so_dien_thoai.regex' => 'Số điện thoại không đúng định dạng (10 chữ số, ví dụ: 0987654321).',
            'dia_chi.max'         => 'Địa chỉ không được vượt quá 255 ký tự.',
            'anh_dai_dien.image'  => 'Tập tin tải lên phải là hình ảnh.',
            'anh_dai_dien.mimes'  => 'Ảnh đại diện phải có định dạng: jpeg, png, jpg, webp.',
            'anh_dai_dien.max'    => 'Dung lượng ảnh đại diện không được vượt quá 2MB.',
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