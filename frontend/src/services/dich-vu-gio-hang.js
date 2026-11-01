import api from './api';

export const layGioHang = () => api.get('/gio-hang').then((response) => response.data.data ?? response.data);

export const themVaoGio = (sanPhamId, soLuong = 1) =>
  api.post('/gio-hang', { san_pham_id: sanPhamId, so_luong: soLuong });

export const capNhatSoLuongGio = (chiTietId, soLuong) =>
  api.put(`/gio-hang/${chiTietId}`, { so_luong: soLuong })
    .then((response) => response.data.data ?? response.data);

export const xoaSanPhamKhoiGio = (chiTietId) =>
  api.delete(`/gio-hang/${chiTietId}`)
    .then((response) => response.data.data ?? response.data);

export const taoDonHang = (payload) => api.post('/don-hang', payload).then((response) => response.data);