import { useState } from 'react';
import { dichVuSanPham } from '@/services/dich-vu-san-pham';

export const GIA_TRI_MAC_DINH = {
  danh_muc_id: '',
  thuong_hieu_id: '',
  ten_san_pham: '',
  duong_dan_sp: '',
  hinh_anh: '',
  hinh_anh_preview: '',
  hinh_anh_file: null,
  gia_ban: '',
  gia_giam: '',
  so_luong_ton_kho: 0,
  don_vi_tinh: 'Kg',
  mo_ta_ngan: '',
  chi_tiet: '',
  trang_thai: 'hien_thi',
};

export default function useModalSanPham(taiDanhSach, hienThongBao, setDangTai) {
  const [moModal, setMoModal] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [duLieuForm, setDuLieuForm] = useState(GIA_TRI_MAC_DINH);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangLuu, setDangLuu] = useState(false);

  const moModalThem = () => {
    setIdDangSua(null);
    setDuLieuForm(GIA_TRI_MAC_DINH);
    setDanhSachLoi({});
    setMoModal(true);
  };

  const moModalSua = (sp) => {
    setIdDangSua(sp.id);
    setDuLieuForm({
      ...sp,
      danh_muc_id: sp.danh_muc_id ?? '',
      thuong_hieu_id: sp.thuong_hieu_id ?? '',
      hinh_anh: sp.hinh_anh ?? '',
      hinh_anh_preview: '',
      hinh_anh_file: null,
    });
    setDanhSachLoi({});
    setMoModal(true);
  };

  // Sao chép: mở form THÊM MỚI với dữ liệu lấy từ sản phẩm đã chọn
  const xuLySaoChep = (sp) => {
    const banSao = {};
    Object.keys(GIA_TRI_MAC_DINH).forEach((key) => {
      banSao[key] = sp[key] ?? GIA_TRI_MAC_DINH[key];
    });

    setIdDangSua(null); // null để khi lưu sẽ gọi themMoi, không phải capNhat
    setDuLieuForm({
      ...banSao,
      ten_san_pham: `${sp.ten_san_pham} (bản sao)`,
      duong_dan_sp: '', // để trống vì đường dẫn phải khác sản phẩm gốc
      hinh_anh_preview: '',
      hinh_anh_file: null,
    });
    setDanhSachLoi({});
    setMoModal(true);
  };

  const dongModal = () => {
    if (!dangLuu) setMoModal(false);
  };

  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});
    setDangLuu(true);

    const formData = new FormData();

    // 1. Đưa toàn bộ các trường text vào formData (LOẠI BỎ TRIỆT ĐỂ mọi biến liên quan đến hinh_anh)
    Object.keys(duLieuForm).forEach((key) => {
      if (['hinh_anh', 'hinh_anh_preview', 'hinh_anh_file'].includes(key)) return;

      if (duLieuForm[key] !== null && duLieuForm[key] !== undefined && duLieuForm[key] !== '') {
        formData.append(key, duLieuForm[key]);
      }
    });

    // 2. ⚡ ĐÍNH KÈM DUY NHẤT 1 FILE ẢNH VẬT LÝ VÀO ĐÚNG TÊN 'hinh_anh'
    if (duLieuForm.hinh_anh_file) {
      formData.append('hinh_anh', duLieuForm.hinh_anh_file);
      console.log('✅ Đã đính kèm file ảnh chính thức:', duLieuForm.hinh_anh_file.name);
    } else {
      console.warn('⚠️ Không có file ảnh mới được chọn!');
    }

    try {
      if (idDangSua) {
        await dichVuSanPham.capNhat(idDangSua, formData);
        hienThongBao('Cập nhật sản phẩm thành công!', 'success');
      } else {
        await dichVuSanPham.themMoi(formData);
        hienThongBao('Thêm sản phẩm thành công!', 'success');
      }

      setMoModal(false);
      if (setDangTai) setDangTai(true);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi gửi form:', err.response?.data);
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors ?? {});
        hienThongBao('Vui lòng kiểm tra lại thông tin!', 'error');
      } else {
        hienThongBao(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!', 'error');
      }
    } finally {
      setDangLuu(false);
    }
  };

  return {
    moModal,
    idDangSua,
    duLieuForm,
    setDuLieuForm,
    danhSachLoi,
    dangLuu,
    moModalThem,
    moModalSua,
    xuLySaoChep,
    dongModal,
    xuLyGuiForm,
  };
}