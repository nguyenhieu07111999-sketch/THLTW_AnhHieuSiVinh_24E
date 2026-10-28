'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { capNhatSoLuongGio, layGioHang } from '@/services/dich-vu-gio-hang';

const dinhDangTien = (soTien) => `${Number(soTien || 0).toLocaleString('vi-VN')}đ`;
const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const GOC_BACKEND = API.replace(/\/api\/?$/, '');

const layUrlAnh = (duongDan) => {
  if (!duongDan) return '';
  if (/^(https?:|data:)/.test(duongDan)) return duongDan;
  const duongDanSach = duongDan.replace(/^\/+/, '');
  return duongDanSach.startsWith('storage/')
    ? `${GOC_BACKEND}/${duongDanSach}`
    : `${GOC_BACKEND}/storage/${duongDanSach}`;
};

export default function TrangGioHang() {
  const [gioHang, setGioHang] = useState(null);
  const [dangTai, setDangTai] = useState(true);
  const [daDangNhap, setDaDangNhap] = useState(false);
  const [loi, setLoi] = useState('');
  const [chiTietDangCapNhat, setChiTietDangCapNhat] = useState([]);
  const cacChiTietDangCapNhat = useRef(new Set());

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

  const capNhatGioHangTamThoi = (gioHangHienTai, chiTietId, soLuong) => {
    if (!gioHangHienTai) return gioHangHienTai;

    const chiTietMoi = gioHangHienTai.chi_tiet.map((item) => {
      if (item.id !== chiTietId) return item;
      const thanhTien = Number(item.gia || 0) * soLuong;
      return { ...item, so_luong: soLuong, thanh_tien: thanhTien };
    });
    const tongTien = chiTietMoi.reduce((tong, item) => tong + Number(item.thanh_tien || 0), 0);

    return { ...gioHangHienTai, chi_tiet: chiTietMoi, tong_tien: tongTien };
  };

  const capNhatSoLuong = async (item, soLuongMoi) => {
    if (soLuongMoi < 1 || cacChiTietDangCapNhat.current.has(item.id)) return;

    cacChiTietDangCapNhat.current.add(item.id);
    setChiTietDangCapNhat((cacId) => [...cacId, item.id]);
    setLoi('');
    setGioHang((hienTai) => capNhatGioHangTamThoi(hienTai, item.id, soLuongMoi));

    try {
      await capNhatSoLuongGio(item.id, soLuongMoi);
    } catch (error) {
      setGioHang((hienTai) => capNhatGioHangTamThoi(hienTai, item.id, item.so_luong));
      const errors = error.response?.data?.errors;
      setLoi(
        errors
          ? Object.values(errors).flat().join(' | ')
          : error.response?.data?.message || 'Không thể cập nhật số lượng. Vui lòng thử lại.'
      );
    } finally {
      cacChiTietDangCapNhat.current.delete(item.id);
      setChiTietDangCapNhat((cacId) => cacId.filter((id) => id !== item.id));
    }
  };

  return (
    <div className="min-h-[55vh] bg-slate-50/70">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-7">
          <p className="mb-1 text-sm font-semibold text-emerald-700">Mua sắm dễ dàng</p>
          <h1 className="text-2xl font-extrabold text-emerald-950 sm:text-3xl">Giỏ hàng của bạn</h1>
          {daDangNhap && chiTiet.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">{chiTiet.length} sản phẩm đang chờ bạn</p>
          )}
        </div>

        {loi && <p className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">{loi}</p>}

        {dangTai ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center text-gray-500 shadow-sm">
            Đang tải giỏ hàng...
          </div>
        ) : !daDangNhap ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
            <div className="mb-3 text-5xl" aria-hidden="true">🛒</div>
            <p className="mb-4 text-gray-700">Vui lòng đăng nhập để xem giỏ hàng và thanh toán.</p>
            <Link href="/dang-nhap" className="inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700">
              Đăng nhập
            </Link>
          </div>
        ) : chiTiet.length === 0 ? (
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mb-3 text-6xl" aria-hidden="true">🛒</div>
            <h2 className="text-xl font-bold text-gray-800">Giỏ hàng đang trống</h2>
            <p className="mt-2 text-gray-500">Hãy chọn những sản phẩm tươi ngon bạn yêu thích nhé.</p>
            <Link href="/danh-muc" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
            <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                <h2 className="font-bold text-gray-800">Sản phẩm trong giỏ</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {chiTiet.length} sản phẩm
                </span>
              </div>

              <div className="divide-y divide-gray-100 px-4 sm:px-6">
                {chiTiet.map((item) => (
                  <article key={item.id} className="flex gap-4 py-5 sm:gap-5">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-emerald-50 sm:h-28 sm:w-28">
                      <span className="absolute inset-0 flex items-center justify-center text-3xl" aria-hidden="true">🥬</span>
                      {item.hinh_anh && (
                        <img
                          src={layUrlAnh(item.hinh_anh)}
                          alt={item.ten_san_pham || 'Hình ảnh sản phẩm'}
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(event) => { event.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-gray-800">{item.ten_san_pham || 'Sản phẩm'}</h3>
                        <p className="mt-1 text-sm font-semibold text-emerald-700">{dinhDangTien(item.gia)}</p>
                        <div className="mt-3 inline-flex items-center rounded-lg border border-gray-200 bg-white">
                          <button
                            type="button"
                            onClick={() => void capNhatSoLuong(item, item.so_luong - 1)}
                            disabled={item.so_luong <= 1 || chiTietDangCapNhat.includes(item.id)}
                            aria-label={`Giảm số lượng ${item.ten_san_pham}`}
                            className="flex h-9 w-9 items-center justify-center rounded-l-lg text-lg font-semibold text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>
                          <span className="min-w-10 px-2 text-center text-sm font-bold" aria-live="polite">
                            {item.so_luong}
                          </span>
                          <button
                            type="button"
                            onClick={() => void capNhatSoLuong(item, item.so_luong + 1)}
                            disabled={chiTietDangCapNhat.includes(item.id)}
                            aria-label={`Tăng số lượng ${item.ten_san_pham}`}
                            className="flex h-9 w-9 items-center justify-center rounded-r-lg text-lg font-semibold text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="shrink-0 text-right font-extrabold text-gray-900">
                        {dinhDangTien(item.thanh_tien)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-24">
              <h2 className="mb-5 text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>
              <div className="mb-4 flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span><span className="font-bold text-gray-900">{dinhDangTien(gioHang.tong_tien)}</span>
              </div>
              <div className="mb-4 flex justify-between text-sm text-emerald-700">
                <span>Phí giao hàng</span><span className="font-semibold">Miễn phí</span>
              </div>
              <div className="mb-5 flex justify-between border-t border-dashed border-gray-200 pt-4 font-extrabold text-gray-900">
                <span>Tổng cộng</span><span className="text-emerald-700">{dinhDangTien(gioHang.tong_tien)}</span>
              </div>

              <Link
                href="/thanh-toan"
                className="block w-full rounded-xl bg-emerald-600 py-3.5 text-center font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              >
                Tiến hành thanh toán
              </Link>
              <Link href="/danh-muc" className="mt-4 block text-center text-sm font-semibold text-emerald-700 hover:underline">
                ← Tiếp tục mua sắm
              </Link>
              <p className="mt-5 border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
                Thanh toán an toàn · Giao hàng tận nơi
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}