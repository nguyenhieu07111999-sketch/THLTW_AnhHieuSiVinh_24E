import { dichVuSanPham } from '@/services/dich-vu-san-pham';

export default function useSanPhamActions(taiDanhSach, setDangTai, hienThongBao, setDanhSachSanPham) {
  const xuLyDoiTrangThai = async (sp) => {
    const trangThaiMoi = sp.trang_thai === 'hien_thi' ? 'an' : 'hien_thi';
    try {
      setDanhSachSanPham((prev) => 
        prev.map((item) => (item.id === sp.id ? { ...item, trang_thai: trangThaiMoi } : item))
      );
      
      await dichVuSanPham.capNhat(sp.id, { 
        trang_thai: trangThaiMoi 
      });
    } catch (err) {
      hienThongBao('Không thể thay đổi trạng thái!', 'error');
      setDanhSachSanPham((prev) => 
        prev.map((item) => (item.id === sp.id ? { ...item, trang_thai: sp.trang_thai } : item))
      );
    }
  };

  const xuLyXoaTam = async (id) => {
    if (!window.confirm('Chuyển sản phẩm này vào thùng rác?')) return;
    try {
      setDangTai(true);
      await dichVuSanPham.xoaTam(id);
      hienThongBao('Đã chuyển vào thùng rác!', 'success');
      await taiDanhSach();
    } catch (err) {
      hienThongBao('Lỗi chuyển thùng rác!', 'error');
      setDangTai(false);
    }
  };

  const xuLyKhoiPhuc = async (id) => {
    try {
      setDangTai(true);
      await dichVuSanPham.khoiPhuc(id);
      hienThongBao('Khôi phục thành công!', 'success');
      await taiDanhSach();
    } catch (err) {
      hienThongBao('Lỗi khôi phục!', 'error');
      setDangTai(false);
    }
  };

  const xuLyXoaVinhVien = async (id) => {
    if (!window.confirm('CẢNH BÁO: Sản phẩm sẽ bị XÓA VĨNH VIỄN!')) return;
    try {
      setDangTai(true);
      await dichVuSanPham.xoaVinhVien(id);
      hienThongBao('Đã xóa vĩnh viễn!', 'success');
      await taiDanhSach();
    } catch (err) {
      hienThongBao('Lỗi xóa vĩnh viễn!', 'error');
      setDangTai(false);
    }
  };

  return { xuLyDoiTrangThai, xuLyXoaTam, xuLyKhoiPhuc, xuLyXoaVinhVien };
}