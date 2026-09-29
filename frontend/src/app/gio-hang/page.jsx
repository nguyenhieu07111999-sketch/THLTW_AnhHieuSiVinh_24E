'use client';

import React from 'react';

export default function TrangGioHang() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-950 mb-6">🛒 Giỏ Hàng Của Bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* Mẫu item giỏ hàng đồng bộ DB */}
          <div className="bg-white p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-2xl">🥕</div>
              <div>
                <h3 className="font-semibold text-gray-800">Cà Rốt Hữu Cơ Đà Lạt</h3>
                <p className="text-sm font-bold text-emerald-700">27.000đ</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input type="number" defaultValue={2} min={1} className="w-12 border text-center rounded-lg py-1" />
              <button className="text-red-500 text-sm hover:underline">Xóa</button>
            </div>
          </div>
        </div>

        {/* Cột Tổng tiền */}
        <div className="bg-white p-6 rounded-2xl border border-emerald-100 h-fit">
          <h3 className="font-bold text-lg mb-4">Tóm Tắt Đơn Hàng</h3>
          <div className="flex justify-between mb-2">
            <span>Tạm tính:</span>
            <span className="font-bold">54.000đ</span>
          </div>
          <div className="flex justify-between mb-4 text-emerald-600 font-medium">
            <span>Phí giao hàng:</span>
            <span>Miễn phí</span>
          </div>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
            Tiến Hành Thanh Toán
          </button>
        </div>
      </div>
    </div>
  );
}