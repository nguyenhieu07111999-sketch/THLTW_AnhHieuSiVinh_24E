import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_KEY = 'admin_local_db_v1';

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
      const token = localStorage.getItem('admin_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const createDefaultState = () => ({
  danhMuc: [
    { id: 1, parent_id: null, ten_danh_muc: 'Điện thoại', duong_dan_dm: 'dien-thoai', hinh_anh: '', mo_ta: 'Danh mục điện thoại', sp_noi_bat: true, deleted_at: null, ngay_tao: new Date().toISOString(), children: [] },
    { id: 2, parent_id: null, ten_danh_muc: 'Laptop', duong_dan_dm: 'laptop', hinh_anh: '', mo_ta: 'Danh mục laptop', sp_noi_bat: true, deleted_at: null, ngay_tao: new Date().toISOString(), children: [] },
    { id: 3, parent_id: 1, ten_danh_muc: 'iPhone', duong_dan_dm: 'iphone', hinh_anh: '', mo_ta: 'Dòng iPhone', sp_noi_bat: false, deleted_at: null, ngay_tao: new Date().toISOString(), children: [] },
    { id: 4, parent_id: 2, ten_danh_muc: 'MacBook', duong_dan_dm: 'macbook', hinh_anh: '', mo_ta: 'Dòng MacBook', sp_noi_bat: false, deleted_at: null, ngay_tao: new Date().toISOString(), children: [] },
  ],
  sanPham: [],
  thuongHieu: [
    { id: 1, ten_thuong_hieu: 'Apple', slug: 'apple', deleted_at: null },
    { id: 2, ten_thuong_hieu: 'Samsung', slug: 'samsung', deleted_at: null },
  ],
});

const readLocalState = () => {
  if (typeof window === 'undefined') {
    return createDefaultState();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createDefaultState();
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
    const initial = createDefaultState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
};

const writeLocalState = (state) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
};

const normalizeCategory = (item) => ({
  ...item,
  parent_id: item.parent_id === '' || item.parent_id === null || item.parent_id === undefined ? null : Number(item.parent_id),
  sp_noi_bat: Boolean(item.sp_noi_bat),
  children: Array.isArray(item.children) ? item.children : [],
  deleted_at: item.deleted_at || null,
});

const buildCategoryTree = (items = []) => {
  const allItems = items.map(normalizeCategory);
  const map = new Map(allItems.map((item) => [item.id, item]));

  allItems.forEach((item) => {
    item.children = [];
  });

  allItems.forEach((item) => {
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id).children.push(item);
    }
  });

  return allItems.filter((item) => !item.parent_id);
};

