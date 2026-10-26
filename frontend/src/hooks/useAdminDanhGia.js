import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

export function useAdminDanhGia() {
  const [tabHienTai, setTabHienTai] = useState('san-pham'); 
  const [dsSanPham, setDsSanPham] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [tuKhoa, setTuKhoa] = useState('');
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongTrang, setTongTrang] = useState(1);

  const [spDangXem, setSpDangXem] = useState(null);
  const [dsReviewSp, setDsReviewSp] = useState([]);
  const [locTrangThai, setLocTrangThai] = useState('tat_ca');
  const [locSoSao, setLocSoSao] = useState('');
  const [dangTaiModal, setDangTaiModal] = useState(false);

  const [mediaPhongTo, setMediaPhongTo] = useState(null);

  const [rules, setRules] = useState({
    tu_cam: '',
    tu_dong_an_duoi_sao: 0,
    cho_phep_video: true,
    max_files: 5,
  });
  const [dangLuuRules, setDangLuuRules] = useState(false);

  const taiDsSanPham = useCallback(async () => {
    setDangTai(true);
    try {
      const res = await api.get('/admin/danh-gia/san-pham', {
        params: {
          page: trangHienTai,
          tu_khoa: tuKhoa || undefined,
        },
      });
      const items = res.data?.data || res.data || [];
      setDsSanPham(items);
      setTongTrang(res.data?.meta?.last_page || res.data?.last_page || 1);
    } catch (err) {
      console.error('Lỗi tải danh sách sản phẩm đánh giá:', err);
    } finally {
      setDangTai(false);
    }
  }, [trangHienTai, tuKhoa]);

  const taiRules = async () => {
    try {
      const res = await api.get('/admin/danh-gia/rules');
      if (res.data?.data) {
        setRules(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi tải rules kiểm duyệt:', err);
    }
  };

  useEffect(() => {
    if (tabHienTai === 'san-pham') {
      taiDsSanPham();
    } else {
      taiRules();
    }
  }, [tabHienTai, taiDsSanPham]);

  const moChiTietReview = async (sanPhamId, trangThai = locTrangThai, soSao = locSoSao) => {
    setDangTaiModal(true);
    try {
      const res = await api.get(`/admin/danh-gia/san-pham/${sanPhamId}`, {
        params: {
          trang_thai: trangThai !== 'tat_ca' ? trangThai : undefined,
          so_sao: soSao || undefined,
        },
      });
      setSpDangXem(res.data?.san_pham);
      const list = res.data?.reviews?.data || res.data?.data || [];
      setDsReviewSp(list);
    } catch (err) {
      alert('Không thể tải chi tiết review của sản phẩm!');
    } finally {
      setDangTaiModal(false);
    }
  };

  const handleDoiTrangThai = async (reviewId) => {
    try {
      await api.patch(`/admin/danh-gia/${reviewId}/trang-thai`);
      setDsReviewSp((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, trang_thai: r.trang_thai === 'hien_thi' ? 'an' : 'hien_thi' }
            : r
        )
      );
    } catch (err) {
      alert('Lỗi cập nhật trạng thái review!');
    }
  };

  const handleXoaReview = async (reviewId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn review này?')) return;
    try {
      await api.delete(`/admin/danh-gia/${reviewId}`);
      setDsReviewSp((prev) => prev.filter((r) => r.id !== reviewId));
      taiDsSanPham();
    } catch (err) {
      alert('Xóa review thất bại!');
    }
  };

  const handleLuuRules = async (e) => {
    e.preventDefault();
    setDangLuuRules(true);
    try {
      await api.post('/admin/danh-gia/rules', rules);
      alert('Đã cập nhật quy tắc kiểm duyệt thành công!');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu quy tắc!');
    } finally {
      setDangLuuRules(false);
    }
  };

  return {
    tabHienTai,
    setTabHienTai,
    dsSanPham,
    dangTai,
    tuKhoa,
    setTuKhoa,
    trangHienTai,
    setTrangHienTai,
    tongTrang,
    spDangXem,
    setSpDangXem,
    dsReviewSp,
    locTrangThai,
    setLocTrangThai,
    locSoSao,
    setLocSoSao,
    dangTaiModal,
    mediaPhongTo,
    setMediaPhongTo,
    rules,
    setRules,
    dangLuuRules,
    moChiTietReview,
    handleDoiTrangThai,
    handleXoaReview,
    handleLuuRules,
  };
}