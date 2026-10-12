import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. Gắn Token xác thực nếu có
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('access_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.data instanceof FormData) {
      // Nếu là FormData (có chứa file ảnh), xóa Content-Type để Axios tự động nhận diện multipart/form-data
      delete config.headers['Content-Type'];
    } else {
      // Nếu là dữ liệu thông thường, ép kiểu JSON
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;