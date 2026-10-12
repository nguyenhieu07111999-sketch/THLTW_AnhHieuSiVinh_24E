<?php

namespace App\Http\Controllers;

use App\Models\TaiKhoanNguoiDung;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class NguoiDungController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            TaiKhoanNguoiDung::orderBy('id')->paginate($request->get('per_page', 10))
        );
    }

    public function thungRac(Request $request)
    {
        return response()->json(
            TaiKhoanNguoiDung::onlyTrashed()->orderByDesc('deleted_at')->paginate($request->get('per_page', 10))
        );
    }

    public function donHang($id)
    {
        $user = TaiKhoanNguoiDung::withTrashed()->findOrFail($id);

        $donHang = DB::table('don_hang')
            ->where('nguoi_dung_id', $user->id)
            ->orderByDesc('created_at')
            ->get();

        $chiTiet = DB::table('chi_tiet_don_hang')
            ->whereIn('don_hang_id', $donHang->pluck('id'))
            ->get()
            ->groupBy('don_hang_id');

        $donHang = $donHang->map(function ($d) use ($chiTiet) {
            $d->chi_tiet = $chiTiet->get($d->id, collect())->values();
            return $d;
        });

        return response()->json(['data' => $donHang]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('tai_khoan_nguoi_dung', 'email')],
            'so_dien_thoai' => 'nullable|string|max:20',
            'dia_chi' => 'nullable|string|max:255',
            'mat_khau' => 'required|string|min:6',
            'trang_thai' => ['required', Rule::in(['hoat_dong', 'khoa'])],
        ]);

        $user = TaiKhoanNguoiDung::create($data);

        return response()->json(['data' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = TaiKhoanNguoiDung::findOrFail($id);

        $data = $request->validate([
            'ho_ten' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('tai_khoan_nguoi_dung', 'email')->ignore($user->id)],
            'so_dien_thoai' => 'nullable|string|max:20',
            'dia_chi' => 'nullable|string|max:255',
            'mat_khau' => 'nullable|string|min:6',
            'trang_thai' => ['required', Rule::in(['hoat_dong', 'khoa'])],
        ]);

        if (empty($data['mat_khau'])) {
            unset($data['mat_khau']);
        }

        $user->update($data);

        if ($user->trang_thai === 'khoa') {
            $user->tokens()->delete();
        }

        return response()->json(['data' => $user]);
    }

    public function doiTrangThai($id)
    {
        $user = TaiKhoanNguoiDung::findOrFail($id);

        $user->update([
            'trang_thai' => $user->trang_thai === 'hoat_dong' ? 'khoa' : 'hoat_dong',
        ]);

        if ($user->trang_thai === 'khoa') {
            $user->tokens()->delete();
        }

        return response()->json(['data' => $user]);
    }

    public function destroy($id)
    {
        $user = TaiKhoanNguoiDung::findOrFail($id);
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Đã chuyển vào thùng rác']);
    }

    public function khoiPhuc($id)
    {
        $user = TaiKhoanNguoiDung::onlyTrashed()->findOrFail($id);
        $user->restore();

        return response()->json(['data' => $user]);
    }

    public function xoaVinhVien($id)
    {
        TaiKhoanNguoiDung::onlyTrashed()->findOrFail($id)->forceDelete();

        return response()->json(['message' => 'Đã xoá vĩnh viễn']);
    }
}