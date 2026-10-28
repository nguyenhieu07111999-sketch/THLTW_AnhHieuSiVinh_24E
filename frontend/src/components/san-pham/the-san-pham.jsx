'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { themVaoGio } from '@/services/dich-vu-gio-hang';

export default function TheSanPham({ sp, type = 'normal' }) {
  const router = useRouter();
  const [dangThemVaoGio, setDangThemVaoGio] = useState(false);
  const [loiThemVaoGio, setLoiThemVaoGio] = useState('');

  const giaGiamNum = Number(sp.gia_giam);
  const giaBanNum = Number(sp.gia_ban);
  const coGiamGia = sp.gia_giam !== null && sp.gia_giam !== '' && giaGiamNum > 0 && giaGiamNum < giaBanNum;

  const isPromotion = type === 'promotion';
  const borderColor = isPromotion ? 'border-rose-100' : 'border-emerald-100';
  const btnBg = isPromotion ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700';

  const handleThemVaoGio = async (e) => {
    e.stopPropagation();
    setLoiThemVaoGio('');

    if (!localStorage.getItem('access_token')) {
      router.push(`/dang-nhap?redirect=${encodeURIComponent(`/danh-muc/${sp.id}`)}`);
      return;
    }

    setDangThemVaoGio(true);
    try {
      await themVaoGio(sp.id);
      router.push('/gio-hang');
    } catch (error) {
      const errors = error.response?.data?.errors;
      setLoiThemVaoGio(
        errors
          ? Object.values(errors).flat().join(' | ')
          : error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ. Vui lòng thử lại.'
      );
    } finally {
      setDangThemVaoGio(false);
    }
  };

  return (
    <div
      onClick={() => router.push(`/danh-muc/${sp.id}`)}
      className={`relative bg-white rounded-2xl p-4 border ${borderColor} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
    >
      {/* Nhãn giảm giá */}
      {coGiamGia && isPromotion && (
        <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
          Giảm giá
        </span>
      )}

      <div className={`h-40 ${isPromotion ? 'bg-rose-50/50' : 'bg-emerald-50'} rounded-xl mb-3 flex items-center justify-center overflow-hidden`}>
        <img
          src={sp.hinh_anh || '/placeholder.png'}
          alt={sp.ten_san_pham}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{sp.ten_san_pham}</h3>

      {/* Khu vực hiển thị giá và số lượng đã bán */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isPromotion ? 'text-rose-600' : 'text-emerald-600'} font-bold`}>
            {Number(coGiamGia ? sp.gia_giam : sp.gia_ban).toLocaleString()}đ
          </span>
          {coGiamGia && (
            <span className="text-xs text-gray-400 line-through">
              {giaBanNum.toLocaleString()}đ
            </span>
          )}
        </div>
        
        {sp.da_ban && (
          <span className="text-xs text-gray-500 font-medium">Đã bán: {sp.da_ban}</span>
        )}
      </div>

      <button
        onClick={handleThemVaoGio}
        disabled={dangThemVaoGio}
        className={`w-full mt-3 ${btnBg} text-white text-xs font-semibold py-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {dangThemVaoGio ? 'Đang thêm...' : isPromotion ? 'Săn ngay' : 'Thêm vào giỏ'}
      </button>
      {loiThemVaoGio && <p className="mt-2 text-xs text-red-600" role="alert">{loiThemVaoGio}</p>}
    </div>
  );
}