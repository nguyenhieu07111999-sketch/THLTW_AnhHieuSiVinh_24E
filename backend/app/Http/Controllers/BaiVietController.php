<?php

namespace App\Http\Controllers;

use App\Models\BaiViet;
use App\Models\ChuDeBaiViet;
use App\Http\Requests\BaiVietRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class BaiVietController extends Controller
{
    public function index(Request $request)
    {
        $query = BaiViet::query()
            ->timKiem($request->input('search'))
            ->theoTrangThai($request->input('trang_thai'))
            ->orderByDesc('id');

        if ($request->filled('limit')) {
            return response()->json([
                'data' => $query->limit((int)$request->input('limit'))->get()
            ]);
        }

        return response()->json($query->paginate($request->get('per_page', 10)));
    }

    public function chuDe()
    {
        try {
            $chuDes = ChuDeBaiViet::all();
            return response()->json([
                'data' => $chuDes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi tải chủ đề: ' . $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'chu_de_id'    => 'nullable|integer',
            'tieu_de'      => 'required|string|max:255',
            'anh_dai_dien' => 'nullable',
            'tom_tat'      => 'nullable|string|max:500',
            'noi_dung'     => 'required|string',
            'trang_thai'   => 'required|in:nhap,xuat_ban',
        ]);

        // Upload file ảnh vào storage/app/public/posts
        if ($request->hasFile('anh_dai_dien')) {
            $data['anh_dai_dien'] = $request->file('anh_dai_dien')->store('posts', 'public');
        }

        $data['duong_dan_bv'] = BaiViet::taoDuongDanDuyNhat($data['tieu_de']);
        $data['luot_xem'] = 0;

        $baiViet = BaiViet::create($data);

        return response()->json([
            'data'    => $baiViet,
            'message' => 'Thêm bài viết thành công!'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $baiViet = BaiViet::findOrFail($id);

        $data = $request->validate([
            'chu_de_id'    => 'nullable|integer',
            'tieu_de'      => 'required|string|max:255',
            'anh_dai_dien' => 'nullable',
            'tom_tat'      => 'nullable|string|max:500',
            'noi_dung'     => 'required|string',
            'trang_thai'   => 'required|in:nhap,xuat_ban',
        ]);

        // Nếu người dùng chọn file ảnh mới
        if ($request->hasFile('anh_dai_dien')) {
            if ($baiViet->anh_dai_dien && Storage::disk('public')->exists($baiViet->anh_dai_dien)) {
                Storage::disk('public')->delete($baiViet->anh_dai_dien);
            }
            $data['anh_dai_dien'] = $request->file('anh_dai_dien')->store('posts', 'public');
        } else {
            // Không gửi ảnh mới thì không ghi đè giá trị cũ
            unset($data['anh_dai_dien']);
        }

        if ($data['tieu_de'] !== $baiViet->tieu_de) {
            $data['duong_dan_bv'] = BaiViet::taoDuongDanDuyNhat($data['tieu_de'], $baiViet->id);
        }

        $baiViet->update($data);

        return response()->json([
            'data'    => $baiViet,
            'message' => 'Cập nhật bài viết thành công!'
        ]);
    }

    public function doiTrangThai($id)
    {
        $baiViet = BaiViet::findOrFail($id);

        $trangThaiMoi = ($baiViet->trang_thai === 'xuat_ban') ? 'nhap' : 'xuat_ban';
        
        $baiViet->update([
            'trang_thai' => $trangThaiMoi,
        ]);

        return response()->json([
            'data'    => $baiViet,
            'message' => 'Cập nhật trạng thái thành công!'
        ]);
    }

    public function destroy($id)
    {
        $baiViet = BaiViet::findOrFail($id);
        if ($baiViet->anh_bia && Storage::disk('public')->exists($baiViet->anh_bia)) {
            Storage::disk('public')->delete($baiViet->anh_bia);
        }
        $baiViet->delete();

        return response()->json(['message' => 'Đã xoá bài viết']);
    }

    public function show($id)
    {
        try {
            // Tìm bài viết kèm thông tin chủ đề
            $baiViet = BaiViet::with('chuDe')->findOrFail($id);

            // Tự động tăng 1 lượt xem khi có người đọc bài
            $baiViet->increment('luot_xem');

            return response()->json([
                'data' => $baiViet
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Không tìm thấy bài viết!'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi máy chủ: ' . $e->getMessage()
            ], 500);
        }
    }
}