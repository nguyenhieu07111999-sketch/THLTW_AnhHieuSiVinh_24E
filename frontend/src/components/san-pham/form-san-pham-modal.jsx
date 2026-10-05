// src/components/san-pham/form-san-pham-modal.jsx
'use client';

import React from 'react';

export default function FormSanPhamModal({
  isModalOpen,
  setIsModalOpen,
  editingId,
  formData,
  setFormData,
  categories,
  brands,
  errors,
  handleSubmit,
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-bold text-gray-800">
            {editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
          </h3>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-400 text-xl font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Tên sản phẩm *</label>
              <input
                type="text"
                required
                value={formData.ten_san_pham}
                onChange={(e) => setFormData({ ...formData, ten_san_pham: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.ten_san_pham && <p className="text-red-500 text-xs mt-1">{errors.ten_san_pham[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Danh mục *</label>
              <select
                required
                value={formData.danh_muc_id}
                onChange={(e) => setFormData({ ...formData, danh_muc_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ten_hien_thi || c.ten_danh_muc || c.ten}
                  </option>
                ))}
              </select>
              {errors.danh_muc_id && <p className="text-red-500 text-xs mt-1">{errors.danh_muc_id[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Thương hiệu</label>
              <select
                value={formData.thuong_hieu_id}
                onChange={(e) => setFormData({ ...formData, thuong_hieu_id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">-- Chọn thương hiệu --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.ten_thuong_hieu || b.ten}</option>
                ))}
              </select>
              {errors.thuong_hieu_id && <p className="text-red-500 text-xs mt-1">{errors.thuong_hieu_id[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Giá bán *</label>
              <input
                type="number"
                required
                value={formData.gia_ban}
                onChange={(e) => setFormData({ ...formData, gia_ban: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.gia_ban && <p className="text-red-500 text-xs mt-1">{errors.gia_ban[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Giá giảm</label>
              <input
                type="number"
                value={formData.gia_giam}
                onChange={(e) => setFormData({ ...formData, gia_giam: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.gia_giam && <p className="text-red-500 text-xs mt-1">{errors.gia_giam[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Số lượng tồn *</label>
              <input
                type="number"
                required
                value={formData.so_luong_ton_kho}
                onChange={(e) => setFormData({ ...formData, so_luong_ton_kho: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              {errors.so_luong_ton_kho && <p className="text-red-500 text-xs mt-1">{errors.so_luong_ton_kho[0]}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Đơn vị tính</label>
              <input
                type="text"
                value={formData.don_vi_tinh || ''}
                onChange={(e) => setFormData({ ...formData, don_vi_tinh: e.target.value })}
                placeholder="Kg, Hộp, Gói, Chai..."
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Hình ảnh sản phẩm {!editingId && '*'}</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required={!editingId}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (!file) {
                    setImagePreview(formData.hinh_anh || '');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => setImagePreview(String(reader.result || ''));
                  reader.readAsDataURL(file);
                }}
                className="w-full px-3 py-2 border rounded-lg file:mr-3 file:rounded file:border-0 file:bg-emerald-50 file:px-3 file:py-1 file:text-emerald-700"
              />
              <p className="text-xs text-gray-500 mt-1">Chọn ảnh JPG, PNG hoặc WEBP, dung lượng tối đa 5 MB.{editingId ? ' Để trống nếu muốn giữ ảnh hiện tại.' : ''}</p>
              {errors.hinh_anh && <p className="text-red-500 text-xs mt-1">{errors.hinh_anh[0]}</p>}
              {imageFile && <p className="text-xs text-gray-600 mt-1">Đã chọn: {imageFile.name}</p>}
              {imagePreview && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-gray-50 border rounded-lg">
                  <img
                    src={imagePreview}
                    alt="Xem trước hình ảnh"
                    className="w-16 h-16 object-cover rounded-lg border bg-white"
                  />
                  <span className="text-xs text-gray-500">Xem trước hình ảnh sản phẩm</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Mô tả ngắn</label>
              <textarea
                rows={2}
                value={formData.mo_ta_ngan || ''}
                onChange={(e) => setFormData({ ...formData, mo_ta_ngan: e.target.value })}
                placeholder="Mô tả ngắn về sản phẩm..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
              {editingId ? 'Cập Nhật' : 'Lưu Sản Phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}