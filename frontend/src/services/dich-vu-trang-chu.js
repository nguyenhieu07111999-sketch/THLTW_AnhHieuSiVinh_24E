import api from './api';

export const dichVuTrangChu = {
  layDuLieuTrangChu: async () => {
    try {
      const [resKhuyenMai, resNoiBat, resBanChay, resTinTuc] = await Promise.all([
        api.get('/san-pham', { params: { co_gia_giam: 1 } }),
        api.get('/san-pham', { params: { noi_bat: 1 } }),
        api.get('/san-pham', { params: { sap_xep: 'ban_chay' } }),
        api.get('/bai-viet', { params: { limit: 3 } }),
      ]);

      return {
        khuyenMai: resKhuyenMai.data.data || resKhuyenMai.data,
        noiBat: resNoiBat.data.data || resNoiBat.data,
        banChay: resBanChay.data.data || resBanChay.data,
        tinTuc: resTinTuc.data.data || resTinTuc.data,
      };
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      return { khuyenMai: [], noiBat: [], banChay: [], tinTuc: [] };
    }
  },
};