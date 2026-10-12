import React from 'react';

export default function ChiTietSanPhamModal({ moModalChiTiet, setMoModalChiTiet, sanPhamChiTiet }) {
  if (!moModalChiTiet || !sanPhamChiTiet) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">🔍 Chi Tiết Sản Phẩm #{sanPhamChiTiet.id}</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-center mb-4">
            <img src={sanPhamChiTiet.hinh_anh || 'https://via.placeholder.com/120'} alt={sanPhamChiTiet.ten_san_pham} className="w-32 h-32 object-cover rounded-xl border shadow-sm" />
          </div>
          <p><strong>Tên sản phẩm:</strong> {sanPhamChiTiet.ten_san_pham}</p>
          <p><strong>Đường dẫn (Slug):</strong> {sanPhamChiTiet.duong_dan_sp || 'Chưa thiết lập'}</p>
          <p><strong>Giá bán:</strong> <span className="text-emerald-600 font-semibold">{Number(sanPhamChiTiet.gia_ban).toLocaleString('vi-VN')} đ</span></p>
          <p><strong>Tồn kho:</strong> {sanPhamChiTiet.so_luong_ton_kho} {sanPhamChiTiet.don_vi_tinh}</p>
          <p><strong>Mô tả ngắn:</strong> {sanPhamChiTiet.mo_ta_ngan || 'Không có mô tả'}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={() => setMoModalChiTiet(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition">Đóng</button>
        </div>
      </div>
    </div>
  );
}