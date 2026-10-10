import { useState, useEffect, useCallback, useMemo } from 'react';
import { dichVuDanhMuc } from '@/services/dich-vu-danh-muc';

export default function useDanhMucData(hienThongBao) {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangXemThungRac, setDangXemThungRac] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [boLocDanhMuc, setBoLocDanhMuc] = useState(null);

  // 1. Hàm tải dữ liệu
  const taiDanhSach = useCallback(async () => {
    try {
      const layTrang = dangXemThungRac ? dichVuDanhMuc.layThungRac : dichVuDanhMuc.layDanhSach;
      const resTrangDau = await layTrang({ per_page: 200, page: 1 });
      const danhSachDayDu = Array.isArray(resTrangDau.data?.data) ? [...resTrangDau.data.data] : (Array.isArray(resTrangDau.data) ? [...resTrangDau.data] : []);

      const tongSoTrangDanhMuc = Number(resTrangDau.data?.meta?.last_page) || 1;
      for (let page = 2; page <= tongSoTrangDanhMuc; page += 1) {
        const resTrang = await layTrang({ per_page: 200, page });
        const duLieuTrang = resTrang.data?.data ?? resTrang.data;
        if (Array.isArray(duLieuTrang)) danhSachDayDu.push(...duLieuTrang);
      }
      setDanhSach(danhSachDayDu);
    } catch (err) {
      hienThongBao(dangXemThungRac ? 'Lỗi tải thùng rác!' : 'Lỗi tải danh mục!', 'error');
    } finally {
      setDangTai(false);
    }
  }, [dangXemThungRac, hienThongBao]);

  useEffect(() => { taiDanhSach(); }, [taiDanhSach]);

  // 2. Xử lý danh sách cha và lọc hiển thị
  const danhSachCha = useMemo(() => danhSach.filter((dm) => !dm.parent_id), [danhSach]);

  const danhSachDangHienThi = useMemo(() => {
    if (dangXemThungRac) return danhSach;
    const danhSachGoc = danhSach.filter((dm) => !dm.parent_id);
    return danhSachGoc.flatMap((dm) => {
      const danhSachCon = dm.children || [];
      if (boLocDanhMuc === 'cha') return [{ danhMuc: { ...dm, so_danh_muc_con: danhSachCon.length }, laDanhMucCon: false }];
      if (boLocDanhMuc === 'con' && danhSachCon.length === 0) return [];
      
      const hienDanhMucCha = boLocDanhMuc !== 'noibat' || Boolean(dm.sp_noi_bat);
      const cacDanhMucConHienThi = danhSachCon.filter((con) => boLocDanhMuc !== 'noibat' || Boolean(con.sp_noi_bat));

      return [
        ...(hienDanhMucCha ? [{ danhMuc: { ...dm, so_danh_muc_con: danhSachCon.length }, laDanhMucCon: false }] : []),
        ...cacDanhMucConHienThi.map((con) => ({ danhMuc: con, laDanhMucCon: true, tenDanhMucCha: dm.ten_danh_muc })),
      ];
    });
  }, [danhSach, dangXemThungRac, boLocDanhMuc]);

  // 3. Logic phân trang
  const soMucMoiTrang = 8;
  const tongSoTrang = Math.max(1, Math.ceil(danhSachDangHienThi.length / soMucMoiTrang));
  const trangDangXem = Math.min(trangHienTai, tongSoTrang);
  
  const danhSachTrangHienTai = useMemo(() => {
    const viTriBatDau = (trangDangXem - 1) * soMucMoiTrang;
    return danhSachDangHienThi.slice(viTriBatDau, viTriBatDau + soMucMoiTrang);
  }, [danhSachDangHienThi, trangDangXem]);

  // 4. Thống kê
  const tongCap1 = dangXemThungRac ? 0 : danhSachCha.length;
  const tongCap2 = dangXemThungRac ? 0 : danhSachCha.reduce((tong, dm) => tong + (dm.children?.length || 0), 0);
  const tongNoiBat = dangXemThungRac ? 0 : danhSachCha.reduce(
    (tong, dm) => tong + Number(dm.sp_noi_bat) + (dm.children || []).filter((con) => con.sp_noi_bat).length, 0
  );

  return {
    dangTai, setDangTai,
    dangXemThungRac, setDangXemThungRac,
    trangHienTai, setTrangHienTai,
    boLocDanhMuc, setBoLocDanhMuc,
    taiDanhSach,
    danhSachCha,
    danhSachDangHienThi,
    danhSachTrangHienTai,
    tongSoTrang,
    soMucMoiTrang,
    tongCap1, tongCap2, tongNoiBat
  };
}