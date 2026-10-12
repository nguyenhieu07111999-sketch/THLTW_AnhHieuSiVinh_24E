'use client';
import React, { useState, useCallback } from 'react';
import Toast from '@/components/thong-bao/toast';
import PhanTrang from '@/components/dieu-huong/phan-trang';
import HangDonHang from '@/components/don-hang/hang-don-hang';
import ChiTietDonHangModal from '@/components/don-hang/chi-tiet-don-hang-modal';

import useDonHangData from '@/hooks/useDonHangData';
import useDonHangActions from '@/hooks/useDonHangActions';
import useModalDonHang from '@/hooks/useModalDonHang';

export default function QuanLyDonHangPage() {
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('success');

  const hienThongBao = useCallback((msg, loai = 'success') => {
    setThongBao(msg);
    setLoaiThongBao(loai);
    setTimeout(() => setThongBao(''), 3000);
  }, []);

  const data = useDonHangData(hienThongBao);
  const actions = useDonHangActions(data.taiDanhSach, hienThongBao);
  const modal = useModalDonHang(hienThongBao);

  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📋 Quản Lý Đơn Hàng Lưu Trữ</h1>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên, SĐT..."
            value={data.tuKhoaTimKiem}
            onChange={(e) => data.setTuKhoaTimKiem(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
          />
          <select
            value={data.trangThaiLoc}
            onChange={(e) => data.setTrangThaiLoc(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="cho_xac_nhan">Chờ xác nhận</option>
            <option value="da_xac_nhan">Đã xác nhận</option>
            <option value="dang_giao">Đang giao</option>
            <option value="hoan_thanh">Hoàn thành</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="p-4">Mã ĐH</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái đơn</th>
              <th className="p-4">Thanh toán</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {data.dangTai ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">Đang tải dữ liệu đơn hàng...</td></tr>
            ) : data.danhSachDonHang.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">Không có đơn hàng nào trong hệ thống.</td></tr>
            ) : (
              data.danhSachDonHang.map((dh) => (
                <HangDonHang
                  key={dh.id}
                  donHang={dh}
                  onXemChiTiet={modal.xemChiTiet}
                  onCapNhatTrangThai={actions.capNhatTrangThaiDonHang}
                />
              ))
            )}
          </tbody>
        </table>

        {!data.dangTai && data.tongSoItem > 0 && (
          <PhanTrang
            trangHienTai={data.trangHienTai}
            tongSoTrang={data.tongSoTrang}
            setTrangHienTai={data.setTrangHienTai}
            tongSoItem={data.tongSoItem}
            soItemMoiTrang={data.soMucMoiTrang}
            tenLoaiItem="đơn hàng"
          />
        )}
      </div>

      <ChiTietDonHangModal
        moModal={modal.moModalChiTiet}
        dongModal={modal.dongModalChiTiet}
        donHang={modal.donHangChiTiet}
        dangTai={modal.dangTaiChiTiet}
      />
    </div>
  );
}