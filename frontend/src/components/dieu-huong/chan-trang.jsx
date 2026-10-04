'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ChanTrang() {
  const pathname = usePathname();

  // Trang quản trị có giao diện riêng, ẩn footer của cửa hàng
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-emerald-900 text-white mt-16 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cột 1: Thông tin thương hiệu */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl tracking-wide">NôngSảnTươi</span>
          </div>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Chuyên cung cấp các sản phẩm rau củ quả, thực phẩm tươi sạch đạt chuẩn hữu cơ VietGAP/GlobalGAP cho gia đình bạn.
          </p>
        </div>

        {/* Cột 2: Điều hướng nhanh */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-emerald-200">Liên Kết Nhanh</h3>
          <ul className="space-y-2 text-sm text-emerald-100">
            <li><Link href="/" className="hover:underline">Trang chủ</Link></li>
            <li><Link href="/danh-muc" className="hover:underline">Danh mục sản phẩm</Link></li>
            <li><Link href="/gioi-thieu" className="hover:underline">Giới thiệu cửa hàng</Link></li>
            <li><Link href="/bai-viet" className="hover:underline">Bài viết & Tin tức</Link></li>
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h3 className="font-bold text-lg mb-3 text-emerald-200">Thông Tin Liên Hệ</h3>
          <p className="text-sm text-emerald-100 mb-1">📍 Địa chỉ: Nông sản sạch Đà Lạt / TP.HCM</p>
          <p className="text-sm text-emerald-100 mb-1">📞 Hotline: 1900 1234</p>
          <p className="text-sm text-emerald-100">✉️ Email: lienhe@nongsantutoi.vn</p>
        </div>
      </div>

      <div className="bg-emerald-950 py-4 text-center text-xs text-emerald-300">
        © 2026 Nông Sản Tươi. Bản quyền thuộc về Cửa Hàng Nông Sản.
      </div>
    </footer>
  );
}