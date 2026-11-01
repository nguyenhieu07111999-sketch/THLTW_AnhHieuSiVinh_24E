'use client';

import React from 'react';
import { useAdminMenu } from '@/hooks/useAdminMenu';

export default function QuanLyMenuPage() {
  const {
    danhSachMenu,
    toanBoMenuCha,
    nguonLienKet,
    dangTai,
    dangLuu,
    locViTri,
    setLocViTri,
    moModal,
    setMoModal,
    formData,
    setFormData,
    thongBaoLoi,
    handleMoThemMoi,
    handleMoChinhSua,
    handleLuu,
    handleXoa,
  } = useAdminMenu();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Tiêu đề & Công cụ trên cùng */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản Lý Menu Động</h1>
          <p className="text-xs text-gray-500 mt-1">
            Tùy biến thanh điều hướng Header, Footer liên kết tự động với Danh mục và Bài viết
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Lọc vị trí */}
          <select
            value={locViTri}
            onChange={(e) => setLocViTri(e.target.value)}
            className="border border-gray-200 text-xs font-semibold px-3 py-2.5 rounded-xl bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">Tất cả vị trí</option>
            <option value="header">Header (Menu Chính)</option>
            <option value="footer_chinh_sach">Footer (Chính sách)</option>
            <option value="footer_lien_ket">Footer (Liên kết nhanh)</option>
          </select>

          <button
            onClick={() => handleMoThemMoi()}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm whitespace-nowrap"
          >
            <span>+</span> Thêm Menu Gốc
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu Menu */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {dangTai ? (
          <div className="py-20 text-center text-xs text-gray-400">Đang tải cấu trúc menu...</div>
        ) : danhSachMenu.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-400">Chưa có mục menu nào ở vị trí này.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Thứ tự</th>
                  <th className="py-3.5 px-4 font-bold">Tên hiển thị</th>
                  <th className="py-3.5 px-4 font-bold">Vị trí</th>
                  <th className="py-3.5 px-4 font-bold">Loại liên kết</th>
                  <th className="py-3.5 px-4 font-bold">URL đích</th>
                  <th className="py-3.5 px-4 font-bold text-center">Trạng thái</th>
                  <th className="py-3.5 px-4 font-bold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {danhSachMenu.map((parent) => (
                  <React.Fragment key={parent.id}>
                    {/* Hàng Menu Cha */}
                    <tr className="hover:bg-gray-50/60 font-semibold bg-gray-50/20">
                      <td className="py-3 px-4 font-mono text-gray-400">{parent.thu_tu}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5">
                          {parent.icon && <span>{parent.icon}</span>}
                          <span className="text-gray-900 font-bold">{parent.ten}</span>
                          {parent.children?.length > 0 && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                              {parent.children.length} con
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                          {parent.vi_tri}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize text-gray-500">{parent.loai_lien_ket}</td>
                      <td className="py-3 px-4 font-mono text-emerald-600 max-w-[200px] truncate">
                        {parent.url}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          parent.trang_thai ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {parent.trang_thai ? 'Hiển thị' : 'Đang ẩn'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleMoThemMoi(parent.id, parent.vi_tri)}
                          title="Thêm mục con"
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px]"
                        >
                          + Con
                        </button>
                        <button
                          onClick={() => handleMoChinhSua(parent)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px]"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleXoa(parent.id, parent.ten)}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[11px]"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>

                    {/* Hàng Menu Con (Submenu cấp 2) */}
                    {parent.children?.map((child) => (
                      <tr key={child.id} className="hover:bg-gray-50/40 text-gray-600">
                        <td className="py-2.5 px-4 font-mono text-gray-400 pl-8">↳ {child.thu_tu}</td>
                        <td className="py-2.5 px-4 pl-8">
                          <span className="inline-flex items-center gap-1.5 text-gray-700">
                            {child.icon && <span>{child.icon}</span>}
                            <span>{child.ten}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-gray-400 text-[11px]">{child.vi_tri}</td>
                        <td className="py-2.5 px-4 capitalize text-gray-400">{child.loai_lien_ket}</td>
                        <td className="py-2.5 px-4 font-mono text-emerald-600/80 max-w-[200px] truncate">
                          {child.url}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            child.trang_thai ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {child.trang_thai ? 'Hiển thị' : 'Đang ẩn'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleMoChinhSua(child)}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-[11px]"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleXoa(child.id, child.ten)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[11px]"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL THÊM / SỬA MENU */}
      {moModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-gray-800">
                {formData.id ? 'Chỉnh Sửa Mục Menu' : 'Thêm Mục Menu Mới'}
              </h2>
              <button
                onClick={() => setMoModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {thongBaoLoi && (
              <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-xl">
                {thongBaoLoi}
              </div>
            )}

            <form onSubmit={handleLuu} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Vị trí menu */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vị trí hiển thị *</label>
                  <select
                    value={formData.vi_tri}
                    onChange={(e) => setFormData({ ...formData, vi_tri: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  >
                    <option value="header">Header (Menu Chính)</option>
                    <option value="footer_chinh_sach">Footer (Chính sách)</option>
                    <option value="footer_lien_ket">Footer (Liên kết nhanh)</option>
                  </select>
                </div>

                {/* Menu cha */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Menu Cha</label>
                  <select
                    value={formData.parent_id}
                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">-- Là Menu Cấp 1 (Gốc) --</option>
                    {toanBoMenuCha
                      .filter((m) => m.id !== formData.id && m.vi_tri === formData.vi_tri)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.ten}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Tên và Icon */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tên mục menu *</label>
                  <input
                    type="text"
                    placeholder="VD: Rau củ quả, Giới thiệu..."
                    value={formData.ten}
                    onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Icon / Emoji</label>
                  <input
                    type="text"
                    placeholder="VD: 🥦 hoặc 📦"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Loại liên kết */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Loại liên kết *</label>
                <select
                  value={formData.loai_lien_ket}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loai_lien_ket: e.target.value,
                      lien_ket_id: '',
                    })
                  }
                  className="w-full border border-gray-200 p-2 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="tuy_chinh">🔗 Đường dẫn tùy chỉnh (URL)</option>
                  <option value="danh_muc">📁 Trỏ tới Danh Mục Sản Phẩm</option>
                  <option value="chu_de_bai_viet">📑 Trỏ tới Chủ Đề Bài Viết</option>
                  <option value="bai_viet">📄 Trỏ tới Bài Viết cụ thể</option>
                </select>
              </div>

              {/* Chọn nguồn tùy theo loại liên kết */}
              {formData.loai_lien_ket === 'tuy_chinh' ? (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Đường dẫn URL *</label>
                  <input
                    type="text"
                    placeholder="VD: /gioi-thieu, /khuyen-mai hoặc https://..."
                    value={formData.duong_dan_tuy_chinh}
                    onChange={(e) => setFormData({ ...formData, duong_dan_tuy_chinh: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Chọn nội dung liên kết *</label>
                  <select
                    value={formData.lien_ket_id}
                    onChange={(e) => setFormData({ ...formData, lien_ket_id: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    required
                  >
                    <option value="">-- Vui lòng chọn mục liên kết --</option>
                    {formData.loai_lien_ket === 'danh_muc' &&
                      nguonLienKet.danh_muc?.map((dm) => (
                        <option key={dm.id} value={dm.id}>
                          {dm.ten} (/danh-muc/{dm.slug})
                        </option>
                      ))}
                    {formData.loai_lien_ket === 'chu_de_bai_viet' &&
                      nguonLienKet.chu_de?.map((cd) => (
                        <option key={cd.id} value={cd.id}>
                          {cd.ten} (/chu-de/{cd.slug})
                        </option>
                      ))}
                    {formData.loai_lien_ket === 'bai_viet' &&
                      nguonLienKet.bai_viet?.map((bv) => (
                        <option key={bv.id} value={bv.id}>
                          {bv.ten} (/bai-viet/{bv.slug})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Thứ tự & Mở tab mới */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Thứ tự hiển thị</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.thu_tu}
                    onChange={(e) => setFormData({ ...formData, thu_tu: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Mở liên kết</label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                    className="w-full border border-gray-200 p-2 rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="_self">Cùng trang hiện tại (_self)</option>
                    <option value="_blank">Mở tab trình duyệt mới (_blank)</option>
                  </select>
                </div>
              </div>

              {/* Trạng thái hiển thị */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="trang_thai"
                  checked={formData.trang_thai}
                  onChange={(e) => setFormData({ ...formData, trang_thai: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor="trang_thai" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Kích hoạt hiển thị mục menu này ra ngoài website
                </label>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setMoModal(false)}
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={dangLuu}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50"
                >
                  {dangLuu ? 'Đang lưu...' : formData.id ? 'Lưu Thay Đổi' : 'Tạo Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}