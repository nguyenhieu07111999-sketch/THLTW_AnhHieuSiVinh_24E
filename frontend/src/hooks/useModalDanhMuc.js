import { useState } from 'react';
import { dichVuDanhMuc } from '@/services/dich-vu-danh-muc';
import { GIA_TRI_MAC_DINH } from '@/components/danh-muc/form-danh-muc-modal';

export default function useModalDanhMuc(taiDanhSach, hienThongBao, setDangTai) {
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

  const moModalSua = (dm) => {
    setIdDangSua(dm.id);
    setDuLieuForm({
      parent_id: dm.parent_id ?? '',
      ten_danh_muc: dm.ten_danh_muc ?? '',
      duong_dan_dm: dm.duong_dan_dm ?? '',
      hinh_anh: dm.hinh_anh ?? '',
      mo_ta: dm.mo_ta ?? '',
      sp_noi_bat: dm.sp_noi_bat ?? false,
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
    
    const payload = {
      ...duLieuForm,
      parent_id: duLieuForm.parent_id === '' ? null : Number(duLieuForm.parent_id),
      duong_dan_dm: duLieuForm.duong_dan_dm || undefined,
    };

    try {
      if (idDangSua) {
        await dichVuDanhMuc.capNhat(idDangSua, payload);
        hienThongBao('Cập nhật danh mục thành công!', 'success');
      } else {
        await dichVuDanhMuc.themMoi(payload);
        hienThongBao('Thêm danh mục thành công!', 'success');
      }
      setMoModal(false);
      setDangTai(true);
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors ?? {});
        hienThongBao('Vui lòng kiểm tra lại thông tin!', 'error');
      } else if (err.response?.status === 409) {
        hienThongBao(err.response.data.message || 'Không thể thực hiện thao tác!', 'error');
      } else {
        hienThongBao('Có lỗi xảy ra, vui lòng thử lại!', 'error');
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
    dongModal,
    xuLyGuiForm,
  };
}