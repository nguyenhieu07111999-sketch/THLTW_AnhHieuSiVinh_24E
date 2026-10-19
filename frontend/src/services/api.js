import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const laTrangAdmin = window.location.pathname.startsWith('/admin');
      const url = config.url || '';
      const method = (config.method || 'get').toLowerCase();

      // Danh sách các tiền tố endpoint công khai (chỉ áp dụng với GET)
      const publicEndpoints = ['/san-pham', '/danh-muc', '/thuong-hieu', '/bai-viet'];
      const laApiCongKhai = method === 'get' && publicEndpoints.some((ep) => url.startsWith(ep));

      if (!laApiCongKhai) {
        const token = localStorage.getItem(laTrangAdmin ? 'admin_token' : 'access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // Chắc chắn xóa header Authorization ở các API công khai
        delete config.headers.Authorization;
        delete config.headers.authorization;
      }
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;