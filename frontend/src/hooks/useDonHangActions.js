import { useState } from 'react';
import dichVuDonHang from '@/services/dich-vu-don-hang';

export default function useDonHangActions(taiDanhSach, hienThongBao) {
  const [dangXuLy, setDangXuLy] = useState(false);

  const capNhatTrangThaiDonHang = async (id, duLieuMoi) => {
    try {
      setDangXuLy(true);
      const res = await dichVuDonHang.capNhat(id, duLieuMoi);
      hienThongBao(res.message || 'Cập nhật trạng thái thành công!');
      taiDanhSach();
      return true;
    } catch (error) {
      hienThongBao(error.response?.data?.message || 'Cập nhật thất bại!', 'error');
      return false;
    } finally {
      setDangXuLy(false);
    }
  };

  return {
    capNhatTrangThaiDonHang,
    dangXuLy,
  };
}