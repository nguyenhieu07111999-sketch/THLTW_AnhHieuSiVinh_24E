'use client';
import React, { useState, useCallback, useRef } from 'react';
import Toast from '@/components/thong-bao/toast';
import FormThuongHieuModal from '@/components/thuong-hieu/form-thuong-hieu-modal';

import useThuongHieuData from '@/hooks/useThuongHieuData';
import useThuongHieuActions from '@/hooks/useThuongHieuActions';
import useModalThuongHieu from '@/hooks/useModalThuongHieu';

export default function QuanLyThuongHieuPage() {
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('success');
  const timerThongBao = useRef(null);

  const hienThongBao = useCallback((noiDung, loai = 'success') => {
    if (timerThongBao.current) clearTimeout(timerThongBao.current);
    setThongBao(noiDung);
    setLoaiThongBao(loai);
    timerThongBao.current = setTimeout(() => setThongBao(''), 3000);
  }, []);

  const data = useThuongHieuData(hienThongBao);
  const actions = useThuongHieuActions(data.taiDanhSach, data.setDangTai, hienThongBao);
  const modalData = useModalThuongHieu(data.taiDanhSach, hienThongBao);

  const doiCheDoThungRac = () => {
    data.setTrangHienTai(1);
    data.setDangTai(true);
    data.setDangXemThungRac(!data.dangXemThungRac);
  };

  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {data.dangXemThungRac ? '🗑 Thùng Rác Thương Hiệu' : '🏷 Quản Lý Thương Hiệu'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={doiCheDoThungRac}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${data.dangXemThungRac ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {data.dangXemThungRac ? '← Quay lại Danh sách' : '🗑 Xem Thùng rác'}
          </button>
          {!data.dangXemThungRac && (
            <button
              onClick={modalData.moModalThem}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              + Thêm thương hiệu
            </button>
          )}
        </div>
      </div>

      <div className="overflow-visible rounded-xl border bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="p-4">ID</th>
              {!data.dangXemThungRac && <th className="p-4">Logo</th>}
              <th className="p-4">Tên thương hiệu</th>
              <th className="p-4">Đường dẫn</th>
              {!data.dangXemThungRac && <th className="p-4 text-center">Trạng thái</th>}
              {data.dangXemThungRac && <th className="p-4">Ngày xóa</th>}
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {data.dangTai ? (
              <tr><td colSpan="6" className="text-center p-8 text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : data.danhSachThuongHieu.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-8 text-gray-500">
                {data.dangXemThungRac ? 'Thùng rác trống.' : 'Chưa có thương hiệu nào.'}
              </td></tr>
            ) : (
              data.danhSachThuongHieu.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-gray-500">#{item.id}</td>
                  {!data.dangXemThungRac && (
                    <td className="p-4">
                      <img
                        src={
                          item.logo 
                            ? (item.logo.startsWith('http') ? item.logo : `http://127.0.0.1:8000/storage/${item.logo}`)
                            : 'https://via.placeholder.com/48?text=No+Image'
                        }
                        alt={item.ten_thuong_hieu}
                        className="w-12 h-12 object-cover rounded-lg border"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48?text=L%E1%BB%97i'; }}
                      />
                    </td>
                  )}
                  <td className="p-4 font-medium text-gray-800">{item.ten_thuong_hieu}</td>
                  <td className="p-4 font-mono text-xs text-gray-500">{item.duong_dan_th}</td>
                  {!data.dangXemThungRac && (
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.trang_thai === 'hien_thi' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.trang_thai === 'hien_thi' ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                  )}
                  {data.dangXemThungRac && (
                    <td className="p-4 text-gray-500">
                      {item.deleted_at ? new Date(item.deleted_at).toLocaleString('vi-VN') : '—'}
                    </td>
                  )}
                  <td className="p-4 text-center">
                    {data.dangXemThungRac ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => actions.xuLyKhoiPhuc(item.id, data.danhSachThuongHieu)}
                          className="rounded bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                        >
                          Khôi phục
                        </button>
                        <button
                          onClick={() => actions.xuLyXoaVinhVien(item)}
                          className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Xóa hẳn
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => modalData.moModalSua(item)}
                          className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => actions.xuLyXoaTam(item)}
                          className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <FormThuongHieuModal {...modalData} />
    </div>
  );
}