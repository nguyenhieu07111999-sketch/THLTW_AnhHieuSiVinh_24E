'use client';

import React, { useState, useCallback } from 'react';
import ModalFormDanhMuc from '@/components/danh-muc/form-danh-muc-modal';
import HangDanhMuc from '@/components/danh-muc/hang-danh-muc';
import PhanTrang from '@/components/dieu-huong/phan-trang';
import Toast from '@/components/thong-bao/toast';
import useModalDanhMuc from '@/hooks/useModalDanhMuc';
import useDanhMucActions from '@/hooks/useDanhMucActions';
import useDanhMucData from '@/hooks/useDanhMucData';

export default function QuanLyDanhMucPage() {
  // 1. State thông báo (Cái này để UI quản lý)
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('success');

  const hienThongBao = useCallback((msg, loai = 'success') => {
    setThongBao(msg);
    setLoaiThongBao(loai);
    setTimeout(() => setThongBao(''), 3000);
  }, []);

  // 2. GỌI CÁC CUSTOM HOOKS (Não bộ của hệ thống)
  const data = useDanhMucData(hienThongBao);
  const modalData = useModalDanhMuc(data.taiDanhSach, hienThongBao, data.setDangTai);
  const actions = useDanhMucActions(data.taiDanhSach, data.setDangTai, hienThongBao);

  // 3. Hàm tương tác UI nhanh
  const doiCheDoThungRac = () => {
    data.setTrangHienTai(1);
    data.setBoLocDanhMuc(null);
    data.setDangTai(true);
    data.setDangXemThungRac((prev) => !prev);
  };

  const chonBoLocDanhMuc = (boLoc) => {
    data.setTrangHienTai(1);
    data.setBoLocDanhMuc((prev) => prev === boLoc ? null : boLoc);
  };

  // 4. HIỂN THỊ GIAO DIỆN (UI)
  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {data.dangXemThungRac ? '🗑️ Thùng Rác Danh Mục' : '🗂️ Quản Lý Danh Mục'}
          </h1>
          {!data.dangXemThungRac && <p className="text-sm text-gray-500 mt-1">Quản lý danh mục 2 cấp: danh mục cha và danh mục con</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={doiCheDoThungRac} disabled={data.dangTai}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${data.dangXemThungRac ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'} disabled:opacity-50`}
          >
            {data.dangXemThungRac ? '← Quay lại danh sách' : '🗑 Xem thùng rác'}
          </button>
          {!data.dangXemThungRac && (
            <button onClick={modalData.moModalThem} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2">
              <span>+</span> Thêm danh mục
            </button>
          )}
        </div>
      </div>

      {!data.dangXemThungRac && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button onClick={() => chonBoLocDanhMuc('cha')} className={`w-full text-left bg-white rounded-xl border p-4 flex gap-3 shadow-sm hover:shadow-md ${data.boLocDanhMuc === 'cha' ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">🗂️</div>
            <div><div className="text-2xl font-bold text-gray-800">{data.tongCap1}</div><div className="text-xs text-gray-500 font-medium">Danh mục cha</div></div>
          </button>
          <button onClick={() => chonBoLocDanhMuc('con')} className={`w-full text-left bg-white rounded-xl border p-4 flex gap-3 shadow-sm hover:shadow-md ${data.boLocDanhMuc === 'con' ? 'border-green-500 ring-2 ring-green-200' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">📁</div>
            <div><div className="text-2xl font-bold text-gray-800">{data.tongCap2}</div><div className="text-xs text-gray-500 font-medium">Danh mục con</div></div>
          </button>
          <button onClick={() => chonBoLocDanhMuc('noibat')} className={`w-full text-left bg-white rounded-xl border p-4 flex gap-3 shadow-sm hover:shadow-md ${data.boLocDanhMuc === 'noibat' ? 'border-amber-500 ring-2 ring-amber-200' : ''}`}>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-lg">⭐</div>
            <div><div className="text-2xl font-bold text-gray-800">{data.tongNoiBat}</div><div className="text-xs text-gray-500 font-medium">Có sản phẩm nổi bật</div></div>
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-4">ID</th>
              {!data.dangXemThungRac && <th className="p-4">Hình</th>}
              <th className="p-4">Tên danh mục / Slug</th>
              {data.dangXemThungRac && <th className="p-4">Danh mục cha</th>}
              {!data.dangXemThungRac && <th className="p-4 text-center">Cấp</th>}
              {!data.dangXemThungRac && <th className="p-4 text-center">Nổi bật</th>}
              {data.dangXemThungRac && <th className="p-4">Ngày xóa</th>}
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {data.dangTai ? (
              <tr><td colSpan={data.dangXemThungRac ? 5 : 6} className="text-center p-10 text-gray-400">Đang tải dữ liệu...</td></tr>
            ) : data.danhSachDangHienThi.length === 0 ? (
              <tr><td colSpan={data.dangXemThungRac ? 5 : 6} className="text-center p-10 text-gray-400">{data.dangXemThungRac ? 'Thùng rác trống' : 'Chưa có danh mục nào'}</td></tr>
            ) : data.dangXemThungRac ? (
              data.danhSachTrangHienTai.map((dm) => (
                <tr key={dm.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-400 text-sm">#{dm.id}</td>
                  <td className="p-4"><div className="font-semibold text-gray-800">{dm.ten_danh_muc}</div></td>
                  <td className="p-4 text-sm text-gray-600">{dm.parent?.ten_danh_muc || '—'}</td>
                  <td className="p-4 text-sm text-gray-500">{dm.deleted_at ? new Date(dm.deleted_at).toLocaleString('vi-VN') : '—'}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => actions.xuLyKhoiPhuc(dm)} disabled={actions.idDangThaoTacThungRac !== null} className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-medium">Khôi phục</button>
                      <button onClick={() => actions.xuLyXoaVinhVien(dm)} disabled={actions.idDangThaoTacThungRac !== null} className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium">Xóa hẳn</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              data.danhSachTrangHienTai.map(({ danhMuc, laDanhMucCon, tenDanhMucCha }) => (
                <HangDanhMuc 
                  key={danhMuc.id} 
                  dm={danhMuc} 
                  moModalSua={modalData.moModalSua} 
                  xuLyXoa={actions.xuLyXoa} 
                  laDanhMucCon={laDanhMucCon} 
                  tenDanhMucCha={tenDanhMucCha} 
                />
              ))
            )}
          </tbody>
        </table>

        {!data.dangTai && data.danhSachDangHienThi.length > 0 && (
          <PhanTrang
            trangHienTai={data.trangHienTai}
            tongSoTrang={data.tongSoTrang}
            setTrangHienTai={data.setTrangHienTai}
            tongSoItem={data.danhSachDangHienThi.length}
            soItemMoiTrang={data.soMucMoiTrang}
            tenLoaiItem={data.dangXemThungRac ? 'danh mục' : 'danh mục'}
          />
        )}
      </div>

      <ModalFormDanhMuc {...modalData} danhSachCha={data.danhSachCha} />
    </div>
  );
}