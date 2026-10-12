import api from './api';

const unwrap = (res) => res.data?.data ?? res.data;

export const layDanhSach = (params) => api.get('/nguoi-dung', { params }).then(unwrap);
export const layThungRac = (params) => api.get('/nguoi-dung/thung-rac', { params }).then(unwrap);
export const layDonHang = (id) => api.get(`/nguoi-dung/${id}/don-hang`).then(unwrap);
export const themMoi = (data) => api.post('/nguoi-dung', data).then(unwrap);
export const capNhat = (id, data) => api.put(`/nguoi-dung/${id}`, data).then(unwrap);
export const doiTrangThai = (id) => api.patch(`/nguoi-dung/${id}/khoa`).then(unwrap);
export const xoaTam = (id) => api.delete(`/nguoi-dung/${id}`).then(unwrap);
export const khoiPhuc = (id) => api.post(`/nguoi-dung/${id}/khoi-phuc`).then(unwrap);
export const xoaVinhVien = (id) => api.delete(`/nguoi-dung/${id}/xoa-vinh-vien`).then(unwrap);