'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { layGioHang } from '@/services/dich-vu-gio-hang';

const dinhDangTien = (soTien) => `${Number(soTien || 0).toLocaleString('vi-VN')}đ`;

export default function TrangGioHang() {
  const [gioHang, setGioHang] = useState(null);
  const [dangTai, setDangTai] = useState(true);
  const [daDangNhap, setDaDangNhap] = useState(false);
  const [loi, setLoi] = useState('');

  useEffect(() => {
    const khoiTao = async () => {
      if (!localStorage.getItem('access_token')) {
        setDangTai(false);
        return;
      }
      setDaDangNhap(true);

      try {
        setGioHang(await layGioHang());
      } catch (error) {
        setLoi(error.response?.data?.message || 'Không tải được giỏ hàng.');
      } finally {
        setDangTai(false);
      }
    };

    void khoiTao();
  }, []);

  const chiTiet = gioHang?.chi_tiet || [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-emerald-950">Giỏ hàng của bạn</h1>

      {loi && <p className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">{loi}</p>}

      {dangTai ? (
        <p>Đang tải giỏ hàng...</p>
      ) : !daDangNhap ? (
        <div className="rounded-2xl bg-white p-6">
          <p className="mb-4">Vui lòng đăng nhập để xem giỏ hàng và thanh toán.</p>
          <Link href="/dang-nhap" className="font-bold text-emerald-700">Đăng nhập</Link>
        </div>
      ) : chiTiet.length === 0 ? (
        <div className="rounded-2xl bg-white p-6">
          <p>Giỏ hàng đang trống.</p>
          <Link href="/danh-muc" className="mt-4 inline-block font-bold text-emerald-700 hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-5 lg:col-span-2">
            <h2 className="font-bold">Sản phẩm trong giỏ</h2>
            {chiTiet.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-t py-3">
                <div>
                  <p className="font-semibold">{item.ten_san_pham}</p>
                  <p className="text-sm text-gray-600">{dinhDangTien(item.gia)} × {item.so_luong}</p>
                </div>
                <span className="font-bold">{dinhDangTien(item.thanh_tien)}</span>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold">Tóm tắt đơn hàng</h2>
            <div className="mb-3 flex justify-between">
              <span>Tạm tính</span><span className="font-bold">{dinhDangTien(gioHang.tong_tien)}</span>
            </div>
            <div className="mb-3 flex justify-between text-emerald-700">
              <span>Phí giao hàng</span><span>Miễn phí</span>
            </div>
            <div className="mb-5 flex justify-between border-t pt-3 font-bold">
              <span>Tổng cộng</span><span>{dinhDangTien(gioHang.tong_tien)}</span>
            </div>

            <Link
              href="/thanh-toan"
              className="block w-full rounded-xl bg-emerald-600 py-3 text-center font-bold text-white hover:bg-emerald-700"
            >
              Tiến hành thanh toán
            </Link>
            <Link href="/danh-muc" className="mt-3 block text-center text-sm font-semibold text-emerald-700 hover:underline">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}