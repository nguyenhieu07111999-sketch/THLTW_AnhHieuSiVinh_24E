'use client';

import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const GOC_BACKEND = API.replace(/\/api\/?$/, '');

// Hàm chuẩn hóa URL ảnh từ backend storage
const layUrlAnh = (p) => {
  if (!p) return '/placeholder.png';
  if (/^(https?:|data:)/.test(p)) return p;
  const cleanPath = p.replace(/^\/+/, '');
  if (cleanPath.startsWith('storage/')) {
    return `${GOC_BACKEND}/${cleanPath}`;
  }
  return `${GOC_BACKEND}/storage/${cleanPath}`;
};

export default function TheTinTuc({ baiViet }) {
  const router = useRouter();

  // Đồng bộ trường ảnh đại diện
  const duongDanAnh = baiViet?.anh_dai_dien || baiViet?.hinh_anh || baiViet?.anh_bia;
  
  // Đồng bộ trường tóm tắt / mô tả
  const moTa = baiViet?.tom_tat || baiViet?.mo_ta_ngan;

  // Đồng bộ trường thời gian tạo
  const thoiGianTao = baiViet?.ngay_tao || baiViet?.created_at;

  return (
    <div
      onClick={() => router.push(`/bai-viet/${baiViet.id}`)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="h-44 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          <img
            src={layUrlAnh(duongDanAnh)}
            alt={baiViet.tieu_de}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png';
            }}
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {baiViet.chu_de?.ten_chu_de || baiViet.danh_muc?.ten_danh_muc || 'Mẹo hay'}
          </span>
          <span className="text-xs text-gray-400">
            {thoiGianTao ? new Date(thoiGianTao).toLocaleDateString('vi-VN') : ''}
          </span>
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {baiViet.tieu_de}
        </h3>
        {moTa && (
          <p className="text-gray-600 text-xs line-clamp-3 mb-4">{moTa}</p>
        )}
      </div>

      <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
        Đọc tiếp &rarr;
      </span>
    </div>
  );
}