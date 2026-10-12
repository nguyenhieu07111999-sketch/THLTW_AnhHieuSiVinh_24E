import { useState } from 'react';
import { dichVuThuongHieu } from '@/services/dich-vu-thuong-hieu';

export const GIA_TRI_MAC_DINH_THUONG_HIEU = {
  ten_thuong_hieu: '',
  duong_dan_th: '',
  logo: '',
  logo_xem_truoc: '',
  mo_ta: '',
  trang_thai: 'hien_thi',
};

export default function useModalThuongHieu(taiDanhSach, hienThongBao) {
  const [moModal, setMoModal] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [duLieuForm, setDuLieuForm] = useState(GIA_TRI_MAC_DINH_THUONG_HIEU);
  const [logoFile, setLogoFile] = useState(null);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangLuu, setDangLuu] = useState(false);

  const moModalThem = () => {
    setIdDangSua(null);
    setDuLieuForm(GIA_TRI_MAC_DINH_THUONG_HIEU);
    setLogoFile(null);
    setDanhSachLoi({});
    setMoModal(true);
  };

  const moModalSua = (item) => {
    setIdDangSua(item.id);
    setDuLieuForm({
      ...GIA_TRI_MAC_DINH_THUONG_HIEU,
      ...item,
      logo_xem_truoc: item.logo || '',
    });
    setLogoFile(null);
    setDanhSachLoi({});
    setMoModal(true);
  };

  const dongModal = () => {
    if (dangLuu) return;
    setMoModal(false);
    setLogoFile(null);
    setDanhSachLoi({});
  };

  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});

    const formData = new FormData();
    Object.entries(duLieuForm).forEach(([key, value]) => {
      if (!['logo', 'logo_xem_truoc', 'id', 'deleted_at'].includes(key) && value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (logoFile) {
      formData.append('logo', logoFile);
    }

    setDangLuu(true);
    try {
      if (idDangSua) {
        await dichVuThuongHieu.capNhat(idDangSua, formData);
        hienThongBao('Cập nhật thương hiệu thành công!');
      } else {
        await dichVuThuongHieu.themMoi(formData);
        hienThongBao('Thêm thương hiệu thành công!');
      }

      setMoModal(false);
      setLogoFile(null);
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors || {});
      } else {
        console.error('Lỗi khi lưu thương hiệu:', err);
        hienThongBao(err.response?.data?.message || 'Có lỗi xảy ra khi lưu thương hiệu.', 'error');
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
    logoFile,
    setLogoFile,
    danhSachLoi,
    dangLuu,
    moModalThem,
    moModalSua,
    dongModal,
    xuLyGuiForm,
  };
}