const buildLocalCategoryResponse = (items) => ({
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

const getNextCategoryId = (state) => {
  const ids = state.danhMuc.map((item) => Number(item.id) || 0);
  return ids.length ? Math.max(...ids) + 1 : 1;
};

const deleteCategoryTree = (state, categoryId) => {
  const walk = (id) => {
    const children = state.danhMuc.filter((item) => Number(item.parent_id) === Number(id));
    children.forEach((child) => walk(child.id));
    const item = state.danhMuc.find((entry) => Number(entry.id) === Number(id));
    if (item) {
      item.deleted_at = item.deleted_at || new Date().toISOString();
      item.ngay_xoa = item.deleted_at;
    }
  };

  walk(Number(categoryId));
};

const restoreCategoryTree = (state, categoryId) => {
  const walk = (id) => {
    const children = state.danhMuc.filter((item) => Number(item.parent_id) === Number(id));
    children.forEach((child) => walk(child.id));
    const item = state.danhMuc.find((entry) => Number(entry.id) === Number(id));
    if (item) {
      item.deleted_at = null;
      item.ngay_xoa = null;
    }
  };

  walk(Number(categoryId));
};

const removeCategoryTree = (state, categoryId) => {
  const ids = [Number(categoryId)];
  const collect = (id) => {
    state.danhMuc.filter((item) => Number(item.parent_id) === Number(id)).forEach((child) => {
      ids.push(Number(child.id));
      collect(child.id);
    });
  };

  collect(Number(categoryId));
  state.danhMuc = state.danhMuc.filter((item) => !ids.includes(Number(item.id)));
};

export const dichVuDanhMuc = {
  layDanhSach: (params = {}) => withLocalFallback(
    () => adminApi.get('/danh-muc', { params }),
    () => {
      const state = readLocalState();
      const data = state.danhMuc.filter((item) => !item.deleted_at);
      const parentId = params.parent_id;
      const items = parentId === undefined || parentId === null || parentId === ''
        ? buildCategoryTree(data)
        : data.filter((item) => Number(item.parent_id) === Number(parentId));

      return buildLocalCategoryResponse(items);
    }
  ),

  layThungRac: (params = {}) => withLocalFallback(
    () => adminApi.get('/danh-muc/thung-rac', { params }),
    () => {
      const state = readLocalState();
      return buildLocalCategoryResponse(state.danhMuc.filter((item) => item.deleted_at));
    }
  ),

  layChiTiet: (id) => withLocalFallback(
    () => adminApi.get(`/danh-muc/${id}`),
    () => {
      const state = readLocalState();
      const item = state.danhMuc.find((entry) => Number(entry.id) === Number(id));
      return { data: { success: true, data: item || null } };
    }
  ),

  themMoi: (data) => withLocalFallback(
    () => adminApi.post('/danh-muc', data),
    () => {
      const state = readLocalState();
      const nextItem = normalizeCategory({
        ...data,
        id: getNextCategoryId(state),
        parent_id: data.parent_id === '' || data.parent_id === null || data.parent_id === undefined ? null : Number(data.parent_id),
        deleted_at: null,
        ngay_tao: new Date().toISOString(),
        sp_noi_bat: Boolean(data.sp_noi_bat),
      });

      state.danhMuc.push(nextItem);
      writeLocalState(state);
      return { data: { success: true, message: 'Thêm danh mục thành công', data: nextItem } };
    }
  ),

  capNhat: (id, data) => withLocalFallback(
    () => adminApi.put(`/danh-muc/${id}`, data),
    () => {
      const state = readLocalState();
      const item = state.danhMuc.find((entry) => Number(entry.id) === Number(id));
      if (!item) {
        return Promise.reject(new Error('Danh mục không tồn tại'));
      }

      Object.assign(item, normalizeCategory({
        ...item,
        ...data,
        id: Number(id),
        parent_id: data.parent_id === '' || data.parent_id === null || data.parent_id === undefined ? null : Number(data.parent_id),
        sp_noi_bat: Boolean(data.sp_noi_bat),
      }));

      writeLocalState(state);
      return { data: { success: true, message: 'Cập nhật danh mục thành công', data: item } };
    }
  ),

  xoa: (id) => withLocalFallback(
    () => adminApi.delete(`/danh-muc/${id}`),
    () => {
      const state = readLocalState();
      deleteCategoryTree(state, id);
      writeLocalState(state);
      return { data: { success: true, message: 'Đã chuyển danh mục vào thùng rác' } };
    }
  ),

  khoiPhuc: (id) => withLocalFallback(
    () => adminApi.post(`/danh-muc/${id}/khoi-phuc`),
    () => {
      const state = readLocalState();
      restoreCategoryTree(state, id);
      writeLocalState(state);
      return { data: { success: true, message: 'Khôi phục danh mục thành công' } };
    }
  ),

  xoaVinhVien: (id) => withLocalFallback(
    () => adminApi.delete(`/danh-muc/${id}/xoa-vinh-vien`),
    () => {
      const state = readLocalState();
      removeCategoryTree(state, id);
      writeLocalState(state);
      return { data: { success: true, message: 'Đã xóa vĩnh viễn danh mục' } };
    }
  ),
};
