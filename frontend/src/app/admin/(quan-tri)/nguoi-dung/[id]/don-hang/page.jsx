'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { layDonHang } from '@/services/dich-vu-nguoi-dung';

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

export default function TrangDonHangNguoiDungAdmin() {
  const { id } = useParams();
  const router = useRouter();
  const [donHang, setDonHang] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState('');

  useEffect(() => {
    let dangHienThi = true;

    layDonHang(id)
      .then((response) => {
        if (dangHienThi) {
          setDonHang(Array.isArray(response) ? response : response?.data ?? []);
        }
      })
      .catch((error) => {
        if (dangHienThi) {
          setLoi(error.response?.data?.message || 'Không tải được danh sách đơn hàng.');
        }
      })
      .finally(() => {
        if (dangHienThi) setDangTai(false);
      });

    return () => {
      dangHienThi = false;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-sm font-semibold text-emerald-700 hover:underline"
      >
        ← Quay lại danh sách người dùng
      </button>

      <div>
        <p className="text-sm font-semibold text-emerald-700">Quản lý người dùng</p>
        <h1 className="mt-1 text-2xl font-extrabold text-gray-900">Đơn hàng của người dùng #{id}</h1>
        <p className="mt-1 text-sm text-gray-500">Chọn một đơn hàng để xem người mua, sản phẩm và trạng thái thanh toán.</p>
      </div>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {dangTai ? (
          <p className="p-8 text-center text-gray-500">Đang tải đơn hàng...</p>
        ) : loi ? (
          <p className="p-8 text-center text-red-600" role="alert">{loi}</p>
        ) : donHang.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Người dùng này chưa có đơn hàng.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-3">Mã đơn</th>
                  <th className="px-5 py-3">Ngày đặt</th>
                  <th className="px-5 py-3">Người nhận</th>
                  <th className="px-5 py-3">Trạng thái đơn</th>
                  <th className="px-5 py-3">Thanh toán</th>
                  <th className="px-5 py-3 text-right">Tổng tiền</th>
                  <th className="px-5 py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {donHang.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold">#{item.id}</td>
                    <td className="px-5 py-4">{ngayGio(item.created_at)}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium">{item.ten_nguoi_nhan || '—'}</p>
                      <p className="text-xs text-gray-500">{item.so_dien_thoai_nhan || ''}</p>
                    </td>
                    <td className="px-5 py-4">
                      {NHAN_TRANG_THAI_DON[item.trang_thai_don_hang] || item.trang_thai_don_hang || '—'}
                    </td>
                    <td className={`px-5 py-4 font-semibold ${item.thanh_toan_that_bai ? 'text-red-600' : 'text-gray-700'}`}>
                      {item.thanh_toan_that_bai
                        ? 'Thanh toán thất bại'
                        : NHAN_TRANG_THAI_THANH_TOAN[item.trang_thai_thanh_toan] || item.trang_thai_thanh_toan || '—'}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold">{tien(item.thanh_tien)}</td>
                    <td className="px-5 py-4 text-center">
                      <Link
                        href={`/admin/don-hang/${item.id}?nguoi_dung_id=${id}`}
                        className="inline-flex rounded-lg border border-emerald-200 px-3 py-1.5 font-semibold text-emerald-700 hover:bg-emerald-50"
                      >
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
