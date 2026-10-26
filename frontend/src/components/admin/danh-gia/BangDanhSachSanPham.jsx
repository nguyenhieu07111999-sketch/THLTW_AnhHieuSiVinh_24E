'use client';

import React from 'react';

export default function BangDanhSachSanPham({
  dsSanPham,
  dangTai,
  tuKhoa,
  setTuKhoa,
  trangHienTai,
  setTrangHienTai,
  tongTrang,
  onChonSanPham,
}) {
  return (
    <div className="space-y-4">
      {/* Tìm kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm có đánh giá..."
            value={tuKhoa}
            onChange={(e) => {
              setTuKhoa(e.target.value);
              setTrangHienTai(1);
            }}
            className="w-full border border-gray-200 pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Hiển thị: <strong>{dsSanPham.length}</strong> sản phẩm
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {dangTai ? (
          <div className="py-24 text-center text-sm text-gray-500">Đang tải dữ liệu sản phẩm...</div>
        ) : dsSanPham.length === 0 ? (
          <div className="py-24 text-center text-sm text-gray-400">
            Chưa có sản phẩm nào nhận được đánh giá.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-100">
              <tr>
                <th className="p-4 w-16 text-center">ID</th>
                <th className="p-4">Sản Phẩm</th>
                <th className="p-4 w-40 text-center">Tổng Review</th>
                <th className="p-4 w-44 text-center">Điểm Trung Bình</th>
                <th className="p-4 w-36 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dsSanPham.map((sp) => (
                <tr key={sp.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 font-mono text-xs text-gray-400 text-center">#{sp.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                        {sp.hinh_anh ? (
                          <img src={sp.hinh_anh} alt={sp.ten_san_pham} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🥬</div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{sp.ten_san_pham}</div>
                        <span className="text-[11px] text-gray-400">Mã kho: SP-{sp.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-100">
                      {sp.tong_review} nhận xét
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-xl border border-amber-100">
                      <span className="text-amber-500 font-black text-sm">{sp.diem_trung_binh}</span>
                      <span className="text-amber-400 text-xs">★</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => onChonSanPham(sp.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Xem chi tiết &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Phân trang */}
      {tongTrang > 1 && (
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={trangHienTai === 1}
            onClick={() => setTrangHienTai((prev) => Math.max(1, prev - 1))}
            className="px-3.5 py-1.5 border rounded-xl text-xs disabled:opacity-40 bg-white"
          >
            Trước
          </button>
          <span className="px-3 py-1.5 text-xs text-gray-600 font-medium">
            {trangHienTai} / {tongTrang}
          </span>
          <button
            type="button"
            disabled={trangHienTai === tongTrang}
            onClick={() => setTrangHienTai((prev) => Math.min(tongTrang, prev + 1))}
            className="px-3.5 py-1.5 border rounded-xl text-xs disabled:opacity-40 bg-white"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}