'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useDoiMatKhauOtp() {
  const [formData, setFormData] = useState({
    mat_khau_cu: '',
    mat_khau_moi: '',
    mat_khau_moi_confirmation: '',
    ma_otp: '',
  });

  const [demNguoc, setDemNguoc] = useState(0);
  const [dangGuiOtp, setDangGuiOtp] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [thongBao, setThongBao] = useState({ type: '', msg: '' });

  // Xử lý bộ đếm ngược 60s khi gửi OTP
  useEffect(() => {
    if (demNguoc > 0) {
      const timer = setTimeout(() => setDemNguoc((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [demNguoc]);

  // Hàm thay đổi giá trị từng ô input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 1. API Gửi mã OTP về Gmail
  const handleGuiOtp = async () => {
    setDangGuiOtp(true);
    setThongBao({ type: '', msg: '' });
    try {
      const res = await api.post('/tai-khoan/gui-otp-doi-mk');
      setDemNguoc(60);
      setThongBao({
        type: 'success',
        msg: res.data?.message || 'Mã OTP đã được gửi đến email của bạn!',
      });
    } catch (err) {
      setThongBao({
        type: 'error',
        msg: err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại!',
      });
    } finally {
      setDangGuiOtp(false);
    }
  };

  // 2. API Xác nhận và Đổi mật khẩu mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDangXuLy(true);
    setThongBao({ type: '', msg: '' });

    try {
      const res = await api.post('/tai-khoan/doi-mat-khau', formData);
      setThongBao({
        type: 'success',
        msg: res.data?.message || 'Đổi mật khẩu thành công!',
      });
      // Reset form sau khi đổi thành công
      setFormData({
        mat_khau_cu: '',
        mat_khau_moi: '',
        mat_khau_moi_confirmation: '',
        ma_otp: '',
      });
      setDemNguoc(0);
    } catch (err) {
      const errors = err.response?.data?.errors;
      const msg = errors
        ? Object.values(errors)[0][0]
        : err.response?.data?.message || 'Đổi mật khẩu thất bại!';
      setThongBao({ type: 'error', msg });
    } finally {
      setDangXuLy(false);
    }
  };

  return {
    formData,
    demNguoc,
    dangGuiOtp,
    dangXuLy,
    thongBao,
    handleChange,
    handleGuiOtp,
    handleSubmit,
  };
}