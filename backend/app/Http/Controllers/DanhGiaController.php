<?php
namespace App\Http\Controllers;

use App\Models\DanhGiaSanPham;
use App\Http\Requests\DanhGiaRequest;
use App\Http\Resources\DanhGiaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

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

    public function store(Request $request, $id)
    {
        // 1. Validate dữ liệu đầu vào
        $request->validate([
            'so_sao'   => 'required|integer|between:1,5',
            'noi_dung' => 'required|string|max:1000',
            'tep_tin'  => 'nullable|array',
        ]);

        // 2. Lấy cấu hình rules do Admin đã lưu
        $rulesConfig = Cache::get('review_moderation_rules', [
            'tu_cam'              => 'lua dao, hang gia, kem chat luong, rac, me kiep, cut, cho chet',
            'xu_ly_tu_cam'        => 'an_danh_gia',
            'tu_dong_an_duoi_sao' => 0,
        ]);

        $noiDung = $request->input('noi_dung');
        $trangThai = 'hien_thi';

        // 3. Xử lý kiểm tra từ nhạy cảm
        if (!empty($rulesConfig['tu_cam'])) {
            // Tách chuỗi từ cấm thành mảng (loại bỏ khoảng trắng thừa)
            $dsTuCam = array_filter(array_map('trim', explode(',', mb_strtolower($rulesConfig['tu_cam'], 'UTF-8'))));
            
            $noiDungThuong = mb_strtolower($noiDung, 'UTF-8');
            $chuaTuCam = false;

            foreach ($dsTuCam as $tu) {
                if ($tu !== '' && str_contains($noiDungThuong, $tu)) {
                    $chuaTuCam = true;
                    
                    // Nếu cấu hình thay thế bằng dấu sao ***
                    if (($rulesConfig['xu_ly_tu_cam'] ?? '') === 'thay_the_sao') {
                        $pattern = '/' . preg_quote($tu, '/') . '/iu';
                        $noiDung = preg_replace($pattern, '***', $noiDung);
                    }
                }
            }

            // Nếu chứa từ nhạy cảm, tự động gắn trạng thái 'an' (chờ Admin duyệt)
            if ($chuaTuCam && ($rulesConfig['xu_ly_tu_cam'] ?? 'an_danh_gia') === 'an_danh_gia') {
                $trangThai = 'an';
            }
        }

        // 4. Kiểm tra quy tắc tự động ẩn theo số sao
        $mucSaoToiThieu = (int)($rulesConfig['tu_dong_an_duoi_sao'] ?? 0);
        if ($mucSaoToiThieu > 0 && (int)$request->so_sao <= $mucSaoToiThieu) {
            $trangThai = 'an';
        }

        // 5. Lưu vào Database
        $danhGia = DanhGiaSanPham::create([
            'san_pham_id'   => $id,
            'nguoi_dung_id' => auth()->id(),
            'so_sao'        => $request->so_sao,
            'noi_dung'      => $noiDung,
            'tep_dinh_kem'  => $request->tep_dinh_kem ?? [],
            'trang_thai'    => $trangThai,
        ]);

        return response()->json([
            'message' => $trangThai === 'an' 
                ? 'Đánh giá của bạn đã được gửi và đang chờ quản trị viên kiểm duyệt!' 
                : 'Đánh giá thành công!',
            'data'    => $danhGia,
        ], 201);
    }

    public function destroy($id)
    {
        $danhGia = DanhGiaSanPham::findOrFail($id);
        $danhGia->delete();

        return response()->json(['message' => 'Đã xoá đánh giá'], 200);
    }
}
