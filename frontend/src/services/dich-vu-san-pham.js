
import axios from 'axios';
import api from './api';

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dichVuSanPham = {
  layDanhSach: (params) => api.get('/san-pham', { params }),
  layThungRac: (page = 1) => adminApi.get(`/san-pham/thung-rac?page=${page}`),
  themMoi: (data) => adminApi.post('/san-pham', data),
  capNhat: (id, data) => {
    data.append('_method', 'PUT');
    return adminApi.post(`/san-pham/${id}`, data);
  },
  xoaTam: (id) => adminApi.delete(`/san-pham/${id}`),
  khoiPhuc: (id) => adminApi.post(`/san-pham/${id}/khoi-phuc`),
  xoaVinhVien: (id) => adminApi.delete(`/san-pham/${id}/xoa-vinh-vien`),
  layDanhMuc: () => api.get('/danh-muc'),
  layThuongHieu: () => api.get('/thuong-hieu'),
};