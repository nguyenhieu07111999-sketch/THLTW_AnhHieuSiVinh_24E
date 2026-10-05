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
                  <option key={c.id} value={c.id}>{c.ten_danh_muc || c.ten}</option>
                ))}
              </select>
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
            </div>

            <div>
              <label className="block font-medium mb-1">Giá giảm</label>
              <input
                type="number"
                value={formData.gia_giam}
                onChange={(e) => setFormData({ ...formData, gia_giam: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
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
            </div>

            <div>
              <label className="block font-medium mb-1">Đơn vị tính</label>
              <input
                type="text"
                value={formData.don_vi_tinh}
                onChange={(e) => setFormData({ ...formData, don_vi_tinh: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
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