<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterNguoiDungRequest;
use App\Http\Requests\LoginNguoiDungRequest;
use App\Http\Resources\TaiKhoanNguoiDungResource;
use App\Models\TaiKhoanNguoiDung;
use App\Models\TaiKhoanQuanTri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterNguoiDungRequest $request)
    {
        $validated = $request->validated();

        $validated['mat_khau'] = Hash::make($validated['mat_khau']);
        $validated['trang_thai'] = 'hoat_dong';

        $user = TaiKhoanNguoiDung::create($validated);

        $token = $user->createToken('user_token')->plainTextToken;

        return (new TaiKhoanNguoiDungResource($user))
            ->additional([
                'message'      => 'Đăng ký tài khoản thành công!',
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ])
            ->response()
            ->setStatusCode(201);
    }

    //Login
    public function login(LoginNguoiDungRequest $request)
    {
        $credentials = $request->validated();

        $user = TaiKhoanNguoiDung::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['mat_khau'], $user->mat_khau)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác.'
            ], 401);
        }

        if ($user->trang_thai === 'khoa') {
            return response()->json([
                'message' => 'Tài khoản của bạn đã bị khóa.'
            ], 403);
        }

        $token = $user->createToken('user_token')->plainTextToken;

        return (new TaiKhoanNguoiDungResource($user))
            ->additional([
                'message'      => 'Đăng nhập thành công!',
                'access_token' => $token,
                'token_type'   => 'Bearer',
            ]);
    }

    public function adminLogin(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email',
            'mat_khau' => 'required|string',
        ]);

        $admin = TaiKhoanQuanTri::where('email', $credentials['email'])->first();

        if (!$admin || !Hash::check($credentials['mat_khau'], $admin->mat_khau)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác.'
            ], 401);
        }

        if ($admin->trang_thai === 'khoa') {
            return response()->json([
                'message' => 'Tài khoản quản trị đã bị khóa.'
            ], 403);
        }

        $token = $admin->createToken('admin_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập admin thành công!',
            'data'    => [
                'id'      => $admin->id,
                'ho_ten'  => $admin->ho_ten,
                'email'   => $admin->email,
                'vai_tro' => $admin->vai_tro,
            ],
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công!'
        ], 200);
    }
}