
export const tinhTongTien = (giaBan, giaGiam, soLuong) => {
  const donGia = Number(giaGiam > 0 ? giaGiam : giaBan);
  return donGia * soLuong;
};

export const dinhDangTienVND = (soTien) => {
  return Number(soTien).toLocaleString('vi-VN') + 'đ';
};