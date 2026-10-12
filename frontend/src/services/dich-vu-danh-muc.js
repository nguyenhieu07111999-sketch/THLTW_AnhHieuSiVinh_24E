import api from './api';

export const dichVuDanhMuc = {
  // GET /api/danh-muc?per_page=200  -> trả về danh mục cha kèm children
  layDanhSach: (params) => api.get('/danh-muc', { params }),
  
  layThungRac: (params) => api.get('/danh-muc/thung-rac', { params }),

  // GET /api/danh-muc/:id
  layChiTiet: (id) => api.get(`/danh-muc/${id}`),

  // POST /api/danh-muc  (yêu cầu admin token)
  themMoi: (data) => api.post('/danh-muc', data),

  // PUT /api/danh-muc/:id  (yêu cầu admin token)
  capNhat: (id, data) => api.put(`/danh-muc/${id}`, data),

  // DELETE /api/danh-muc/:id  (yêu cầu admin token)
  xoa: (id) => api.delete(`/danh-muc/${id}`),
  
  khoiPhuc: (id) => api.post(`/danh-muc/${id}/khoi-phuc`),
  
  xoaVinhVien: (id) => api.delete(`/danh-muc/${id}/xoa-vinh-vien`),
};