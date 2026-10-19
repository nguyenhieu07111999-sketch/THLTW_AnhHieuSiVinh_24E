import api from './api';

export const dichVuTaiKhoan = {
  layHoSo: (signal) => api.get('/tai-khoan', { signal }).then((r) => r.data),

  layDonHang: (params, signal) =>
    api.get('/tai-khoan/don-hang', { params, signal }).then((r) => r.data),

  layChiTietDonHang: (id, signal) =>
    api.get(`/tai-khoan/don-hang/${id}`, { signal }).then((r) => r.data),

  capNhatHoSo: (duLieu, signal) => 
    api.post('/tai-khoan/cap-nhat', duLieu, { signal }).then((r) => r.data),

  
};

export default dichVuTaiKhoan;