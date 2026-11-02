
import api from './api';

export const dichVuDanhMuc = {
  layDanhSach: (params) => api.get('/danh-muc', { params }),
  
  layThungRac: (params) => api.get('/danh-muc/thung-rac', { params }),

  layChiTiet: (id) => api.get(`/danh-muc/${id}`),

  themMoi: (data) => api.post('/danh-muc', data),

  capNhat: (id, data) => api.put(`/danh-muc/${id}`, data),

  xoa: (id) => api.delete(`/danh-muc/${id}`),
  
  khoiPhuc: (id) => api.post(`/danh-muc/${id}/khoi-phuc`),
  
  xoaVinhVien: (id) => api.delete(`/danh-muc/${id}/xoa-vinh-vien`),
};


