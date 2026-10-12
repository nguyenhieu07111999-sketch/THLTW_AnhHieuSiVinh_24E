import { useState } from 'react';
import dichVuDonHang from '@/services/dich-vu-don-hang';

export default function useModalDonHang(hienThongBao) {
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [donHangChiTiet, setDonHangChiTiet] = useState(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const xemChiTiet = async (id) => {
    try {
      setDangTaiChiTiet(true);
      setMoModalChiTiet(true);
      const res = await dichVuDonHang.layChiTiet(id);
      setDonHangChiTiet(res.data?.data);
    } catch (error) {
      hienThongBao('Không thể tải chi tiết đơn hàng!', 'error');
      setMoModalChiTiet(false);
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongModalChiTiet = () => {
    setMoModalChiTiet(false);
    setDonHangChiTiet(null);
  };

  return {
    moModalChiTiet,
    donHangChiTiet,
    dangTaiChiTiet,
    xemChiTiet,
    dongModalChiTiet,
  };
}