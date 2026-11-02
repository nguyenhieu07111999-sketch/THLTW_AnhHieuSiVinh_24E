'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dichVuDonHang from '@/services/dich-vu-don-hang';

const tien = (soTien) => `${Number(soTien || 0).toLocaleString('vi-VN')}đ`;
const ngayGio = (giaTri) => (giaTri ? new Date(giaTri).toLocaleString('vi-VN') : '—');

const NHAN_TRANG_THAI_DON = {
  cho_xac_nhan: 'Chờ xác nhận',
  da_xac_nhan: 'Đã xác nhận',
  dang_giao: 'Đang giao',
  da_giao: 'Đã giao',
  hoan_thanh: 'Hoàn thành',
  da_huy: 'Đã huỷ',
};

const NHAN_TRANG_THAI_THANH_TOAN = {
  chua_thanh_toan: 'Chưa thanh toán',
  da_thanh_toan: 'Đã thanh toán',
  hoan_tien: 'Đã hoàn tiền',
};

export default function TrangChiTietDonHangAdmin() {
  const { id } = useParams();
  const router = useRouter();
  const [donHang, setDonHang] = useState(null);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState('');

  useEffect(() => {
    let dangHienThi = true;

    dichVuDonHang.layChiTiet(id)
      .then((response) => {
        if (dangHienThi) setDonHang(response.data?.data ?? response.data);
      })
      .catch((error) => {
        if (dangHienThi) {
          setLoi(error.response?.data?.message || 'Không tải được chi tiết đơn hàng.');
        }
      })
      .finally(() => {
        if (dangHienThi) setDangTai(false);
      });

    return () => {
      dangHienThi = false;
    };
  }, [id]);

  if (dangTai) {
    return <div className="py-16 text-center text-gray-500">Đang tải chi tiết đơn hàng...</div>;
  }

  if (loi || !donHang) {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <p className="text-red-700">{loi || 'Không tìm thấy đơn hàng.'}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-5 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Quay lại
        </button>
      </section>
    );
  }

  const chiTiet = donHang.chi_tiet || [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm font-semibold text-emerald-700 hover:underline"
      >
        ← Quay lại
      </button>

      <div>
        <p className="text-sm font-semibold text-emerald-700">Quản lý đơn hàng</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Chi tiết đơn hàng #{donHang.id}</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-900">Thông tin đơn</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Mã đơn</dt><dd className="font-semibold">#{donHang.id}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Ngày đặt</dt><dd className="text-right">{ngayGio(donHang.ngay_tao || donHang.created_at)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Trạng thái</dt><dd className="font-semibold">{NHAN_TRANG_THAI_DON[donHang.trang_thai_don_hang] || donHang.trang_thai_don_hang}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-900">Thanh toán</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-gray-500">Phương thức</dt><dd>{donHang.phuong_thuc_thanh_toan}</dd></div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Trạng thái</dt>
              <dd className={`font-semibold ${donHang.thanh_toan_that_bai ? 'text-red-600' : ''}`}>
                {donHang.thanh_toan_that_bai
                  ? 'Thanh toán thất bại'
                  : NHAN_TRANG_THAI_THANH_TOAN[donHang.trang_thai_thanh_toan] || donHang.trang_thai_thanh_toan}
              </dd>
            </div>
            {donHang.phuong_thuc_thanh_toan === 'COD' && donHang.trang_thai_thanh_toan === 'da_thanh_toan' && (
              <p className="text-xs text-emerald-700">Đơn COD được ghi nhận thành công theo cấu hình hiện tại.</p>
            )}
          </dl>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold text-gray-900">Thông tin người mua</h2>
        {donHang.nguoi_dung ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div><dt className="text-gray-500">Họ tên</dt><dd className="mt-1 font-semibold">{donHang.nguoi_dung.ho_ten}</dd></div>
            <div><dt className="text-gray-500">Email</dt><dd className="mt-1">{donHang.nguoi_dung.email}</dd></div>
            <div><dt className="text-gray-500">Số điện thoại tài khoản</dt><dd className="mt-1">{donHang.nguoi_dung.so_dien_thoai || '—'}</dd></div>
            <div><dt className="text-gray-500">Mã người mua</dt><dd className="mt-1">#{donHang.nguoi_dung.id}</dd></div>
          </dl>
        ) : (
          <p className="text-sm text-gray-500">Tài khoản người mua không còn tồn tại. Thông tin người nhận vẫn được lưu trong đơn hàng.</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-bold text-gray-900">Thông tin giao hàng</h2>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-gray-500">Người nhận</dt><dd className="mt-1 font-semibold">{donHang.ten_nguoi_nhan}</dd></div>
          <div><dt className="text-gray-500">Số điện thoại</dt><dd className="mt-1">{donHang.so_dien_thoai_nhan}</dd></div>
          <div className="sm:col-span-2"><dt className="text-gray-500">Địa chỉ</dt><dd className="mt-1">{donHang.dia_chi_nhan}</dd></div>
          {donHang.ghi_chu && <div className="sm:col-span-2"><dt className="text-gray-500">Ghi chú</dt><dd className="mt-1">{donHang.ghi_chu}</dd></div>}
        </dl>
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="font-bold text-gray-900">Sản phẩm trong đơn ({chiTiet.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Sản phẩm</th>
                <th className="px-5 py-3 text-right">Đơn giá</th>
                <th className="px-5 py-3 text-center">Số lượng</th>
                <th className="px-5 py-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {chiTiet.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {item.hinh_anh ? (
                        <img src={item.hinh_anh} alt={item.ten_san_pham} className="h-12 w-12 rounded-lg border object-cover" />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-2xl" aria-hidden="true">🥬</span>
                      )}
                      <span className="font-medium text-gray-800">{item.ten_san_pham}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {item.gia_giam != null ? (
                      <span>
                        <span className="font-semibold">{tien(item.gia_giam)}</span>
                        <span className="ml-2 text-xs text-gray-400 line-through">{tien(item.gia_ban)}</span>
                      </span>
                    ) : tien(item.gia_ban)}
                  </td>
                  <td className="px-5 py-3 text-center">{item.so_luong}</td>
                  <td className="px-5 py-3 text-right font-semibold">{tien(item.thanh_tien)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ml-auto max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-gray-900">Tóm tắt thanh toán</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-gray-500">Tạm tính</dt><dd>{tien(donHang.tong_tien)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-gray-500">Phí vận chuyển</dt><dd>{tien(donHang.phi_vanchuyen)}</dd></div>
          <div className="flex justify-between gap-4 border-t pt-3 text-base font-extrabold text-emerald-700"><dt>Tổng thanh toán</dt><dd>{tien(donHang.thanh_tien)}</dd></div>
        </dl>
      </section>
    </div>
  );
}
