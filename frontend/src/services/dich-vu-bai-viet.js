import api from './api';

const unwrap = (res) => res.data?.data ?? res.data;

export const layDanhSach = (params) => api.get('/bai-viet', { params }).then(unwrap);
export const layChuDe = () => api.get('/bai-viet/chu-de').then(unwrap);
export const themMoi = (data) => api.post('/bai-viet', data).then(unwrap);
export const capNhat = (id, data) => api.put(`/bai-viet/${id}`, data).then(unwrap);
export const doiTrangThai = (id) => api.patch(`/bai-viet/${id}/trang-thai`).then(unwrap);
export const xoa = (id) => api.delete(`/bai-viet/${id}`).then(unwrap);