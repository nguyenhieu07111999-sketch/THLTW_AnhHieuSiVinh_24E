import api from './api';

export const dichVuThuongHieu = {
  layDanhSach: (params) => api.get('/thuong-hieu', { params }),
  
  layThungRac: (params) => api.get('/thuong-hieu/thung-rac', { params }),

  layChiTiet: (id) => api.get(`/thuong-hieu/${id}`),

  themMoi: (data) => api.post('/thuong-hieu', data),

  capNhat: (id, data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post(`/thuong-hieu/${id}`, data);
    }
    return api.put(`/thuong-hieu/${id}`, data);
  },

  xoaTam: (id) => api.delete(`/thuong-hieu/${id}`),
  
  khoiPhuc: (id) => api.post(`/thuong-hieu/${id}/khoi-phuc`),
  
  xoaVinhVien: (id) => api.delete(`/thuong-hieu/${id}/xoa-vinh-vien`),
};