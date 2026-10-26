'use client';

import React from 'react';
import { useAdminDanhGia } from '@/hooks/useAdminDanhGia';
import BangDanhSachSanPham from '@/components/admin/danh-gia/BangDanhSachSanPham';
import ModalChiTietReview from '@/components/admin/danh-gia/ModalChiTietReview';
import FormCauHinhRules from '@/components/admin/danh-gia/FormCauHinhRules';

export default function QuanLyDanhGiaAdminPage() {
  const {
    tabHienTai,
    setTabHienTai,
    dsSanPham,
    dangTai,
    tuKhoa,
    setTuKhoa,
    trangHienTai,
    setTrangHienTai,
    tongTrang,
    spDangXem,
    setSpDangXem,
    dsReviewSp,
    locTrangThai,
    setLocTrangThai,
    locSoSao,
    setLocSoSao,
    dangTaiModal,
    mediaPhongTo,
    setMediaPhongTo,
    rules,
    setRules,
    dangLuuRules,
    moChiTietReview,
    handleDoiTrangThai,
    handleXoaReview,
    handleLuuRules,
  } = useAdminDanhGia();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-800">Quản Lý Đánh Giá & Kiểm Duyệt</h1>
          <p className="text-xs text-gray-500 mt-1">
            Gom nhóm nhận xét theo sản phẩm, kiểm duyệt ảnh/video và thiết lập quy tắc tự động
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl w-fit border border-gray-200">
          <button
            type="button"
            onClick={() => setTabHienTai('san-pham')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              tabHienTai === 'san-pham'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📦 Gom Theo Sản Phẩm
          </button>
          <button
            type="button"
            onClick={() => setTabHienTai('rules')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              tabHienTai === 'rules'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ⚙️ Cấu Hình Rules
          </button>
        </div>
      </div>

      {tabHienTai === 'san-pham' && (
        <BangDanhSachSanPham
          dsSanPham={dsSanPham}
          dangTai={dangTai}
          tuKhoa={tuKhoa}
          setTuKhoa={setTuKhoa}
          trangHienTai={trangHienTai}
          setTrangHienTai={setTrangHienTai}
          tongTrang={tongTrang}
          onChonSanPham={(id) => {
            setLocTrangThai('tat_ca');
            setLocSoSao('');
            moChiTietReview(id, 'tat_ca', '');
          }}
        />
      )}

      {tabHienTai === 'rules' && (
        <FormCauHinhRules
          rules={rules}
          setRules={setRules}
          onLuuRules={handleLuuRules}
          dangLuuRules={dangLuuRules}
        />
      )}

      <ModalChiTietReview
        spDangXem={spDangXem}
        dsReviewSp={dsReviewSp}
        dangTaiModal={dangTaiModal}
        locTrangThai={locTrangThai}
        setLocTrangThai={setLocTrangThai}
        locSoSao={locSoSao}
        setLocSoSao={setLocSoSao}
        onLocLai={moChiTietReview}
        onDongModal={() => setSpDangXem(null)}
        onDoiTrangThai={handleDoiTrangThai}
        onXoaReview={handleXoaReview}
        mediaPhongTo={mediaPhongTo}
        setMediaPhongTo={setMediaPhongTo}
      />
    </div>
  );
}