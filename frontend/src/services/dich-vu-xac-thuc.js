const API_URL = 'http://localhost:8000/api';

export const dichVuXacThuc = {
  // Hàm Đăng ký
  async dangKy(payload) {
    const res = await fetch(`${API_URL}/dang-ky`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  // Hàm Đăng nhập
  async dangNhap(payload) {
    const res = await fetch(`${API_URL}/dang-nhap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  // Hàm Đăng xuất
  async dangXuat() {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_URL}/dang-xuat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    return await res.json();
  }
};