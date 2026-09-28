<?php

namespace App\Http\Middleware;

use App\Models\TaiKhoanQuanTri;
use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $admin = $request->user();

        if (
            !($admin instanceof TaiKhoanQuanTri) ||
            $admin->trang_thai !== 'hoat_dong' ||
            !in_array($admin->vai_tro, ['super_admin', 'admin'])
        ) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện thao tác này.'
            ], 403);
        }

        return $next($request);
    }
}