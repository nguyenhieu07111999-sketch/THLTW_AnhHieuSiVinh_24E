import api from './api';

export const dichVuSanPham = {
  layDanhSach: (params) => api.get('/san-pham', { params }),
  layChiTiet: (id) => api.get(`/san-pham/${id}`),
  
  layChiTiet: (id) => api.get(`/san-pham/${id}`),
  
  layThungRac: (page = 1) => api.get('/san-pham/thung-rac', { params: { page } }),
  
  themMoi: (data) => api.post('/san-pham', data),
  
  // Cập nhật sản phẩm
  capNhat: (id, data) => {
    
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post(`/san-pham/${id}`, data);
    }
    return api.put(`/san-pham/${id}`, data);
  },
  
  xoaTam: (id) => api.delete(`/san-pham/${id}`),
  
  khoiPhuc: (id) => api.post(`/san-pham/${id}/khoi-phuc`),
  
  xoaVinhVien: (id) => api.delete(`/san-pham/${id}/xoa-vinh-vien`),
  
  layDanhMuc: () => api.get('/danh-muc'),
  layThuongHieu: () => api.get('/thuong-hieu'),
};
