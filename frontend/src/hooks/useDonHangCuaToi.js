'use client';

import { useState, useEffect, useCallback } from 'react';
import { useXacThuc } from '@/context/xac-thuc-context';
import dichVuTaiKhoan from '@/services/dich-vu-tai-khoan';

export default function useDonHangCuaToi({ gioiHan, trang = 1, trangThai } = {}) {
  const { user, daSanSang, dangXuat } = useXacThuc();
  const [donHang, setDonHang] = useState([]);
  const [meta, setMeta] = useState(null);
  
  // Khởi tạo trạng thái đang tải dựa vào điều kiện sẵn sàng để tránh gọi setState đồng bộ
  const [dangTai, setDangTai] = useState(() => daSanSang && !!user);
  const [loi, setLoi] = useState(null);
  const [lanTai, setLanTai] = useState(0);

  const taiLai = useCallback(() => setLanTai((n) => n + 1), []);

  useEffect(() => {
    if (!daSanSang) return;
    
    if (!user) {
      setDangTai(false);
      setDonHang([]);
      return;
    }

    const controller = new AbortController();
    (async () => {
      setDangTai(true);
      setLoi(null);
      try {
        const res = await dichVuTaiKhoan.layDonHang(
          { per_page: gioiHan, page: trang > 1 ? trang : undefined, trang_thai: trangThai },
          controller.signal
        );
        setDonHang(res.data ?? []);
        setMeta(res.meta ?? null);
      } catch (e) {
        if (controller.signal.aborted) return;
        if (e?.response?.status === 401) return dangXuat();
        setLoi('Không tải được danh sách đơn hàng. Vui lòng thử lại.');
      } finally {
        if (!controller.signal.aborted) setDangTai(false);
      }
    })();

    return () => controller.abort();
  }, [daSanSang, user, gioiHan, trang, trangThai, lanTai, dangXuat]);

  return { donHang, meta, dangTai, loi, taiLai };
}