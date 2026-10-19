const tienVND = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const ngayVN = new Intl.DateTimeFormat('vi-VN');
const ngayGioVN = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
const toDate = (d) => new Date(String(d).replace(' ', 'T')); // an toàn cho Safari

export const dinhDangTien = (n) => tienVND.format(Number(n) || 0);

export const dinhDangNgay = (d) => {
  const x = toDate(d);
  return Number.isNaN(x.getTime()) ? 'Không rõ' : ngayVN.format(x);
};

export const dinhDangNgayGio = (d) => {
  const x = toDate(d);
  return Number.isNaN(x.getTime()) ? 'Không rõ' : ngayGioVN.format(x);
};

export const maDonHang = (id) => `DH-${String(id).padStart(6, '0')}`;

// Khoá = giá trị enum trong DB
export const TRANG_THAI_DON_HANG = {
  cho_xac_nhan: { nhan: 'Chờ xác nhận', cls: 'bg-gray-100 text-gray-700' },
  da_xac_nhan: { nhan: 'Đã xác nhận', cls: 'bg-blue-100 text-blue-700' },
  dang_giao: { nhan: 'Đang giao hàng', cls: 'bg-amber-100 text-amber-700' },
  hoan_thanh: { nhan: 'Đã hoàn thành', cls: 'bg-green-100 text-green-700' },
  da_huy: { nhan: 'Đã huỷ', cls: 'bg-red-100 text-red-700' },
};

export const thongTinTrangThai = (k) =>
  TRANG_THAI_DON_HANG[k] ?? { nhan: k ?? 'Không rõ', cls: 'bg-gray-100 text-gray-700' };

export const TRANG_THAI_THANH_TOAN = {
  chua_thanh_toan: 'Chưa thanh toán',
  da_thanh_toan: 'Đã thanh toán',
  hoan_tien: 'Hoàn tiền',
};

export const PHUONG_THUC_THANH_TOAN = {
  COD: 'Thanh toán khi nhận hàng',
  VNPAY: 'VNPay',
  MOMO: 'MoMo',
  BANK: 'Chuyển khoản ngân hàng',
};

export const TRANG_THAI_TAI_KHOAN = { hoat_dong: 'Hoạt động', khoa: 'Đã khoá' };