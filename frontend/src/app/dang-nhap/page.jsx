'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dichVuXacThuc } from '@/services/dich-vu-xac-thuc';

export default function TrangXacThuc() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form Đăng nhập
  const [loginData, setLoginData] = useState({
    email: '',
    mat_khau: '',
  });

  // Form Đăng ký
  const [registerData, setRegisterData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: '',
    mat_khau: '',
    xac_nhan_mat_khau: '',
  });

  // Xử lý Submit Đăng Nhập
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await dichVuXacThuc.dangNhap(loginData);
      
      // 1. Lưu Access Token
      localStorage.setItem('access_token', response.access_token);
      
      // 2. Lưu thông tin User (chứa trường ho_ten từ DB)
      // Lưu ý: response.data là dữ liệu trả về từ TaiKhoanNguoiDungResource
      if (response.data) {
        localStorage.setItem('user_info', JSON.stringify(response.data));
      }

      alert(response.message || 'Đăng nhập thành công!');
      
      // Bắn event để Header nhận biết trạng thái đăng nhập thay đổi lập tức
      window.dispatchEvent(new Event('storage'));
      
      router.push('/'); // Điều hướng về trang chủ
    } catch (err) {
      setErrorMessage(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý Submit Đăng Ký
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerData.mat_khau !== registerData.xac_nhan_mat_khau) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    setLoading(true);

    // Payload gửi sang Laravel
    const payload = {
      ho_ten: registerData.ho_ten,
      email: registerData.email,
      so_dien_thoai: registerData.so_dien_thoai,
      dia_chi: registerData.dia_chi,
      mat_khau: registerData.mat_khau,
    };

    try {
      const response = await dichVuXacThuc.dangKy(payload);
      
      // Lưu Token sau khi Đăng ký thành công
      localStorage.setItem('access_token', response.access_token);
      
      alert(response.message || 'Đăng ký tài khoản thành công!');
      setIsLogin(true); // Chuyển về tab Đăng nhập
    } catch (err) {
      // Xử lý lỗi validation từ Request Laravel (RegisterNguoiDungRequest)
      if (err.errors) {
        const firstError = Object.values(err.errors)[0][0];
        setErrorMessage(firstError);
      } else {
        setErrorMessage(err.message || 'Đăng ký thất bại!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl w-full max-w-lg">
        
        {/* Toggle Switcher */}
        <div className="flex bg-emerald-50 p-1.5 rounded-2xl mb-6 border border-emerald-100">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              isLogin ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-600'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMessage(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-emerald-800 shadow-sm' : 'text-emerald-600'
            }`}
          >
            Đăng Ký Tài Khoản
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-800">
            {isLogin ? 'Chào Mừng Trở Lại' : 'Tạo Tài Khoản Mới'}
          </h2>
        </div>

        {/* FORM ĐĂNG NHẬP */}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="example@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                value={loginData.mat_khau}
                onChange={(e) => setLoginData({ ...loginData, mat_khau: e.target.value })}
                className="w-full px-4 py-2.5 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-200 text-sm mt-2 disabled:bg-gray-400"
            >
              {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>
          </form>
        ) : (
          /* FORM ĐĂNG KÝ */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={registerData.ho_ten}
                onChange={(e) => setRegisterData({ ...registerData, ho_ten: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  placeholder="name@domain.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={registerData.so_dien_thoai}
                  onChange={(e) => setRegisterData({ ...registerData, so_dien_thoai: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ giao hàng</label>
              <input
                type="text"
                value={registerData.dia_chi}
                onChange={(e) => setRegisterData({ ...registerData, dia_chi: e.target.value })}
                className="w-full px-4 py-2 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                placeholder="TP. Hồ Chí Minh"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={registerData.mat_khau}
                  onChange={(e) => setRegisterData({ ...registerData, mat_khau: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={registerData.xac_nhan_mat_khau}
                  onChange={(e) => setRegisterData({ ...registerData, xac_nhan_mat_khau: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-200 text-sm mt-2 disabled:bg-gray-400"
            >
              {loading ? 'Đang tạo...' : 'Tạo Tài Khoản'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}