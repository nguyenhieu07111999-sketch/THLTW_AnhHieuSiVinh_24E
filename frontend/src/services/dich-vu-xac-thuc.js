import api from './api';

export const dichVuXacThuc = {
  async dangKy(payload) {
    const res = await api.post('/dang-ky', payload);
    return res.data;
  },

  async dangNhap(payload) {
    const res = await api.post('/dang-nhap', payload);
    return res.data;
  },

  async dangXuat() {
    try {
      await api.post('/dang-xuat');
    } catch (e) {
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('admin_token'); 
    }
  },

  async dangXuatAdmin() {
    try {
      await api.post('/dang-xuat');
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_info');
    }
  }
};