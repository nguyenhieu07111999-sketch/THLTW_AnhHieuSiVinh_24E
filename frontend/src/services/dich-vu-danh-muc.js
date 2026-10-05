// frontend/src/services/dich-vu-danh-muc.js
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Tạo axios instance riêng cho admin danh mục
// Dùng admin_token (lưu bởi layout admin) thay vì token người dùng
const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Ưu tiên admin_token, fallback sang token nếu cần
      const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const dichVuDanhMuc = {
  // GET /api/danh-muc?per_page=200  -> trả về danh mục cha kèm children
  layDanhSach: (params) => adminApi.get('/danh-muc', { params }),
  layThungRac: (params) => adminApi.get('/danh-muc/thung-rac', { params }),

  // GET /api/danh-muc/:id
  layChiTiet: (id) => adminApi.get(`/danh-muc/${id}`),

  // POST /api/danh-muc  (yêu cầu admin token)
  themMoi: (data) => adminApi.post('/danh-muc', data),

  // PUT /api/danh-muc/:id  (yêu cầu admin token)
  capNhat: (id, data) => adminApi.put(`/danh-muc/${id}`, data),

  // DELETE /api/danh-muc/:id  (yêu cầu admin token)
  xoa: (id) => adminApi.delete(`/danh-muc/${id}`),
  khoiPhuc: (id) => adminApi.post(`/danh-muc/${id}/khoi-phuc`),
  xoaVinhVien: (id) => adminApi.delete(`/danh-muc/${id}/xoa-vinh-vien`),
};
