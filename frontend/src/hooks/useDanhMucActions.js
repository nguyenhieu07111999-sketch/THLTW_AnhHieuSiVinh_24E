import { useState } from 'react';
import { dichVuDanhMuc } from '@/services/dich-vu-danh-muc';

export default function useDanhMucActions(taiDanhSach, setDangTai, hienThongBao) {
  const [idDangThaoTacThungRac, setIdDangThaoTacThungRac] = useState(null);

  // 1. Xử lý chuyển vào thùng rác (Soft Delete)
  const xuLyXoa = async (id, ten) => {
    if (!window.confirm(`Chuyển danh mục "${ten}" vào thùng rác?`)) return;
    try {
      await dichVuDanhMuc.xoa(id);
      hienThongBao(`Đã chuyển "${ten}" vào thùng rác!`, 'success');
      setDangTai(true);
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 404) {
        setDangTai(true);
        await taiDanhSach();
      }
      hienThongBao(err.response?.data?.message || 'Không thể xóa danh mục này!', 'error');
    }
  };

  // 2. Xử lý khôi phục từ thùng rác
  const xuLyKhoiPhuc = async (danhMuc) => {
    if (idDangThaoTacThungRac !== null) return;
    setIdDangThaoTacThungRac(danhMuc.id);
    try {
      await dichVuDanhMuc.khoiPhuc(danhMuc.id);
      hienThongBao(`Đã khôi phục "${danhMuc.ten_danh_muc}"!`, 'success');
      setDangTai(true);
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 404) {
        setDangTai(true);
        await taiDanhSach();
      }
      hienThongBao(err.response?.data?.message || 'Không thể khôi phục danh mục!', 'error');
    } finally {
      setIdDangThaoTacThungRac(null);
    }
  };

  // 3. Xử lý xóa vĩnh viễn khỏi Database
  const xuLyXoaVinhVien = async (danhMuc) => {
    if (idDangThaoTacThungRac !== null) return;
    if (!window.confirm(`Xóa vĩnh viễn danh mục "${danhMuc.ten_danh_muc}"? Thao tác này không thể hoàn tác.`)) return;

    setIdDangThaoTacThungRac(danhMuc.id);
    try {
      await dichVuDanhMuc.xoaVinhVien(danhMuc.id);
      hienThongBao(`Đã xóa vĩnh viễn "${danhMuc.ten_danh_muc}"!`, 'success');
      setDangTai(true);
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 404) {
        setDangTai(true);
        await taiDanhSach();
      }
      hienThongBao(err.response?.data?.message || 'Không thể xóa vĩnh viễn danh mục!', 'error');
    } finally {
      setIdDangThaoTacThungRac(null);
    }
  };

  return {
    idDangThaoTacThungRac,
    xuLyXoa,
    xuLyKhoiPhuc,
    xuLyXoaVinhVien
  };
}