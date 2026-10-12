'use client';

import React, { useState, useCallback } from 'react';
import Toast from '@/components/thong-bao/toast';
import PhanTrang from '@/components/dieu-huong/phan-trang';
import HangSanPham from '@/components/san-pham/hang-san-pham';
import ChiTietSanPhamModal from '@/components/san-pham/chi-tiet-san-pham-modal';
import FormSanPhamModal from '@/components/san-pham/form-san-pham-modal';

import useSanPhamData from '@/hooks/useSanPhamData';
import useSanPhamActions from '@/hooks/useSanPhamActions';
import useModalSanPham from '@/hooks/useModalSanPham';

export default function QuanLySanPhamPage() {
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('success');
  
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState(null);

  const hienThongBao = useCallback((msg, loai = 'success') => {
    setThongBao(msg);
    setLoaiThongBao(loai);
    setTimeout(() => setThongBao(''), 3000);
  }, []);

  const data = useSanPhamData(hienThongBao);
  const actions = useSanPhamActions(data.taiDanhSach, data.setDangTai, hienThongBao, data.setDanhSachSanPham);
  const modalData = useModalSanPham(data.taiDanhSach, hienThongBao);

  const doiCheDoThungRac = () => {
    data.setTrangHienTai(1);
    data.setDangTai(true);
    data.setDangXemThungRac(!data.dangXemThungRac);
  };

  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {data.dangXemThungRac ? '🗑 Thùng Rác Sản Phẩm' : '📦 Quản Lý Sản Phẩm'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={doiCheDoThungRac} className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${data.dangXemThungRac ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
            {data.dangXemThungRac ? '← Quay lại Danh sách' : '🗑 Xem Thùng rác'}
          </button>
          {!data.dangXemThungRac && (
            <button onClick={modalData.moModalThem} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm">
              + Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      <div className="overflow-visible rounded-xl border bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="p-4">ID</th><th className="p-4">Hình ảnh</th><th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Giá bán</th><th className="p-4">Số lượng tồn</th><th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {data.dangTai ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : data.danhSachHienThi.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">Không có sản phẩm nào.</td></tr>
            ) : (
              data.danhSachHienThi.map((sp) => (
                <HangSanPham 
                  key={sp.id} sp={sp} dangXemThungRac={data.dangXemThungRac}
                  openDropdownId={openDropdownId} setOpenDropdownId={setOpenDropdownId}
                  actions={actions} modalData={modalData}
                  setSanPhamChiTiet={setSanPhamChiTiet} setMoModalChiTiet={setMoModalChiTiet}
                />
              ))
            )}
          </tbody>
        </table>

        {!data.dangTai && data.danhSachSanPham.length > 0 && (
          <PhanTrang
                    trangHienTai={data.trangHienTai}
                    tongSoTrang={data.tongSoTrang}
                    setTrangHienTai={data.setTrangHienTai}
                    tongSoItem={data.tongSoItem}
                    soItemMoiTrang={data.soMucMoiTrang}
                    tenLoaiItem={data.dangXemThungRac ? 'sản phẩm' : 'sản phẩm'}
                  />
        )}
      </div>

      <ChiTietSanPhamModal moModalChiTiet={moModalChiTiet} setMoModalChiTiet={setMoModalChiTiet} sanPhamChiTiet={sanPhamChiTiet} />
      <FormSanPhamModal 
        {...modalData} 
        categories={data.danhSachDanhMuc} 
        brands={data.danhSachThuongHieu} 
      />

    </div>
  );
}