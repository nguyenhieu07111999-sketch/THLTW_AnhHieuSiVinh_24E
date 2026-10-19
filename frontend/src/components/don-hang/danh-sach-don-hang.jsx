'use client';

import { useState } from 'react';
import Link from 'next/link';
import useDonHangCuaToi from '@/hooks/useDonHangCuaToi';
import { dinhDangTien, dinhDangNgay, thongTinTrangThai, maDonHang } from '@/utils/dinh-dang';

function TomTatSanPham({ chiTiet = [] }) {
  const dau = chiTiet[0];
  if (!dau) return null;
  const them = chiTiet.length - 1;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {dau.hinh_anh ? (
        <img
          src={dau.hinh_anh}
          alt=""
          loading="lazy"
          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-emerald-50 shrink-0" />
      )}
      <p className="text-sm text-gray-700 truncate">
        {dau.ten_san_pham} × {dau.so_luong}
        {them > 0 && <span className="text-gray-400"> +{them} sản phẩm khác</span>}
      </p>
    </div>
  );
}


export default function DanhSachDonHang({ gioiHan, trangThai, phanTrang = false }) {
  const [trang, setTrang] = useState(1);
  const { donHang, meta, dangTai, loi, taiLai } = useDonHangCuaToi({ gioiHan, trang, trangThai });

  if (dangTai) {
    return (
      <div className="space-y-3" aria-busy="true">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (loi) {
    return (
      <div className="text-center py-10 space-y-3 bg-red-50 rounded-2xl border border-red-100">
        <p className="text-red-600 text-sm">{loi}</p>
        <button onClick={taiLai} className="text-sm font-semibold text-emerald-700 underline">
          Thử lại
        </button>
      </div>
    );
  }

  if (donHang.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-emerald-100 text-gray-400 space-y-3">
        <p>{trangThai ? 'Không có đơn hàng nào ở trạng thái này.' : 'Bạn chưa có đơn hàng nào.'}</p>
        <Link href="/danh-muc" className="inline-block text-emerald-600 font-bold underline">
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="bg-white rounded-2xl border border-emerald-100 shadow-sm divide-y divide-gray-100 overflow-hidden">
        {donHang.map((dh) => {
          const tt = thongTinTrangThai(dh.trang_thai_don_hang);
          return (
            <li key={dh.id} className="p-5 space-y-3 hover:bg-emerald-50/40 transition-colors">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-emerald-800">{maDonHang(dh.id)}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${tt.cls}`}>{tt.nhan}</span>
                </div>
                <span className="text-xs text-gray-500">Ngày đặt: {dinhDangNgay(dh.ngay_tao)}</span>
              </div>

              <TomTatSanPham chiTiet={dh.chi_tiet} />

              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-700">{dinhDangTien(dh.thanh_tien)}</span>
                <Link
                  href={`/don-hang/${dh.id}`}
                  className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3.5 py-2 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  Chi tiết
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {phanTrang && meta && meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            onClick={() => setTrang((t) => t - 1)}
            disabled={trang <= 1}
            className="px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 disabled:opacity-40"
          >
            ← Trước
          </button>
          <span className="text-gray-600">
            Trang {meta.current_page}/{meta.last_page}
          </span>
          <button
            onClick={() => setTrang((t) => t + 1)}
            disabled={trang >= meta.last_page}
            className="px-4 py-2 rounded-xl border border-emerald-200 text-emerald-700 disabled:opacity-40"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}