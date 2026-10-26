<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SanPham;
use App\Models\DanhGiaSanPham;
use App\Http\Requests\LuuRulesDanhGiaRequest;
use App\Http\Resources\SanPhamReviewResource;
use App\Http\Resources\DanhGiaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminDanhGiaController extends Controller
{
    public function danhSachSanPhamReview(Request $request)
    {
        $danhSach = SanPham::coDanhGiaVaThongKe($request->input('tu_khoa'))
            ->paginate($request->get('per_page', 10));

        return SanPhamReviewResource::collection($danhSach);
    }

    public function chiTietReviewSanPham(Request $request, $sanPhamId)
    {
        $sanPham = SanPham::findOrFail($sanPhamId);

        $reviews = DanhGiaSanPham::with('nguoiDung')
            ->cuaSanPham($sanPhamId)
            ->when($request->filled('trang_thai') && $request->trang_thai !== 'tat_ca', 
                fn($q) => $q->where('trang_thai', $request->trang_thai)
            )
            ->theoSoSao($request->input('so_sao'))
            ->orderByDesc('id')
            ->paginate($request->get('per_page', 10));

        return response()->json([
            'san_pham' => new SanPhamReviewResource($sanPham),
            'reviews'  => DanhGiaResource::collection($reviews)->response()->getData(true),
        ]);
    }

    public function doiTrangThai($id)
    {
        $review = DanhGiaSanPham::findOrFail($id);
        $review->update([
            'trang_thai' => ($review->trang_thai === 'hien_thi') ? 'an' : 'hien_thi'
        ]);

        return response()->json(['message' => 'Cập nhật thành công!']);
    }

    public function destroy($id)
    {
        DanhGiaSanPham::findOrFail($id)->delete();
        return response()->json(['message' => 'Đã xóa review thành công!']);
    }

    public function layRules()
    {
        return response()->json([
            'data' => Cache::get('review_moderation_rules', [
                'tu_cam'              => 'lua dao, hang gia, kem chat luong',
                'tu_dong_an_duoi_sao' => 0,
                'cho_phep_video'      => true,
                'max_files'           => 5,
            ])
        ]);
    }

    public function luuRules(LuuRulesDanhGiaRequest $request)
    {
        $data = $request->validated();
        Cache::forever('review_moderation_rules', $data);

        return response()->json([
            'message' => 'Đã lưu cấu hình kiểm duyệt!',
            'data'    => $data,
        ]);
    }
}