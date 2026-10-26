'use client';

import React from 'react';

export default function FormCauHinhRules({ rules, setRules, onLuuRules, dangLuuRules }) {
  return (
    <form onSubmit={onLuuRules} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-gray-800">Cấu Hình Quy Tắc Tự Động (Auto-Moderation)</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Hệ thống sẽ áp dụng quy tắc này ngay khi khách hàng gửi nhận xét lên máy chủ.
        </p>
      </div>

      {/* Từ cấm */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Danh sách từ cấm / Nhạy cảm (cách nhau bởi dấu phẩy):
        </label>
        <textarea
          rows={4}
          value={rules.tu_cam}
          onChange={(e) => setRules({ ...rules, tu_cam: e.target.value })}
          placeholder="ví dụ: lua dao, hang gia, hu hong, kem chat luong, do deu..."
          className="w-full border border-gray-200 p-3 rounded-2xl text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-gray-50/50"
        />
        <p className="text-[11px] text-gray-400 mt-1">
          Bình luận có chứa bất kỳ từ nào ở trên sẽ bị tự động đặt trạng thái <strong>&quot;Đã ẩn&quot;</strong> để chờ Admin duyệt thủ công.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Tự động ẩn nếu số sao đánh giá:
          </label>
          <select
            value={rules.tu_dong_an_duoi_sao}
            onChange={(e) => setRules({ ...rules, tu_dong_an_duoi_sao: Number(e.target.value) })}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value={0}>Không ẩn tự động (Duyệt bình thường)</option>
            <option value={1}>Chỉ 1 sao (Ẩn để liên hệ xử lý sự cố)</option>
            <option value={2}>Từ 2 sao trở xuống (&le; 2 sao)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">
            Số tệp media tối đa cho phép mỗi đánh giá:
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={rules.max_files}
            onChange={(e) => setRules({ ...rules, max_files: Number(e.target.value) })}
            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          type="checkbox"
          id="cho_phep_video"
          checked={rules.cho_phep_video}
          onChange={(e) => setRules({ ...rules, cho_phep_video: e.target.checked })}
          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
        />
        <label htmlFor="cho_phep_video" className="text-xs font-semibold text-gray-700 cursor-pointer">
          Cho phép khách hàng đính kèm video ngắn (.mp4, .mov tối đa 20MB)
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={dangLuuRules}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
        >
          {dangLuuRules ? 'Đang lưu cấu hình...' : 'Lưu Quy Tắc Kiểm Duyệt'}
        </button>
      </div>
    </form>
  );
}