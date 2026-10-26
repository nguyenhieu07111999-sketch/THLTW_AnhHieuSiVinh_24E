'use client';

import React from 'react';
import Link from 'next/link';
import { useDoiMatKhauOtp } from '@/hooks/useDoiMatKhauOtp';
import FormDoiMatKhauOtp from '@/components/ho-so/FormDoiMatKhauOtp';

export default function DoiMatKhauPage() {
  const {
    formData,
    demNguoc,
    dangGuiOtp,
    dangXuLy,
    thongBao,
    handleChange,
    handleGuiOtp,
    handleSubmit,
  } = useDoiMatKhauOtp();

  return (
    <div className="min-h-[75vh] py-10 px-4 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        {/* Header trang */}
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-black text-gray-800">Đổi Mật Khẩu Tài Khoản</h1>
          <p className="text-xs text-gray-500">
            Bảo vệ tài khoản bằng việc xác thực mã OTP gửi về Email đã đăng ký
          </p>
        </div>

        {/* Component Form */}
        <FormDoiMatKhauOtp
          formData={formData}
          demNguoc={demNguoc}
          dangGuiOtp={dangGuiOtp}
          dangXuLy={dangXuLy}
          thongBao={thongBao}
          onChange={handleChange}
          onGuiOtp={handleGuiOtp}
          onSubmit={handleSubmit}
        />

        {/* Quay lại hồ sơ */}
        <div className="text-center pt-2 border-t border-gray-100">
          <Link
            href="/ho-so"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            &larr; Quay lại thông tin tài khoản
          </Link>
        </div>
      </div>
    </div>
  );
}