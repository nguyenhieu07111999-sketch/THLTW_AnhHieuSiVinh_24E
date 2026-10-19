import api from './api';

export const layDanhSach = (params = {}) => api.get('/bai-viet', { params }).then((r) => r.data);
export const layChuDe = () => api.get('/bai-viet/chu-de').then((r) => r.data);
export const themMoi = (duLieu) => api.post('/bai-viet', duLieu).then((r) => r.data);

export const capNhat = (id, duLieu) => {
    if (duLieu instanceof FormData) {
        duLieu.append('_method', 'PUT');
        return api.post(`/bai-viet/${id}`, duLieu).then((r) => r.data);
    }
    return api.put(`/bai-viet/${id}`, duLieu).then((r) => r.data);
};

export const doiTrangThai = (id) => api.patch(`/bai-viet/${id}/trang-thai`).then((r) => r.data);
export const xoa = (id) => api.delete(`/bai-viet/${id}`).then((r) => r.data);