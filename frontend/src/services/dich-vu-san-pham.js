import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_KEY = 'admin_local_db_v1';

const adminApi = axios.create({
  baseURL: BASE_URL,
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

const readLocalState = () => {
  if (typeof window === 'undefined') {
    return { danhMuc: [], sanPham: [], thuongHieu: [] };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = {
      danhMuc: [
        { id: 1, parent_id: null, ten_danh_muc: 'Điện thoại', duong_dan_dm: 'dien-thoai', hinh_anh: '', mo_ta: '', sp_noi_bat: true, deleted_at: null },
        { id: 2, parent_id: null, ten_danh_muc: 'Laptop', duong_dan_dm: 'laptop', hinh_anh: '', mo_ta: '', sp_noi_bat: true, deleted_at: null },
      ],
      sanPham: [
        {
          id: 1,
          danh_muc_id: 1,
          thuong_hieu_id: 1,
          ten_san_pham: 'iPhone 15',
          duong_dan_sp: 'iphone-15',
          hinh_anh: '',
          gia_ban: 24990000,
          gia_giam: 2000000,
          so_luong_ton_kho: 10,
          don_vi_tinh: 'Cái',
          mo_ta_ngan: 'Sản phẩm mẫu',
          chi_tiet: 'Mẫu demo',
          trang_thai: 'hien_thi',
          deleted_at: null,
        },
      ],
      thuongHieu: [
        { id: 1, ten_thuong_hieu: 'Apple', slug: 'apple', deleted_at: null },
        { id: 2, ten_thuong_hieu: 'Samsung', slug: 'samsung', deleted_at: null },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      danhMuc: Array.isArray(parsed.danhMuc) ? parsed.danhMuc : [],
      sanPham: Array.isArray(parsed.sanPham) ? parsed.sanPham : [],
      thuongHieu: Array.isArray(parsed.thuongHieu) ? parsed.thuongHieu : [],
    };
  } catch (error) {
    const fallback = { danhMuc: [], sanPham: [], thuongHieu: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

const writeLocalState = (state) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

const normalizeProduct = (item) => ({
  ...item,
  danh_muc_id: item.danh_muc_id === '' || item.danh_muc_id === null || item.danh_muc_id === undefined ? null : Number(item.danh_muc_id),
  thuong_hieu_id: item.thuong_hieu_id === '' || item.thuong_hieu_id === null || item.thuong_hieu_id === undefined ? null : Number(item.thuong_hieu_id),
  gia_ban: Number(item.gia_ban ?? 0),
  gia_giam: Number(item.gia_giam ?? 0),
  so_luong_ton_kho: Number(item.so_luong_ton_kho ?? 0),
  deleted_at: item.deleted_at || null,
});

const buildLocalProductResponse = (items) => ({
  data: {
    data: items,
    meta: { last_page: 1 },
  },
});

const withLocalFallback = async (requestFn, fallbackFn) => {
  try {
    return await requestFn();
  } catch (error) {
    return fallbackFn(error);
  }
};

const getNextProductId = (state) => {
  const ids = state.sanPham.map((item) => Number(item.id) || 0);
  return ids.length ? Math.max(...ids) + 1 : 1;
};

const toObject = (data) => {
  if (!data) return {};
  if (typeof data.entries === 'function') {
    return Object.fromEntries(data.entries());
  }
  return { ...data };
};

const toLocalProductData = (data) => {
  const product = toObject(data);
  if (product.hinh_anh && typeof product.hinh_anh !== 'string') {
    product.hinh_anh = product.hinh_anh_xem_truoc || '';
  }
  delete product.hinh_anh_xem_truoc;
  return product;
};

export const dichVuSanPham = {
  layDanhSach: (params = {}) => withLocalFallback(
    () => adminApi.get('/san-pham', { params }),
    () => {
      const state = readLocalState();
      const items = (state.sanPham || []).filter((item) => !item.deleted_at);
      return buildLocalProductResponse(items);
    }
  ),

  layThungRac: (page = 1) => withLocalFallback(
    () => adminApi.get(`/san-pham/thung-rac?page=${page}`),
    () => {
      const state = readLocalState();
      return buildLocalProductResponse((state.sanPham || []).filter((item) => item.deleted_at));
    }
  ),

  themMoi: (data) => withLocalFallback(
    () => adminApi.post('/san-pham', data),
    () => {
      const state = readLocalState();
      const payload = normalizeProduct({
        ...toLocalProductData(data),
        id: getNextProductId(state),
        trang_thai: toLocalProductData(data).trang_thai || 'hien_thi',
        deleted_at: null,
      });

      state.sanPham.push(payload);
      writeLocalState(state);
      return { data: { success: true, message: 'Thêm sản phẩm thành công', data: payload } };
    }
  ),

  capNhat: (id, data) => withLocalFallback(
    () => {
      const formData = new FormData();
      Object.entries(toObject(data)).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      formData.append('_method', 'PUT');
      return adminApi.post(`/san-pham/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    () => {
      const state = readLocalState();
      const item = state.sanPham.find((entry) => Number(entry.id) === Number(id));
      if (!item) {
        return Promise.reject(new Error('Sản phẩm không tồn tại'));
      }

      Object.assign(item, normalizeProduct({
        ...item,
        ...toLocalProductData(data),
        id: Number(id),
      }));

      writeLocalState(state);
      return { data: { success: true, message: 'Cập nhật sản phẩm thành công', data: item } };
    }
  ),

  xoaTam: (id) => withLocalFallback(
    () => adminApi.delete(`/san-pham/${id}`),
    () => {
      const state = readLocalState();
      const item = state.sanPham.find((entry) => Number(entry.id) === Number(id));
      if (!item) return { data: { success: true, message: 'Sản phẩm không tồn tại' } };
      item.deleted_at = item.deleted_at || new Date().toISOString();
      writeLocalState(state);
      return { data: { success: true, message: 'Đã chuyển sản phẩm vào thùng rác' } };
    }
  ),

  khoiPhuc: (id) => withLocalFallback(
    () => adminApi.post(`/san-pham/${id}/khoi-phuc`),
    () => {
      const state = readLocalState();
      const item = state.sanPham.find((entry) => Number(entry.id) === Number(id));
      if (!item) return { data: { success: true, message: 'Sản phẩm không tồn tại' } };
      item.deleted_at = null;
      writeLocalState(state);
      return { data: { success: true, message: 'Khôi phục sản phẩm thành công' } };
    }
  ),

  xoaVinhVien: (id) => withLocalFallback(
    () => adminApi.delete(`/san-pham/${id}/xoa-vinh-vien`),
    () => {
      const state = readLocalState();
      state.sanPham = state.sanPham.filter((item) => Number(item.id) !== Number(id));
      writeLocalState(state);
      return { data: { success: true, message: 'Đã xóa vĩnh viễn sản phẩm khỏi hệ thống' } };
    }
  ),

  layDanhMuc: () => withLocalFallback(
    () => adminApi.get('/danh-muc'),
    () => {
      const state = readLocalState();
      return { data: { data: (state.danhMuc || []).filter((item) => !item.deleted_at) } };
    }
  ),

  layThuongHieu: () => withLocalFallback(
    () => adminApi.get('/thuong-hieu'),
    () => {
      const state = readLocalState();
      return { data: { data: (state.thuongHieu || []).filter((item) => !item.deleted_at) } };
    }
  ),
};
