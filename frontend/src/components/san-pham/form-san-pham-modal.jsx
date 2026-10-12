'use client';

import React from 'react';

function LoiTruong({ loi }) {
  const thongDiep = Array.isArray(loi) ? loi[0] : loi;
  return thongDiep ? <p className="mt-1 text-xs text-red-600">{thongDiep}</p> : null;
}

export default function FormSanPhamModal({
  moModal,
  dongModal,
  idDangSua,
  duLieuForm,
  setDuLieuForm,
  danhSachDanhMuc,
  danhSachThuongHieu,
  danhSachLoi,
  xuLyGuiForm,
  hinhAnhFile,
  setHinhAnhFile,
  dangLuu,
}) {
  if (!moModal) return null;

  const doiGiaTri = (e) => {
    const { name, value } = e.target;
    setDuLieuForm((prev) => ({ ...prev, [name]: value }));
  };

  const chonHinhAnh = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setHinhAnhFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setDuLieuForm((prev) => ({
        ...prev,
        hinh_anh: reader.result,
        hinh_anh_xem_truoc: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng biểu mẫu"
        className="absolute inset-0 cursor-default bg-black/40 backdrop-blur-sm"
        onClick={dongModal}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-gradient-to-r from-green-700 to-green-500 px-6 py-4">
          <h2 className="text-lg font-bold text-white">
            {idDangSua ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h2>
          <button
            type="button"
            onClick={dongModal}
            className="text-2xl leading-none text-white/80 hover:text-white"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <form id="form-san-pham" onSubmit={xuLyGuiForm} className="max-h-[calc(90vh-8rem)] space-y-4 overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="danh_muc_id" className="mb-1 block text-sm font-medium text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                id="danh_muc_id"
                name="danh_muc_id"
                value={duLieuForm.danh_muc_id}
                onChange={doiGiaTri}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">— Chọn danh mục —</option>
                {danhSachDanhMuc.map((danhMuc) => (
                  <option key={danhMuc.id} value={danhMuc.id}>{danhMuc.ten_danh_muc}</option>
                ))}
              </select>
              <LoiTruong loi={danhSachLoi?.danh_muc_id} />
            </div>

            <div>
              <label htmlFor="thuong_hieu_id" className="mb-1 block text-sm font-medium text-gray-700">
                Thương hiệu
              </label>
              <select
                id="thuong_hieu_id"
                name="thuong_hieu_id"
                value={duLieuForm.thuong_hieu_id}
                onChange={doiGiaTri}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">— Không chọn —</option>
                {danhSachThuongHieu.map((thuongHieu) => (
                  <option key={thuongHieu.id} value={thuongHieu.id}>{thuongHieu.ten_thuong_hieu}</option>
                ))}
              </select>
              <LoiTruong loi={danhSachLoi?.thuong_hieu_id} />
            </div>
          </div>

          <div>
            <label htmlFor="ten_san_pham" className="mb-1 block text-sm font-medium text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              id="ten_san_pham"
              name="ten_san_pham"
              value={duLieuForm.ten_san_pham}
              onChange={doiGiaTri}
              required
              maxLength={255}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <LoiTruong loi={danhSachLoi?.ten_san_pham} />
          </div>

          <div>
            <label htmlFor="duong_dan_sp" className="mb-1 block text-sm font-medium text-gray-700">
              Đường dẫn (slug)
            </label>
            <input
              id="duong_dan_sp"
              name="duong_dan_sp"
              value={duLieuForm.duong_dan_sp}
              onChange={doiGiaTri}
              placeholder="Để trống để tự tạo"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <LoiTruong loi={danhSachLoi?.duong_dan_sp} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="gia_ban" className="mb-1 block text-sm font-medium text-gray-700">
                Giá bán <span className="text-red-500">*</span>
              </label>
              <input
                id="gia_ban"
                name="gia_ban"
                type="number"
                min="0"
                step="1"
                value={duLieuForm.gia_ban}
                onChange={doiGiaTri}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <LoiTruong loi={danhSachLoi?.gia_ban} />
            </div>
            <div>
              <label htmlFor="gia_giam" className="mb-1 block text-sm font-medium text-gray-700">Giá giảm</label>
              <input
                id="gia_giam"
                name="gia_giam"
                type="number"
                min="0"
                step="1"
                value={duLieuForm.gia_giam}
                onChange={doiGiaTri}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <LoiTruong loi={danhSachLoi?.gia_giam} />
            </div>
            <div>
              <label htmlFor="so_luong_ton_kho" className="mb-1 block text-sm font-medium text-gray-700">
                Số lượng tồn <span className="text-red-500">*</span>
              </label>
              <input
                id="so_luong_ton_kho"
                name="so_luong_ton_kho"
                type="number"
                min="0"
                step="1"
                value={duLieuForm.so_luong_ton_kho}
                onChange={doiGiaTri}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <LoiTruong loi={danhSachLoi?.so_luong_ton_kho} />
            </div>
          </div>

          <div>
            <label htmlFor="don_vi_tinh" className="mb-1 block text-sm font-medium text-gray-700">Đơn vị tính</label>
            <input
              id="don_vi_tinh"
              name="don_vi_tinh"
              value={duLieuForm.don_vi_tinh}
              onChange={doiGiaTri}
              maxLength={50}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <LoiTruong loi={danhSachLoi?.don_vi_tinh} />
          </div>

          <div>
            <label htmlFor="hinh_anh" className="mb-1 block text-sm font-medium text-gray-700">
              Hình ảnh {!idDangSua && <span className="text-red-500">*</span>}
            </label>
            <input
              id="hinh_anh"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={chonHinhAnh}
              required={!idDangSua && !hinhAnhFile}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-green-50 file:px-3 file:py-1 file:text-green-700"
            />
            <p className="mt-1 text-xs text-gray-500">JPG, PNG hoặc WEBP; dung lượng tối đa 5 MB.</p>
            <LoiTruong loi={danhSachLoi?.hinh_anh} />
            {(duLieuForm.hinh_anh_xem_truoc || duLieuForm.hinh_anh) && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border bg-gray-50 p-2">
                <img
                  src={duLieuForm.hinh_anh_xem_truoc || duLieuForm.hinh_anh}
                  alt="Xem trước sản phẩm"
                  className="h-16 w-16 rounded-md border object-cover"
                />
                <span className="truncate text-xs text-gray-500">
                  {hinhAnhFile?.name || 'Ảnh hiện tại'}
                </span>
                {hinhAnhFile && (
                  <button
                    type="button"
                    onClick={() => {
                      setHinhAnhFile(null);
                      setDuLieuForm((prev) => ({ ...prev, hinh_anh_xem_truoc: '', hinh_anh: idDangSua ? prev.hinh_anh : '' }));
                    }}
                    className="ml-auto rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                  >
                    Bỏ ảnh mới
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="mo_ta_ngan" className="mb-1 block text-sm font-medium text-gray-700">Mô tả ngắn</label>
            <textarea
              id="mo_ta_ngan"
              name="mo_ta_ngan"
              rows={2}
              value={duLieuForm.mo_ta_ngan}
              onChange={doiGiaTri}
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <LoiTruong loi={danhSachLoi?.mo_ta_ngan} />
          </div>

          <div>
            <label htmlFor="chi_tiet" className="mb-1 block text-sm font-medium text-gray-700">Chi tiết sản phẩm</label>
            <textarea
              id="chi_tiet"
              name="chi_tiet"
              rows={3}
              value={duLieuForm.chi_tiet}
              onChange={doiGiaTri}
              className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <LoiTruong loi={danhSachLoi?.chi_tiet} />
          </div>
        </form>

        <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={dongModal}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="form-san-pham"
            disabled={dangLuu}
            className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dangLuu ? 'Đang lưu...' : idDangSua ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}
