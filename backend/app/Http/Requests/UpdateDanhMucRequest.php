<?php

namespace App\Http\Requests;

use App\Models\DanhMuc;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDanhMucRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('danh_muc');

        return [
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('danh_muc', 'id')->whereNull('parent_id'),
            ],
            'ten_danh_muc' => 'required|string|max:255',
            'duong_dan_dm' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'duong_dan_dm')->ignore($id),
            ],
            'hinh_anh' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'sp_noi_bat' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'ten_danh_muc.required' => 'Tên danh mục là bắt buộc',
            'duong_dan_dm.unique' => 'Đường dẫn này đã tồn tại',
            'parent_id.exists' => 'Danh mục cha không tồn tại hoặc không phải danh mục cấp 1',
        ];
    }

    // Các kiểm tra thêm để giữ đúng 2 cấp
    public function withValidator($validator): void
    {
        $validator->after(function ($v) {
            $id = (int) $this->route('danh_muc');
            $parentId = $this->input('parent_id');

            if (!$parentId) {
                return;
            }

            if ((int) $parentId === $id) {
                $v->errors()->add('parent_id', 'Danh mục không thể là cha của chính nó');
            }

            if (DanhMuc::where('parent_id', $id)->exists()) {
                $v->errors()->add('parent_id', 'Danh mục đang có danh mục con nên không thể chuyển thành danh mục con');
            }
        });
    }
}