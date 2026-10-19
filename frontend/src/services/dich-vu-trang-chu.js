import api from './api';

export const dichVuTrangChu = {
  layDuLieuTrangChu: async () => {
    try {
      const [resKhuyenMai, resNoiBat, resBanChay, resTinTuc] = await Promise.allSettled([
        api.get('/san-pham', { params: { co_gia_giam: 1 } }),
        api.get('/san-pham', { params: { noi_bat: 1 } }),
        api.get('/san-pham', { params: { sap_xep: 'ban_chay' } }),
        api.get('/bai-viet', { params: { limit: 3 } }),
      ]);

      const layDuLieu = (ketQua) => {
        if (ketQua.status === 'fulfilled' && ketQua.value?.data) {
          return ketQua.value.data.data || ketQua.value.data;
        }
        return [];
      };

      return {
        khuyenMai: layDuLieu(resKhuyenMai),
        noiBat: layDuLieu(resNoiBat),
        banChay: layDuLieu(resBanChay),
        tinTuc: layDuLieu(resTinTuc),
      };
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      return { khuyenMai: [], noiBat: [], banChay: [], tinTuc: [] };
    }
  },
};