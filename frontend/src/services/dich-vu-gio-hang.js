import api from './api';

export const layGioHang = () => api.get('/gio-hang').then((response) => response.data.data ?? response.data);

export const themVaoGio = (sanPhamId, soLuong = 1) =>
  api.post('/gio-hang', { san_pham_id: sanPhamId, so_luong: soLuong });

export const taoDonHang = (payload) => api.post('/don-hang', payload).then((response) => response.data);