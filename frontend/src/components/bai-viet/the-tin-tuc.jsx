'use client';

import { useRouter } from 'next/navigation';

export default function TheTinTuc({ baiViet }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/bai-viet/${baiViet.id}`)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="h-44 bg-slate-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          <img
            src={baiViet.hinh_anh || '/placeholder.png'}
            alt={baiViet.tieu_de}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {baiViet.danh_muc?.ten_danh_muc || 'Mẹo hay'}
          </span>
          <span className="text-xs text-gray-400">
            {baiViet.created_at ? new Date(baiViet.created_at).toLocaleDateString('vi-VN') : ''}
          </span>
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {baiViet.tieu_de}
        </h3>
        <p className="text-gray-600 text-xs line-clamp-3 mb-4">{baiViet.mo_ta_ngan}</p>
      </div>

      <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
        Đọc tiếp &rarr;
      </span>
    </div>
  );
}