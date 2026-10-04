'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function ThanhDieuHuong() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        try {
          return JSON.parse(userInfo);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        try {
          setUser(JSON.parse(userInfo));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    setUser(null);
    alert('Đã đăng xuất tài khoản!');
    router.push('/dang-nhap');
  };

  // Trang quản trị có thanh điều hướng riêng, ẩn header của cửa hàng
  if (pathname?.startsWith('/admin')) return null;

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
          <Link href="/" className="hover:text-emerald-600 transition-colors">Trang chủ</Link>
          <Link href="/danh-muc" className="hover:text-emerald-600 transition-colors">Danh mục</Link>
          <Link href="/gioi-thieu" className="hover:text-emerald-600 transition-colors">Giới thiệu</Link>
          <Link href="/bai-viet" className="hover:text-emerald-600 transition-colors">Bài viết</Link>
        </nav>

        {/* Nút hành động */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                👤 {user.ho_ten || 'Thành viên'}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-red-500 hover:text-red-700 underline transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Đăng nhập
            </Link>
          )}

          <Link href="/gio-hang" className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm">
            <span>🛒 Giỏ hàng</span>
          </Link>
        </div>
      </div>
    </header>
  );
}