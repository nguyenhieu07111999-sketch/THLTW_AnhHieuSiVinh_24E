import { dichVuThuongHieu } from '@/services/dich-vu-thuong-hieu';

export default function useThuongHieuActions(taiDanhSach, setDangTai, hienThongBao) {
  const xuLyXoaTam = async (item) => {
    if (!confirm(`Bạn có chắc chắn muốn chuyển thương hiệu "${item.ten_thuong_hieu}" vào thùng rác?`)) return;

    setDangTai(true);
    try {
      await dichVuThuongHieu.xoaTam(item.id);
      hienThongBao(`Đã chuyển "${item.ten_thuong_hieu}" vào thùng rác!`);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi chuyển vào thùng rác:', err);
      hienThongBao(err.response?.data?.message || 'Không thể chuyển thương hiệu vào thùng rác.', 'error');
      setDangTai(false);
    }
  };

  const xuLyKhoiPhuc = async (id, danhSach) => {
    const item = danhSach.find((i) => Number(i.id) === Number(id));
    setDangTai(true);
    try {
      await dichVuThuongHieu.khoiPhuc(id);
      hienThongBao(`Đã khôi phục "${item?.ten_thuong_hieu || 'thương hiệu'}"!`);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi khôi phục:', err);
      hienThongBao(err.response?.data?.message || 'Không thể khôi phục thương hiệu.', 'error');
      setDangTai(false);
    }
  };

  const xuLyXoaVinhVien = async (item) => {
    if (!confirm(`CẢNH BÁO: Xóa vĩnh viễn "${item.ten_thuong_hieu}" khỏi hệ thống?`)) return;

    setDangTai(true);
    try {
      await dichVuThuongHieu.xoaVinhVien(item.id);
      hienThongBao(`Đã xóa vĩnh viễn "${item.ten_thuong_hieu}"!`);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi xóa vĩnh viễn:', err);
      hienThongBao(err.response?.data?.message || 'Không thể xóa vĩnh viễn thương hiệu.', 'error');
      setDangTai(false);
    }
  };

  return {
    xuLyXoaTam,
    xuLyKhoiPhuc,
    xuLyXoaVinhVien,
  };
}