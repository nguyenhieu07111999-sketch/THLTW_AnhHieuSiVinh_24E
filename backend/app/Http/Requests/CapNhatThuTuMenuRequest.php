<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CapNhatThuTuMenuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'menus'             => 'required|array|min:1',
            'menus.*.id'        => 'required|exists:menus,id',
            'menus.*.thu_tu'    => 'required|integer|min:0',
            'menus.*.parent_id' => 'nullable|exists:menus,id',
        ];
    }
}