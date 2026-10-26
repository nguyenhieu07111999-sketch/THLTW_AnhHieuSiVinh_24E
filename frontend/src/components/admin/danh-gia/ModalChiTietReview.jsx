'use client';

import React from 'react';

const isVideo = (url) => /\.(mp4|mov|webm)$/i.test(url);

export default function ModalChiTietReview({
  spDangXem,
  dsReviewSp,
  dangTaiModal,
  locTrangThai,
  setLocTrangThai,
  locSoSao,
  setLocSoSao,
  onLocLai,
  onDongModal,
  onDoiTrangThai,
  onXoaReview,
  mediaPhongTo,
  setMediaPhongTo,
}) {
  if (!spDangXem) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="p-5 border-b flex items-center justify-between bg-emerald-50/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-emerald-100 flex-shrink-0">
                {spDangXem.hinh_anh ? (
                  <img src={spDangXem.hinh_anh} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">🥬</div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">{spDangXem.ten_san_pham}</h3>
                <span className="text-[11px] text-gray-400 font-mono">ID Sản phẩm: #{spDangXem.id}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onDongModal}
              className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 font-bold transition"
            >
              ✕
            </button>
          </div>

          {/* Bộ lọc trong modal */}
          <div className="px-6 py-3 border-b bg-gray-50 flex flex-wrap gap-3 items-center justify-between text-xs">
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-600">Trạng thái:</span>
              <select
                value={locTrangThai}
                onChange={(e) => {
                  setLocTrangThai(e.target.value);
                  onLocLai(spDangXem.id, e.target.value, locSoSao);
                }}
                className="border rounded-lg px-2.5 py-1 bg-white"
              >
                <option value="tat_ca">Tất cả</option>
                <option value="hien_thi">Đang hiển thị</option>
                <option value="an">Đã ẩn</option>
              </select>
            </div>

            <div className="flex gap-2 items-center">
              <span className="font-semibold text-gray-600">Lọc sao:</span>
              <select
                value={locSoSao}
                onChange={(e) => {
                  setLocSoSao(e.target.value);
                  onLocLai(spDangXem.id, locTrangThai, e.target.value);
                }}
                className="border rounded-lg px-2.5 py-1 bg-white"
              >
                <option value="">Tất cả sao</option>
                <option value="5">5 ★</option>
                <option value="4">4 ★</option>
                <option value="3">3 ★</option>
                <option value="2">2 ★</option>
                <option value="1">1 ★</option>
              </select>
            </div>
          </div>

          {/* Danh sách review */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {dangTaiModal ? (
              <div className="py-16 text-center text-xs text-gray-400">Đang tải danh sách reviews...</div>
            ) : dsReviewSp.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-400">
                Không tìm thấy review nào theo điều kiện lọc này.
              </div>
            ) : (
              dsReviewSp.map((r) => (
                <div key={r.id} className="p-4 border rounded-2xl bg-gray-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800">
                        {r.nguoi_dung?.ho_ten?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-gray-800">{r.nguoi_dung?.ho_ten}</div>
                        <span className="text-[10px] text-gray-400">{r.ngay_tao}</span>
                      </div>
                      <span className="text-amber-500 font-black text-xs ml-2">
                        {r.so_sao} ★
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDoiTrangThai(r.id)}
                        className={`px-3 py-1 text-xs font-bold rounded-xl border transition ${
                          r.trang_thai === 'an'
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {r.trang_thai === 'an' ? '🔒 Đã ẩn (Nhấn để hiện)' : '👁️ Đang hiện (Nhấn để ẩn)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onXoaReview(r.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Xóa vĩnh viễn"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed">{r.noi_dung}</p>

                  {/* Thumbnail media */}
                  {Array.isArray(r.tep_dinh_kem) && r.tep_dinh_kem.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {r.tep_dinh_kem.map((url, idx) => (
                        <div
                          key={idx}
                          onClick={() => setMediaPhongTo(url)}
                          className="w-16 h-16 rounded-xl overflow-hidden border bg-black/5 cursor-pointer relative group"
                        >
                          {isVideo(url) ? (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                              ▶ Video
                            </div>
                          ) : (
                            <img
                              src={url}
                              alt="review"
                              className="w-full h-full object-cover group-hover:scale-105 transition"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end bg-gray-50">
            <button
              type="button"
              onClick={onDongModal}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox phóng to ảnh / video */}
      {mediaPhongTo && (
        <div
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setMediaPhongTo(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-black" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMediaPhongTo(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center font-bold text-sm hover:bg-red-600 transition z-10"
            >
              ✕
            </button>
            {isVideo(mediaPhongTo) ? (
              <video src={mediaPhongTo} controls autoPlay className="max-w-full max-h-[85vh] object-contain" />
            ) : (
              <img src={mediaPhongTo} alt="Xem phóng to" className="max-w-full max-h-[85vh] object-contain" />
            )}
          </div>
        </div>
      )}
    </>
  );
}