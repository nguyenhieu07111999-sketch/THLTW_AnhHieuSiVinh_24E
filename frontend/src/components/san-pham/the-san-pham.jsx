'use client';

import { useRouter } from 'next/navigation';

export default function TheSanPham({ sp, type = 'normal' }) {
  const router = useRouter();

  // Kiểm tra điều kiện giảm giá an toàn
  const giaGiamNum = Number(sp.gia_giam);
  const giaBanNum = Number(sp.gia_ban);
  const coGiamGia = sp.gia_giam !== null && sp.gia_giam !== '' && giaGiamNum > 0 && giaGiamNum < giaBanNum;

  // Cấu hình giao diện linh hoạt theo loại card
  const isPromotion = type === 'promotion';
  const borderColor = isPromotion ? 'border-rose-100' : 'border-emerald-100';
  const btnBg = isPromotion ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700';

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
        onClick={(e) => {
          e.stopPropagation();
          router.push('/gio-hang');
        }}
        className={`w-full mt-3 ${btnBg} text-white text-xs font-semibold py-2 rounded-lg transition-colors`}
      >
        {isPromotion ? 'Săn ngay' : 'Thêm vào giỏ'}
      </button>
    </div>
  );
}