<?php

namespace App\Http\Controllers;

use App\Models\BaiViet;
use App\Http\Requests\BaiVietRequest;
use Illuminate\Http\Request;

class BaiVietController extends Controller
{
    public function index(Request $request)
    {
        $baiViets = BaiViet::query()
            ->timKiem($request->input('search'))
            ->theoTrangThai($request->input('trang_thai'))
            ->orderByDesc('id')
            ->paginate($request->get('per_page', 10));

        return response()->json($baiViets);
    }

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

    public function store(BaiVietRequest $request)
    {
        $data = $request->validated();

        $data['duong_dan'] = BaiViet::taoDuongDanDuyNhat($data['tieu_de']);
        $data['tac_gia']   = $request->user()?->ho_ten ?? 'Ban Biên Tập';
        $data['ngay_dang'] = $data['trang_thai'] === 'dang' ? now() : null;

        $baiViet = BaiViet::create($data);

        return response()->json(['data' => $baiViet], 201);
    }

    public function update(BaiVietRequest $request, $id)
    {
        $baiViet = BaiViet::findOrFail($id);
        $data = $request->validated();

        if ($data['tieu_de'] !== $baiViet->tieu_de) {
            $data['duong_dan'] = BaiViet::taoDuongDanDuyNhat($data['tieu_de'], $baiViet->id);
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
                'ngay_dang'  => $baiViet->ngay_dang ?? now(),
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