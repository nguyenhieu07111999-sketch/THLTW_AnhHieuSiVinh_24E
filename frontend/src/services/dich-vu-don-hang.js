import api from './api';

export const dichVuDonHang = {
  layDanhSach: (params) => api.get('/don-hang', { params }),

  layChiTiet: (id) => api.get(`/don-hang/${id}`),

  capNhat: (id, data) => api.put(`/don-hang/${id}`, data),
};

export default dichVuDonHang;