
import api from './api';

export const dichVuSanPham = {
  layDanhSach: (params) => api.get('/san-pham', { params }),
  layThungRac: (page = 1) => api.get(`/san-pham/thung-rac?page=${page}`),
  themMoi: (data) => api.post('/san-pham', data),
  capNhat: (id, data) => api.put(`/san-pham/${id}`, data),
  xoaTam: (id) => api.delete(`/san-pham/${id}`),
  khoiPhuc: (id) => api.post(`/san-pham/${id}/khoi-phuc`),
  xoaVinhVien: (id) => api.delete(`/san-pham/${id}/xoa-vinh-vien`),
  layDanhMuc: () => api.get('/danh-muc'),
  layThuongHieu: () => api.get('/thuong-hieu'),
};