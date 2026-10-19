'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const KEY_TOKEN = 'access_token';
const KEY_USER = 'user_info';

const XacThucContext = createContext(null);

function docUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY_USER));
  } catch {
    return null;
  }
}

export function XacThucProvider({ children }) {
  const [user, setUser] = useState(null);
  const [daSanSang, setDaSanSang] = useState(false); // đã đọc xong localStorage ở trình duyệt

  useEffect(() => {
    setUser(docUser());
    setDaSanSang(true);

    // Đồng bộ khi đăng nhập/đăng xuất ở tab khác
    const onStorage = (e) => {
      if (e.key === null || e.key === KEY_USER || e.key === KEY_TOKEN) setUser(docUser());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const dangNhap = useCallback((token, userInfo) => {
    localStorage.setItem(KEY_TOKEN, token);
    localStorage.setItem(KEY_USER, JSON.stringify(userInfo));
    setUser(userInfo);
  }, []);

  const dangXuat = useCallback(() => {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
    setUser(null);
  }, []);

  const capNhatUser = useCallback((phan) => {
    setUser((cu) => {
      const moi = { ...cu, ...phan };
      localStorage.setItem(KEY_USER, JSON.stringify(moi));
      return moi;
    });
  }, []);

  const value = useMemo(
    () => ({ user, daSanSang, dangNhap, dangXuat, capNhatUser }),
    [user, daSanSang, dangNhap, dangXuat, capNhatUser]
  );

  return <XacThucContext.Provider value={value}>{children}</XacThucContext.Provider>;
}

export function useXacThuc() {
  const ctx = useContext(XacThucContext);
  if (!ctx) throw new Error('useXacThuc phải được dùng bên trong <XacThucProvider>');
  return ctx;
}