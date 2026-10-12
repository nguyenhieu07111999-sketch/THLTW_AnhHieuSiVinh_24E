import { useState, useEffect, useCallback } from 'react';
import dichVuDonHang from '@/services/dich-vu-don-hang';

const layMangDuLieu = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

export default function useDonHangData(hienThongBao) {
  const [danhSachDonHang, setDanhSachDonHang] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);
  const [tongSoItem, setTongSoItem] = useState(0);
  const [soMucMoiTrang, setSoMucMoiTrang] = useState(10);
  
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');
  const [trangThaiLoc, setTrangThaiLoc] = useState('');

  const taiDanhSach = useCallback(async () => {
    setDangTai(true);
    try {
      const response = await dichVuDonHang.layDanhSach({
        page: trangHienTai,
        search: tuKhoaTimKiem,
        trang_thai: trangThaiLoc,
      });

      const mangDuLieu = layMangDuLieu(response);
      setDanhSachDonHang(mangDuLieu);

      const payload = response?.data;
      setTongSoTrang(payload?.meta?.last_page || payload?.last_page || 1);
      setTongSoItem(payload?.meta?.total || payload?.total || mangDuLieu.length);
      setSoMucMoiTrang(payload?.meta?.per_page || payload?.per_page || 10);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
      hienThongBao('Không thể tải danh sách đơn hàng. Vui lòng thử lại.', 'error');
      setDanhSachDonHang([]);
    } finally {
      setDangTai(false);
    }
  }, [trangHienTai, tuKhoaTimKiem, trangThaiLoc, hienThongBao]);

  useEffect(() => {
    taiDanhSach();
  }, [taiDanhSach]);

  return {
    danhSachDonHang,
    setDanhSachDonHang,
    dangTai,
    setDangTai,
    trangHienTai,
    setTrangHienTai,
    tongSoTrang,
    tongSoItem,
    soMucMoiTrang,
    tuKhoaTimKiem,
    setTuKhoaTimKiem,
    trangThaiLoc,
    setTrangThaiLoc,
    taiDanhSach,
  };
}