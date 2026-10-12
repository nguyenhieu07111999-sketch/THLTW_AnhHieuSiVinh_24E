import { useState, useEffect, useCallback } from 'react';
import { dichVuThuongHieu } from '@/services/dich-vu-thuong-hieu';

const layMangDuLieu = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export default function useThuongHieuData(hienThongBao) {
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangXemThungRac, setDangXemThungRac] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);

  const taiDanhSach = useCallback(async () => {
    setDangTai(true);
    try {
      const response = dangXemThungRac
        ? await dichVuThuongHieu.layThungRac()
        : await dichVuThuongHieu.layDanhSach();
      setDanhSachThuongHieu(layMangDuLieu(response));
    } catch (err) {
      console.error('Lỗi khi tải danh sách thương hiệu:', err);
      hienThongBao('Không thể tải danh sách thương hiệu. Vui lòng thử lại.', 'error');
    } finally {
      setDangTai(false);
    }
  }, [dangXemThungRac, hienThongBao]);

  useEffect(() => {
    taiDanhSach();
  }, [taiDanhSach]);

  return {
    danhSachThuongHieu,
    setDanhSachThuongHieu,
    dangTai,
    setDangTai,
    dangXemThungRac,
    setDangXemThungRac,
    trangHienTai,
    setTrangHienTai,
    taiDanhSach,
  };
}