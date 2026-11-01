import api from './api';

export const dichVuXacThuc = {
  // Hàm Đăng ký (dùng chung Axios instance)
  async dangKy(payload) {
    const res = await api.post('/dang-ky', payload);
    return res.data;
  },

  // Hàm Đăng nhập (dùng chung Axios instance)
  async dangNhap(payload) {
    const res = await api.post('/dang-nhap', payload);
    return res.data;
  },

  // Hàm Đăng xuất
  async dangXuat() {
    try {
      await api.post('/dang-xuat');
    } catch (e) {
      // Bỏ qua lỗi nếu token đã hết hạn trên server
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('admin_token'); // Dọn dẹp sạch sẽ token admin tránh xung đột
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