<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LuuRulesDanhGiaRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tu_cam'              => 'nullable|string',
            'tu_dong_an_duoi_sao' => 'required|integer|between:0,5',
            'cho_phep_video'      => 'required|boolean',
            'max_files'           => 'required|integer|min:1|max:10',
        ];
    }
}
