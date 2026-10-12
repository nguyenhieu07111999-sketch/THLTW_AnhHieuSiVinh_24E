import { useState, useEffect, useCallback, useMemo } from 'react';
import { dichVuSanPham } from '@/services/dich-vu-san-pham';

export default function useSanPhamData(hienThongBao) {
  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState([]);
  
  const [dangTai, setDangTai] = useState(true);
  const [dangXemThungRac, setDangXemThungRac] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);

  // 1. Hàm tải dữ liệu (Tải TẤT CẢ các trang gom lại thành 1 mảng như Danh Mục)
  const taiDanhSach = useCallback(async () => {
    setDangTai(true);
    try {
      const layTrang = dangXemThungRac ? dichVuSanPham.layThungRac : dichVuSanPham.layDanhSach;
      
      // Gọi trang đầu tiên
      const resTrangDau = await layTrang({ per_page: 100, page: 1 });
      
      let danhSachDayDu = [];
      const duLieuTrangDau = resTrangDau.data?.data || resTrangDau.data || [];
      if (Array.isArray(duLieuTrangDau)) {
        danhSachDayDu = [...duLieuTrangDau];
      }

      // Xác định tổng số trang từ API
      let tongSoTrangAPI = 1;
      if (resTrangDau.data?.meta?.last_page) {
        tongSoTrangAPI = Number(resTrangDau.data.meta.last_page);
      } else if (resTrangDau.data?.last_page) {
        tongSoTrangAPI = Number(resTrangDau.data.last_page);
      }

      // Vòng lặp tải các trang còn lại (nếu có)
      for (let page = 2; page <= tongSoTrangAPI; page += 1) {
        const resTrang = await layTrang({ per_page: 100, page });
        const duLieuTrang = resTrang.data?.data || resTrang.data || [];
        if (Array.isArray(duLieuTrang)) {
          danhSachDayDu.push(...duLieuTrang);
        }
      }
      
      setDanhSachSanPham(danhSachDayDu);
    } catch (err) {
      console.error(err);
      hienThongBao(dangXemThungRac ? 'Lỗi tải thùng rác!' : 'Lỗi tải sản phẩm!', 'error');
    } finally {
      setDangTai(false);
    }
  }, [dangXemThungRac, hienThongBao]);

  useEffect(() => { taiDanhSach(); }, [taiDanhSach]);

  useEffect(() => {
    dichVuSanPham.layDanhMuc().then(res => setDanhSachDanhMuc(res.data?.data || [])).catch(() => {});
    dichVuSanPham.layThuongHieu().then(res => setDanhSachThuongHieu(res.data?.data || [])).catch(() => {});
  }, []);

  const soMucMoiTrang = 8;
  const tongSoTrang = Math.max(1, Math.ceil(danhSachSanPham.length / soMucMoiTrang));
  const trangDangXem = Math.min(trangHienTai, tongSoTrang);
  
  const danhSachHienThi = useMemo(() => {
    const viTriBatDau = (trangDangXem - 1) * soMucMoiTrang;
    return danhSachSanPham.slice(viTriBatDau, viTriBatDau + soMucMoiTrang);
  }, [danhSachSanPham, trangDangXem]);

  return {
    danhSachSanPham, setDanhSachSanPham,
    danhSachDanhMuc, danhSachThuongHieu,
    dangTai, setDangTai,
    dangXemThungRac, setDangXemThungRac,
    trangHienTai, setTrangHienTai,
    soItemMoiTrang: soMucMoiTrang,
    tongSoTrang,
    tongSoItem: danhSachSanPham.length, 
    danhSachHienThi, 
    taiDanhSach
  };
}