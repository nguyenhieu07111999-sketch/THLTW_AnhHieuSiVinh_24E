'use client';

import React from 'react';

export default function FormDoiMatKhauOtp({
  formData,
  demNguoc,
  dangGuiOtp,
  dangXuLy,
  thongBao,
  onChange,
  onGuiOtp,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Thông báo lỗi / thành công */}
      {thongBao.msg && (
        <div
          className={`p-3 text-xs rounded-xl border ${
            thongBao.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {thongBao.msg}
        </div>
      )}

      {/* Mật khẩu cũ */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Mật khẩu hiện tại <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="mat_khau_cu"
          placeholder="••••••••"
          value={formData.mat_khau_cu}
          onChange={onChange}
          className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
          required
        />
      </div>

      {/* Mật khẩu mới */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Mật khẩu mới (tối thiểu 6 ký tự) <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="mat_khau_moi"
          placeholder="••••••••"
          value={formData.mat_khau_moi}
          onChange={onChange}
          className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
          required
        />
      </div>

      {/* Xác nhận mật khẩu mới */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Xác nhận mật khẩu mới <span className="text-red-500">*</span>
        </label>
        <input
          type="password"
          name="mat_khau_moi_confirmation"
          placeholder="••••••••"
          value={formData.mat_khau_moi_confirmation}
          onChange={onChange}
          className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
          required
        />
      </div>

      {/* Ô nhập mã OTP + Nút nhận OTP */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">
          Mã xác thực OTP (Gửi về Gmail) <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="ma_otp"
            maxLength={6}
            placeholder="6 chữ số"
            value={formData.ma_otp}
            onChange={onChange}
            className="flex-1 border border-gray-200 p-2.5 rounded-xl text-sm tracking-widest font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          />
          <button
            type="button"
            disabled={demNguoc > 0 || dangGuiOtp}
            onClick={onGuiOtp}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition disabled:opacity-50 whitespace-nowrap"
          >
            {dangGuiOtp
              ? 'Đang gửi...'
              : demNguoc > 0
              ? `Gửi lại (${demNguoc}s)`
              : 'Nhận mã OTP'}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          Mã xác thực có hiệu lực trong vòng 5 phút kể từ khi gửi.
        </p>
      </div>

      {/* Nút gửi form */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={dangXuLy}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-sm disabled:opacity-50"
        >
          {dangXuLy ? 'Đang cập nhật mật khẩu...' : 'Xác Nhận Đổi Mật Khẩu'}
        </button>
      </div>
    </form>
  );
}