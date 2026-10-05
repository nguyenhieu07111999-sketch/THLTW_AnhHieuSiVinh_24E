'use client';

import React from 'react';

export default function FormDanhMucModal({
  isModalOpen,
  setIsModalOpen,
  editingId,
  formData,
  setFormData,
  errors = {},
  handleSubmit,
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-bold text-gray-800">
            {editingId ? '✏️ Chỉnh Sửa Danh Mục' : '➕ Thêm Danh Mục Mới'}
          </h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Tên danh mục */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Rau củ tươi sạch, Trái cây nhiệt đới..."
              value={formData.ten_danh_muc}
              onChange={(e) =>
                setFormData({ ...formData, ten_danh_muc: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
            />
            {errors.ten_danh_muc && (
              <p className="text-red-500 text-xs mt-1">{errors.ten_danh_muc[0]}</p>
            )}
          </div>

          {/* Đường dẫn Slug */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Đường dẫn (Slug)
            </label>
            <input
              type="text"
              placeholder="Để trống hệ thống sẽ tự động tạo từ tên danh mục"
              value={formData.duong_dan_dm || ''}
              onChange={(e) =>
                setFormData({ ...formData, duong_dan_dm: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300 font-mono text-xs"
            />
            {errors.duong_dan_dm && (
              <p className="text-red-500 text-xs mt-1">{errors.duong_dan_dm[0]}</p>
            )}
          </div>

          {/* URL Hình ảnh */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              URL Hình ảnh
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="https://example.com/image.jpg hoặc /images/..."
                value={formData.hinh_anh || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hinh_anh: e.target.value })
                }
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
              />
              {formData.hinh_anh && (
                <div className="w-10 h-10 rounded-lg border overflow-hidden  bg-gray-50 flex items-center justify-center">
                  {/* <img
                    src={formData.hinh_anh}
                    alt="Xem trước"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  /> */}
                </div>
              )}
            </div>
            {errors.hinh_anh && (
              <p className="text-red-500 text-xs mt-1">{errors.hinh_anh[0]}</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">
              Mô tả danh mục
            </label>
            <textarea
              rows={3}
              placeholder="Nhập mô tả ngắn gọn về danh mục..."
              value={formData.mo_ta || ''}
              onChange={(e) =>
                setFormData({ ...formData, mo_ta: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 border-gray-300"
            />
            {errors.mo_ta && (
              <p className="text-red-500 text-xs mt-1">{errors.mo_ta[0]}</p>
            )}
          </div>

          {/* Nổi bật (sp_noi_bat) */}
          <div className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, sp_noi_bat: !formData.sp_noi_bat })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                formData.sp_noi_bat ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.sp_noi_bat ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div>
              <span className="font-semibold text-gray-800 text-sm">
                Danh mục nổi bật
              </span>
              <p className="text-xs text-gray-500">
                Hiển thị danh mục này tại các khu vực ưu tiên ngoài trang chủ
              </p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm cursor-pointer"
            >
              {editingId ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
