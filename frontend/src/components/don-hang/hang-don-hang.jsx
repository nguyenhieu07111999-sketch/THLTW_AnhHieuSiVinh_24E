'use client';
import React from 'react';

const HUY_HIEU_TRANG_THAI = {
  cho_xac_nhan: { label: 'Chờ xác nhận', bg: 'bg-amber-100 text-amber-800' },
  da_xac_nhan: { label: 'Đã xác nhận', bg: 'bg-blue-100 text-blue-800' },
  dang_giao: { label: 'Đang giao', bg: 'bg-purple-100 text-purple-800' },
  hoan_thanh: { label: 'Hoàn thành', bg: 'bg-emerald-100 text-emerald-800' },
};

const HUY_HIEU_THANH_TOAN = {
  chua_thanh_toan: { label: 'Chưa thanh toán', bg: 'bg-rose-100 text-rose-800' },
  da_thanh_toan: { label: 'Đã thanh toán', bg: 'bg-emerald-100 text-emerald-800' },
  hoan_tien: { label: 'Đã hoàn tiền', bg: 'bg-gray-100 text-gray-800' },
};

export default function HangDonHang({ donHang, onXemChiTiet, onCapNhatTrangThai }) {
  const trangThaiInfo = HUY_HIEU_TRANG_THAI[donHang.trang_thai_don_hang] || { label: donHang.trang_thai_don_hang, bg: 'bg-gray-100 text-gray-800' };
  const thanhToanInfo = HUY_HIEU_THANH_TOAN[donHang.trang_thai_thanh_toan] || { label: donHang.trang_thai_thanh_toan, bg: 'bg-gray-100 text-gray-800' };

  return (
    <tr className="hover:bg-gray-50/80 transition">
      <td className="p-4 font-semibold text-gray-900">#{donHang.id}</td>
      <td className="p-4">
        <div className="font-medium text-gray-800">{donHang.ten_nguoi_nhan}</div>
        <div className="text-xs text-gray-500">{donHang.so_dien_thoai_nhan}</div>
      </td>
      <td className="p-4 font-semibold text-emerald-600">
        {Number(donHang.thanh_tien).toLocaleString('vi-VN')} đ
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${trangThaiInfo.bg}`}>
          {trangThaiInfo.label}
        </span>
      </td>
      <td className="p-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${thanhToanInfo.bg}`}>
          {thanhToanInfo.label}
        </span>
      </td>
      <td className="p-4 text-xs text-gray-500">{donHang.ngay_tao}</td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          {/* Nút xem chi tiết */}
          <button
            onClick={() => onXemChiTiet(donHang.id)}
            className="p-1.5 bg-gray-100 hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 rounded-lg transition"
            title="Xem chi tiết"
          >
            👁️
          </button>
          
          <select
            value={donHang.trang_thai_don_hang}
            onChange={(e) => onCapNhatTrangThai(donHang.id, { trang_thai_don_hang: e.target.value })}
            className="text-xs border rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="cho_xac_nhan">Chờ xác nhận</option>
            <option value="da_xac_nhan">Đã xác nhận</option>
            <option value="dang_giao">Đang giao</option>
            <option value="hoan_thanh">Hoàn thành</option>
          </select>
        </div>
      </td>
    </tr>
  );
}