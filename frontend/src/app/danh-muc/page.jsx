'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function TrangDanhMuc() {
  const [danhMucChon, setDanhMucChon] = useState('tat-ca');

  const danhMuc = [
    { id: 'tat-ca', ten: 'Tất cả nông sản', icon: '🧺' },
    { id: 'rau-cu', ten: 'Rau củ hữu cơ', icon: '🌱' },
    { id: 'trai-cay', ten: 'Trái cây tươi', icon: '🍎' },
    { id: 'thit-hai-san', ten: 'Thịt & Hải sản sạch', icon: '🥩' },
  ];

  const sanPhamMock = [
    { id: 1, ten: 'Cà Rốt Đà Lạt', gia: '27.000đ', loai: 'rau-cu', icon: '🥕' },
    { id: 2, ten: 'Táo Red Delicious', gia: '85.000đ', loai: 'trai-cay', icon: '🍎' },
    { id: 3, ten: 'Cải Bắp Trắng', gia: '22.000đ', loai: 'rau-cu', icon: '🥬' },
    { id: 4, ten: 'Thịt Heo Sạch Sumag', gia: '135.000đ', loai: 'thit-hai-san', icon: '🥩' },
  ];

  // Lọc sản phẩm theo danh mục được chọn
  const sanPhamHienThi = danhMucChon === 'tat-ca' 
    ? sanPhamMock 
    : sanPhamMock.filter(sp => sp.loai === danhMucChon);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Bộ lọc bên trái */}
      <aside className="bg-white p-5 rounded-2xl border border-emerald-100 h-fit space-y-2">
        <h3 className="font-bold text-lg mb-4 text-emerald-950">Danh Mục Thực Phẩm</h3>
        {danhMuc.map((item) => (
          <button
            key={item.id}
            onClick={() => setDanhMucChon(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              danhMucChon === item.id 
                ? 'bg-emerald-600 text-white font-bold' 
                : 'text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.ten}</span>
          </button>
        ))}
      </aside>

      {/* Lưới Sản phẩm */}
      <main className="md:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-6">
        {sanPhamHienThi.map((sp) => (
          <div key={sp.id} className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="h-36 bg-emerald-50 rounded-xl mb-3 flex items-center justify-center text-4xl">
                {sp.icon}
              </div>
              <h4 className="font-bold text-gray-800 text-sm">{sp.ten}</h4>
              <p className="text-emerald-700 font-extrabold mt-1">{sp.gia}</p>
            </div>
            
            <Link
              href={`/danh-muc/${sp.id}`}
              className="w-full mt-3 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-center py-2 rounded-lg text-xs font-bold transition-colors block"
            >
              Xem Chi Tiết
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}