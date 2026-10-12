<?php

namespace App\Http\Controllers;

use App\Models\DonHang;
use App\Http\Resources\DonHangResource;
use App\Http\Requests\UpdateDonHangRequest;
use Illuminate\Http\Request;

class DonHangController extends Controller
{

    public function index(Request $request)
    {
        $query = DonHang::with(['nguoiDung', 'chiTiet.sanPham']);

        if ($request->has('trang_thai') && $request->trang_thai !== '') {
            $query->where('trang_thai_don_hang', $request->trang_thai);
        }

        if ($request->has('search') && $request->search !== '') {
            $query->timKiem($request->search);
        }

        $donHangs = $query->orderBy('created_at', 'desc')->paginate(10);

        return DonHangResource::collection($donHangs);
    }

    public function show($id)
    {
        $donHang = DonHang::with(['nguoiDung', 'chiTiet.sanPham'])->findOrFail($id);

        return new DonHangResource($donHang);
    }

    public function update(UpdateDonHangRequest $request, $id)
    {
        $donHang = DonHang::findOrFail($id);

        $donHang->update($request->validated());

        return response()->json([
            'message' => 'Cập nhật trạng thái đơn hàng thành công!',
            'data' => new DonHangResource($donHang->load(['nguoiDung', 'chiTiet.sanPham']))
        ], 200);
    }
}