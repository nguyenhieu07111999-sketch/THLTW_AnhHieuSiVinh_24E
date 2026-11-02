'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { dichVuMenu } from '@/services/dichVuMenu';

const FOOTER_MAC_DINH = [
  { url: '/', ten: 'Trang chủ' },
  { url: '/danh-muc', ten: 'Danh mục sản phẩm' },
  { url: '/gioi-thieu', ten: 'Giới thiệu cửa hàng' },
  { url: '/bai-viet', ten: 'Bài viết & Tin tức' },
];

export default function ChanTrang() {
  const pathname = usePathname();
  const [links, setLinks] = useState(FOOTER_MAC_DINH);

  useEffect(() => {
    dichVuMenu
      .layMenuPublic?.('footer_lien_ket')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setLinks(data);
        }
      })
      .catch(() => {
        // Lỗi thì giữ FOOTER_MAC_DINH
      });
  }, []);

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="bg-emerald-900 text-white mt-16 border-t border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-2xl">🌱</span>
            <span className="font-bold text-xl tracking-wide">NôngSảnTươi</span>
          </div>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Chuyên cung cấp các sản phẩm rau củ quả, thực phẩm tươi sạch đạt chuẩn hữu cơ VietGAP/GlobalGAP cho gia đình bạn.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3 text-emerald-200">Liên Kết Nhanh</h3>
          <ul className="space-y-2 text-sm text-emerald-100">
            {links.map((item) => (
              <li key={item.id || item.url}>
                <Link
                  href={item.url || item.duong_dan_tuy_chinh || '#'}
                  target={item.target || '_self'}
                  className="hover:underline hover:text-white transition-colors"
                >
                  {item.ten}
                </Link>
              </li>
            ))}
          </ul>
        </div>

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