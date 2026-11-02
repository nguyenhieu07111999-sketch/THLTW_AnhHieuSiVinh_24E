'use client';

import { useState, useEffect, useCallback } from 'react';
import { dichVuMenu } from '@/services/dichVuMenu';

const FORM_MAC_DINH = {
  id: null,
  vi_tri: 'header',
  ten: '',
  parent_id: '',
  loai_lien_ket: 'tuy_chinh',
  lien_ket_id: '',
  duong_dan_tuy_chinh: '',
  thu_tu: 0,
  target: '_self',
  icon: '',
  trang_thai: true,
};

export function useAdminMenu() {
  const [danhSachMenu, setDanhSachMenu] = useState([]);
  const [nguonLienKet, setNguonLienKet] = useState({ danh_muc: [], chu_de: [], bai_viet: [] });
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [locViTri, setLocViTri] = useState('all'); 

  const [moModal, setMoModal] = useState(false);
  const [formData, setFormData] = useState(FORM_MAC_DINH);
  const [thongBaoLoi, setThongBaoLoi] = useState(null);

  const taiDuLieu = useCallback(async () => {
    setDangTai(true);
    try {
      const [resMenus, resNguon] = await Promise.all([
        dichVuMenu.layDanhSach(),
        dichVuMenu.layNguonLienKet(),
      ]);
      // setDanhSachMenu(resMenus.data.data || []);
      // setNguonLienKet(resNguon.data || { danh_muc: [], chu_de: [], bai_viet: [] });
      setDanhSachMenu(resMenus.data.data || resMenus.data || []);
      setNguonLienKet(resNguon.data?.data || resNguon.data || { danh_muc: [], chu_de: [], bai_viet: [] });
    } catch (err) {
      console.error('Lỗi nạp dữ liệu menu:', err);
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    taiDuLieu();
  }, [taiDuLieu]);

  const handleMoThemMoi = (parentId = null, viTriMacDinh = 'header') => {
    setFormData({
      ...FORM_MAC_DINH,
      parent_id: parentId || '',
      vi_tri: locViTri !== 'all' ? locViTri : viTriMacDinh,
    });
    setThongBaoLoi(null);
    setMoModal(true);
  };

  const handleMoChinhSua = (item) => {
    setFormData({
      id: item.id,
      vi_tri: item.vi_tri,
      ten: item.ten,
      parent_id: item.parent_id || '',
      loai_lien_ket: item.loai_lien_ket,
      lien_ket_id: item.lien_ket_id || '',
      duong_dan_tuy_chinh: item.duong_dan_tuy_chinh || '',
      thu_tu: item.thu_tu || 0,
      target: item.target || '_self',
      icon: item.icon || '',
      trang_thai: Boolean(item.trang_thai),
    });
    setThongBaoLoi(null);
    setMoModal(true);
  };

  const handleLuu = async (e) => {
    e.preventDefault();
    setDangLuu(true);
    setThongBaoLoi(null);

    const payload = {
      ...formData,
      parent_id: formData.parent_id ? Number(formData.parent_id) : null,
      lien_ket_id: formData.lien_ket_id ? Number(formData.lien_ket_id) : null,
      thu_tu: Number(formData.thu_tu) || 0,
    };

    try {
      if (formData.id) {
        await dichVuMenu.capNhat(formData.id, payload);
      } else {
        await dichVuMenu.themMenu(payload);
      }
      setMoModal(false);
      await taiDuLieu();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setThongBaoLoi(errors ? Object.values(errors)[0][0] : err.response?.data?.message || 'Có lỗi xảy ra!');
    } finally {
      setDangLuu(false);
    }
  };

  const handleXoa = async (id, ten) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa mục menu "${ten}"? Nếu có menu con, các mục con cũng sẽ bị xóa!`)) {
      return;
    }
    try {
      await dichVuMenu.xoa(id);
      await taiDuLieu();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa mục menu này.');
    }
  };

  const danhSachLoc = locViTri === 'all'
    ? danhSachMenu
    : danhSachMenu.filter((m) => m.vi_tri === locViTri);

  return {
    danhSachMenu: danhSachLoc,
    toanBoMenuCha: danhSachMenu,
    nguonLienKet,
    dangTai,
    dangLuu,
    locViTri,
    setLocViTri,
    moModal,
    setMoModal,
    formData,
    setFormData,
    thongBaoLoi,
    handleMoThemMoi,
    handleMoChinhSua,
    handleLuu,
    handleXoa,
  };
}