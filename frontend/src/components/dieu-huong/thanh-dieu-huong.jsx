'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useXacThuc } from '@/context/xac-thuc-context';
import { dichVuXacThuc } from '@/services/dich-vu-xac-thuc';

const MENU = [
  { href: '/', nhan: 'Trang chủ' },
  { href: '/danh-muc', nhan: 'Danh mục' },
  { href: '/gioi-thieu', nhan: 'Giới thiệu' },
  { href: '/bai-viet', nhan: 'Bài viết' },
];

export default function ThanhDieuHuong() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, daSanSang, dangXuat } = useXacThuc();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài hoặc nhấn Esc
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    try {
      await dichVuXacThuc.dangXuat(); // Thu hồi token ở server Laravel
    } catch {
      // Token lỗi/hết hạn thì bỏ qua, vẫn tiến hành xóa session ở trình duyệt
    }
    dangXuat();
    router.push('/dang-nhap');
  };

  // Trang quản trị có thanh điều hướng riêng, ẩn header cửa hàng
  if (pathname?.startsWith('/admin')) return null;

  const itemCls =
    'block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors';

  return (
    <header className="bg-white border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🌱</span>
          <span className="font-bold text-xl text-emerald-800 tracking-wide">NôngSảnTươi</span>
        </Link>

        {/* Menu Điều hướng */}
        <nav className="hidden md:flex space-x-8 font-medium text-sm text-gray-700">
          {MENU.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className={`hover:text-emerald-600 transition-colors ${pathname === m.href ? 'text-emerald-700 font-semibold' : ''
                }`}
            >
              {m.nhan}
            </Link>
          ))}
        </nav>

        {/* Nút hành động */}
        <div className="flex items-center space-x-4">
          {!daSanSang ? (
            <div className="w-28 h-9 rounded-xl bg-gray-100 animate-pulse" /> // Giữ chỗ tránh nháy giao diện
          ) : user ? (
            /* Dropdown Profile */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="flex items-center space-x-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
              >
                <span className="max-w-[120px] truncate">👤 {user.ho_ten || 'Thành viên'}</span>
                <span className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 bg-white border border-emerald-100 rounded-2xl shadow-lg py-2 z-50 text-sm"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-bold text-gray-800 truncate">{user.ho_ten}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/ho-so"
                    role="menuitem"
                    className={itemCls}
                    onClick={() => setIsOpen(false)}
                  >
                    ⚙️ Hồ sơ của tôi
                  </Link>
                  <Link
                    href="/don-hang"
                    role="menuitem"
                    className={itemCls}
                    onClick={() => setIsOpen(false)}
                  >
                    📦 Đơn hàng của tôi
                  </Link>

                  <div className="border-t border-gray-100 my-1" />

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Đăng nhập
            </Link>
          )}

          <Link
            href="/gio-hang"
            className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>🛒 Giỏ hàng</span>
          </Link>
        </div>
      </div>
    </header>
  );
}