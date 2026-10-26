'use client';

import React, { useState, useRef } from 'react';
import { useDanhGia } from '@/hooks/useDanhGia';

const isVideo = (url) => /\.(mp4|mov|webm)$/i.test(url);

export default function BinhLuanDanhGia({ sanPhamId }) {
  const {
    danhSach,
    tongSo,
    diemTrungBinh,
    dangTai,
    dangGui,
    loi,
    soSao,
    setSoSao,
    noiDung,
    setNoiDung,
    previews,
    themFile,
    xoaFile,
    guiDanhGia,
    locSao,
    setLocSao,
  } = useDanhGia(sanPhamId);

  const [hoverSao, setHoverSao] = useState(0);
  const fileInputRef = useRef(null);

  const handleChonFile = (e) => {
    if (e.target.files) {
      themFile(Array.from(e.target.files));
      e.target.value = ''; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const thanhCong = await guiDanhGia();
    if (thanhCong) {
      alert('Đã gửi đánh giá thành công!');
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-sm mt-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span>⭐</span> Đánh Giá & Nhận Xét
      </h2>

      {/* 1. THỐNG KÊ RATING & BỘ LỌC SAO */}
      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/80 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="text-center md:border-r border-emerald-200/60 md:pr-8 min-w-[150px]">
          <div className="text-4xl md:text-5xl font-black text-emerald-800">
            {diemTrungBinh} <span className="text-xl text-emerald-600 font-normal">/ 5</span>
          </div>
          <div className="flex justify-center text-amber-400 text-lg my-1">
            {'★'.repeat(Math.round(diemTrungBinh)) + '☆'.repeat(5 - Math.round(diemTrungBinh))}
          </div>
          <div className="text-xs text-gray-500 font-medium">({tongSo} lượt đánh giá)</div>
        </div>

        <div className="flex-1 w-full">
          <div className="text-xs font-semibold text-gray-600 mb-2">Lọc theo số sao:</div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setLocSao(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                locSao === null
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              Tất cả ({tongSo})
            </button>
            {[5, 4, 3, 2, 1].map((sao) => (
              <button
                key={sao}
                type="button"
                onClick={() => setLocSao(sao)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  locSao === sao
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {sao} ★
              </button>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-50/70 rounded-2xl p-5 border mb-8 space-y-4">
        <h3 className="text-sm font-bold text-gray-800">Viết nhận xét của bạn</h3>

        {/* Rating tương tác */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-600">Đánh giá chung:</span>
          <div className="flex text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => setHoverSao(star)}
                onMouseLeave={() => setHoverSao(0)}
                onClick={() => setSoSao(star)}
                className={`transition-colors select-none ${
                  star <= (hoverSao || soSao) ? 'text-amber-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          placeholder="Hãy chia sẻ cảm nhận về chất lượng nông sản tươi, độ ngọt, bao bì..."
          className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
        />

        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            multiple
            onChange={handleChonFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 bg-white border border-dashed border-emerald-600 text-emerald-800 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition inline-flex items-center gap-1.5"
          >
            <span>📷</span> Thêm ảnh / video (tối đa 5 tệp)
          </button>
        </div>

        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2.5">
            {previews.map((item, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border bg-black group">
                {item.isVideo ? (
                  <video src={item.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.url} alt="preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => xoaFile(idx)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {loi && <p className="text-red-600 text-xs">{loi}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={dangGui}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {dangGui ? 'Đang gửi...' : 'Gửi Đánh Giá'}
          </button>
        </div>
      </form>

      {dangTai ? (
        <div className="py-8 text-center text-xs text-gray-500">Đang tải danh sách đánh giá...</div>
      ) : danhSach.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">Chưa có đánh giá nào cho sản phẩm này.</div>
      ) : (
        <div className="space-y-4">
          {danhSach.map((item) => (
            <div key={item.id} className="p-4 border-b border-gray-100 last:border-none flex gap-3">
              {/* Avatar người dùng */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0">
                {item.nguoi_dung?.anh_dai_dien ? (
                  <img
                    src={item.nguoi_dung.anh_dai_dien}
                    alt={item.nguoi_dung.ho_ten}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-emerald-800 font-bold text-sm">
                    {item.nguoi_dung?.ho_ten?.charAt(0) || 'U'}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-800">{item.nguoi_dung?.ho_ten}</span>
                  <span className="text-xs text-gray-400">• {item.ngay_tao}</span>
                </div>

                <div className="text-amber-400 text-xs my-1">
                  {'★'.repeat(item.so_sao) + '☆'.repeat(5 - item.so_sao)}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-3">{item.noi_dung}</p>

                {Array.isArray(item.tep_dinh_kem) && item.tep_dinh_kem.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.tep_dinh_kem.map((url, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border bg-black/5 max-w-[140px] max-h-[140px]">
                        {isVideo(url) ? (
                          <video src={url} controls className="w-full h-full max-h-[140px] object-cover" />
                        ) : (
                          <img
                            src={url}
                            alt="Ảnh nhận xét"
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                            onClick={() => window.open(url, '_blank')}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}