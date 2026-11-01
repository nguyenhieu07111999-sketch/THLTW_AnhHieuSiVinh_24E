import api from './api';

export const dichVuMenu = {
  layDanhSach: () => api.get('/menus'),

  layNguonLienKet: () => api.get('/menus/nguon-lien-ket'),

  themMenu: (data) => api.post('/menus', data),

  chiTiet: (id) => api.get(`/menus/${id}`),

  capNhat: (id, data) => api.put(`/menus/${id}`, data),

  xoa: (id) => api.delete(`/menus/${id}`),

  capNhatThuTu: (menus) => api.post('/menus/cap-nhat-thu-tu', { menus }),

  layMenuPublic: (viTri) => api.get(`/menus/${viTri}`),
};