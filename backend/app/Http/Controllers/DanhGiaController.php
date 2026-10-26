<?php
namespace App\Http\Controllers;

use App\Models\DanhGiaSanPham;
use App\Http\Requests\DanhGiaRequest;
use App\Http\Resources\DanhGiaResource;
use Illuminate\Http\Request;

class DanhGiaController extends Controller
{
    public function index(Request $request, $sanPhamId)
    {
        $query = DanhGiaSanPham::with('nguoiDung')
            ->cuaSanPham($sanPhamId)
            ->hienThi()
            ->theoSoSao($request->query('so_sao'))
            ->orderByDesc('id');

        $danhGias = $query->get();

        $tongSo = $danhGias->count();
        $diemTrungBinh = $tongSo > 0 ? round($danhGias->avg('so_sao'), 1) : 5.0;

        return response()->json([
            'tong_so'         => $tongSo,
            'diem_trung_binh' => $diemTrungBinh,
            'data'            => DanhGiaResource::collection($danhGias),
        ], 200);
    }

    public function store(DanhGiaRequest $request, $sanPhamId)
    {
        $data = $request->validated();
        $user = $request->user();

        $danhSachTep = [];
        if ($request->hasFile('tep_tin')) {
            foreach ($request->file('tep_tin') as $file) {
                $danhSachTep[] = $file->store('reviews', 'public');
            }
        }

        $danhGia = DanhGiaSanPham::create([
            'san_pham_id'   => $sanPhamId,
            'nguoi_dung_id' => $user->id,
            'so_sao'        => $data['so_sao'],
            'noi_dung'      => $data['noi_dung'],
            'tep_dinh_kem'  => $danhSachTep,
            'trang_thai'    => 'hien_thi',
        ]);

        return response()->json([
            'message' => 'Gửi đánh giá thành công!',
            'data'    => new DanhGiaResource($danhGia->load('nguoiDung')),
        ], 201);
    }

    public function destroy($id)
    {
        $danhGia = DanhGiaSanPham::findOrFail($id);
        $danhGia->delete();

        return response()->json(['message' => 'Đã xoá đánh giá'], 200);
    }
}
