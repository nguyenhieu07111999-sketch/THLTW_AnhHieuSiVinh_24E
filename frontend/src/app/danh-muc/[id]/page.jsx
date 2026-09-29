'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TrangChiTietSanPham({ params }) {
  const router = useRouter();
  const { id } = React.use(params); // Lấy id sản phẩm từ URL
  const [soLuong, setSoLuong] = useState(1);

  const handleThemVaoGio = () => {
    // Gọi dichVuGioHang.themVaoGio(id, soLuong)
    alert(`Đã thêm ${soLuong} sản phẩm (ID: ${id}) vào giỏ hàng!`);
    router.push('/gio-hang'); // Tự động chuyển hướng đến giỏ hàng
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:underline">Trang chủ</Link> / <Link href="/danh-muc" className="hover:underline">Danh mục</Link> / <span className="text-emerald-700 font-medium">Chi tiết sản phẩm #{id}</span>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ảnh sản phẩm */}
        <div className="h-80 bg-emerald-50 rounded-xl flex items-center justify-center text-7xl border border-emerald-100">
          🥬
        </div>

        {/* Thông tin sản phẩm */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">VietGAP</span>
          <h1 className="text-2xl font-bold text-gray-800">Rau Cải Thảo Hữu Cơ Đà Lạt</h1>
          <p className="text-2xl font-extrabold text-emerald-700">35.000đ <span className="text-sm font-normal text-gray-400">/ 1kg</span></p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Rau cải thảo được trồng theo tiêu chuẩn hữu cơ tại Đà Lạt, đảm bảo không hóa chất trừ sâu, giữ nguyên độ ngọt tự nhiên và giòn tươi.
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
              <button 
                onClick={() => setSoLuong(prev => Math.max(1, prev - 1))}
                className="px-3 py-1.5 font-bold hover:bg-emerald-500 hover:text-white transition-colors"
              >
                -
              </button>
              <span className="px-4 font-semibold">{soLuong}</span>
              <button 
                onClick={() => setSoLuong(prev => prev + 1)}
                className="px-3 py-1.5 font-bold hover:bg-emerald-500 hover:text-white transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={handleThemVaoGio}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-100"
            >
              🛒 Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}