'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useXacThuc } from '@/context/xac-thuc-context';
import dichVuTaiKhoan from '@/services/dich-vu-tai-khoan';
import {
  dinhDangTien,
  dinhDangNgayGio,
  thongTinTrangThai,
  maDonHang,
  TRANG_THAI_THANH_TOAN,
  PHUONG_THUC_THANH_TOAN,
} from '@/utils/dinh-dang';

export default function TrangChiTietDonHang() {
  const { id } = useParams();
  const { user, daSanSang, dangXuat } = useXacThuc();
  const [dh, setDh] = useState(null);
  const [loi, setLoi] = useState(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    if (!daSanSang || !user) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await dichVuTaiKhoan.layChiTietDonHang(id, controller.signal);
        setDh(res.data);
      } catch (e) {
        if (controller.signal.aborted) return;
        const status = e?.response?.status;
        if (status === 401) return dangXuat();
        setLoi(status === 404 ? 'Không tìm thấy đơn hàng.' : 'Không tải được đơn hàng.');
      } finally {
        if (!controller.signal.aborted) setDangTai(false);
      }
    })();
    return () => controller.abort();
  }, [daSanSang, user, id, dangXuat]);

  if (!daSanSang || (user && dangTai)) {
    return <div className="py-24 text-center text-gray-400">Đang tải...</div>;
  }

  if (!user) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-gray-500">Vui lòng đăng nhập để xem đơn hàng.</p>
        <Link
          href={`/dang-nhap?redirect=/don-hang/${id}`}
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (loi) {
    return (
      <div className="py-24 text-center space-y-4">
        <p className="text-gray-500">{loi}</p>
        <Link href="/don-hang" className="text-emerald-700 font-semibold underline">
          ← Về danh sách đơn hàng
        </Link>
      </div>
    );
  }

  if (!dh) return null;
  const tt = thongTinTrangThai(dh.trang_thai_don_hang);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link href="/don-hang" className="text-sm text-emerald-700 font-semibold hover:underline">
        ← Đơn hàng của tôi
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{maDonHang(dh.id)}</h1>
          <p className="text-sm text-gray-500">Đặt lúc {dinhDangNgayGio(dh.ngay_tao)}</p>
        </div>
        <span className={`text-sm px-3 py-1.5 rounded-full font-medium ${tt.cls}`}>{tt.nhan}</span>
      </div>

      <section className="bg-white rounded-2xl border border-emerald-100 p-5 grid sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs text-gray-400 font-medium">Người nhận</p>
          <p className="font-semibold text-gray-800">
            {dh.ten_nguoi_nhan} · {dh.so_dien_thoai_nhan}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium">Thanh toán</p>
          <p className="font-semibold text-gray-800">
            {PHUONG_THUC_THANH_TOAN[dh.phuong_thuc_thanh_toan] ?? dh.phuong_thuc_thanh_toan} ·{' '}
            {TRANG_THAI_THANH_TOAN[dh.trang_thai_thanh_toan] ?? dh.trang_thai_thanh_toan}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs text-gray-400 font-medium">Địa chỉ giao hàng</p>
          <p className="font-semibold text-gray-800">{dh.dia_chi_nhan}</p>
        </div>
        {dh.ghi_chu && (
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-400 font-medium">Ghi chú</p>
            <p className="text-gray-700">{dh.ghi_chu}</p>
          </div>
        )}
      </section>

      <section className="bg-white rounded-2xl border border-emerald-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {dh.chi_tiet?.map((sp) => (
            <li key={sp.id} className="p-4 flex items-center gap-4">
              {sp.hinh_anh ? (
                <img
                  src={sp.hinh_anh}
                  alt=""
                  loading="lazy"
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-emerald-50 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{sp.ten_san_pham}</p>
                <p className="text-xs text-gray-500">
                  {dinhDangTien(sp.gia_giam ?? sp.gia_ban)} × {sp.so_luong}
                  {sp.gia_giam != null && (
                    <span className="line-through ml-2">{dinhDangTien(sp.gia_ban)}</span>
                  )}
                </p>
              </div>
              <span className="font-bold text-gray-800">{dinhDangTien(sp.thanh_tien)}</span>
            </li>
          ))}
        </ul>

        <div className="bg-gray-50 p-4 space-y-1 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính</span>
            <span>{dinhDangTien(dh.tong_tien)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển</span>
            <span>{dinhDangTien(dh.phi_vanchuyen)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-emerald-700 text-base pt-1">
            <span>Tổng thanh toán</span>
            <span>{dinhDangTien(dh.thanh_tien)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}