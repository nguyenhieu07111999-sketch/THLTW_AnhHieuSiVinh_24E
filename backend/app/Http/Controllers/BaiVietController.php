<?php

namespace App\Http\Controllers;

use App\Models\BaiViet;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class BaiVietController extends Controller
{
    private function quyTac(): array
    {
        return [
            'tieu_de' => 'required|string|max:255',
            'anh_bia' => 'nullable|string|max:500',
            'mo_ta_ngan' => 'nullable|string|max:500',
            'noi_dung' => 'required|string',
            'trang_thai' => ['required', Rule::in(['nhap', 'dang'])],
        ];
    }

    private function taoDuongDan(string $tieuDe, ?int $boQuaId = null): string
    {
        $goc = Str::slug($tieuDe) ?: 'bai-viet';
        $duongDan = $goc;
        $i = 2;

        while (
            BaiViet::where('duong_dan', $duongDan) // Đã sửa bỏ withTrashed() để không lỗi cột deleted_at
                ->when($boQuaId, fn($q) => $q->where('id', '!=', $boQuaId))
                ->exists()
        ) {
            $duongDan = $goc . '-' . $i++;
        }

        return $duongDan;
    }

    public function index(Request $request)
    {
        return response()->json(
            BaiViet::orderByDesc('id')->paginate($request->get('per_page', 10))
        );
    }

    // Bổ sung hàm chuDe() để khắc phục lỗi 404 hoặc lỗi không hỗ trợ phương thức GET
    public function chuDe()
    {
        return response()->json([
            'data' => [
                ['id' => 1, 'ten_chu_de' => 'Tin tức chung'],
                ['id' => 2, 'ten_chu_de' => 'Khuyến mãi'],
                ['id' => 3, 'ten_chu_de' => 'Hướng dẫn sử dụng'],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->quyTac());

        $data['duong_dan'] = $this->taoDuongDan($data['tieu_de']);
        $data['tac_gia'] = $request->user()->ho_ten ?? null;
        $data['ngay_dang'] = $data['trang_thai'] === 'dang' ? now() : null;

        return response()->json(['data' => BaiViet::create($data)], 201);
    }

    public function update(Request $request, $id)
    {
        $baiViet = BaiViet::findOrFail($id);
        $data = $request->validate($this->quyTac());

        if ($data['tieu_de'] !== $baiViet->tieu_de) {
            $data['duong_dan'] = $this->taoDuongDan($data['tieu_de'], $baiViet->id);
        }

        if ($data['trang_thai'] === 'dang' && !$baiViet->ngay_dang) {
            $data['ngay_dang'] = now();
        }

        $baiViet->update($data);

        return response()->json(['data' => $baiViet]);
    }

    public function doiTrangThai($id)
    {
        $baiViet = BaiViet::findOrFail($id);

        if ($baiViet->trang_thai === 'dang') {
            $baiViet->update(['trang_thai' => 'nhap']);
        } else {
            $baiViet->update([
                'trang_thai' => 'dang',
                'ngay_dang' => $baiViet->ngay_dang ?? now(),
            ]);
        }

        return response()->json(['data' => $baiViet]);
    }

    public function destroy($id)
    {
        BaiViet::findOrFail($id)->delete();

        return response()->json(['message' => 'Đã xoá bài viết']);
    }
}