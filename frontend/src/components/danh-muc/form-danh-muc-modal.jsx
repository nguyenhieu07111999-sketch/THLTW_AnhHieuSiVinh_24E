import React from 'react';

export const GIA_TRI_MAC_DINH = {
  parent_id: '',
  ten_danh_muc: '',
  duong_dan_dm: '',
  hinh_anh: '',
  mo_ta: '',
  sp_noi_bat: false,
};

export function taoSlug(ten) {
  return ten
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function ModalFormDanhMuc({ moModal, dongModal, idDangSua, duLieuForm, setDuLieuForm, danhSachCha, danhSachLoi, xuLyGuiForm, dangLuu }) {
  if (!moModal) return null;

  const doiGiaTri = (e) => {
    const { name, value, type, checked } = e.target;
    setDuLieuForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'ten_danh_muc' && !idDangSua && !prev.duong_dan_dm) {
        updated.duong_dan_dm = taoSlug(value);
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dongModal} />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {idDangSua ? '✏️ Sửa danh mục' : '➕ Thêm danh mục mới'}
          </h2>
          <button onClick={dongModal} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Body */}
        <form onSubmit={xuLyGuiForm} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Danh mục cha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha <span className="text-gray-400 font-normal">(để trống = danh mục gốc)</span>
            </label>
            <select name="parent_id" value={duLieuForm.parent_id} onChange={doiGiaTri}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">— Danh mục gốc —</option>
              {danhSachCha.map((dm) => (
                <option key={dm.id} value={dm.id}>{dm.ten_danh_muc}</option>
              ))}
            </select>
            {danhSachLoi?.parent_id && <p className="text-red-500 text-xs mt-1">{danhSachLoi.parent_id[0]}</p>}
          </div>

          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input type="text" name="ten_danh_muc" value={duLieuForm.ten_danh_muc} onChange={doiGiaTri}
              placeholder="Ví dụ: Rau củ quả"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            {danhSachLoi?.ten_danh_muc && <p className="text-red-500 text-xs mt-1">{danhSachLoi.ten_danh_muc[0]}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (slug)</label>
            <input type="text" name="duong_dan_dm" value={duLieuForm.duong_dan_dm} onChange={doiGiaTri}
              placeholder="rau-cu-qua (tự động sinh từ tên)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
            {danhSachLoi?.duong_dan_dm && <p className="text-red-500 text-xs mt-1">{danhSachLoi.duong_dan_dm[0]}</p>}
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh danh mục</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 border border-dashed border-green-400 bg-green-50/50 hover:bg-green-100/50 rounded-lg py-2.5 px-3 text-xs text-green-700 font-medium transition">
                  <span>📁 Tải ảnh từ máy tính</span>
                  <input type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDuLieuForm((prev) => ({ ...prev, hinh_anh: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <input type="text" name="hinh_anh" value={duLieuForm.hinh_anh} onChange={doiGiaTri}
                  placeholder="Hoặc dán URL hình ảnh (https://...)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                />
              </div>

              {duLieuForm.hinh_anh && (
                <div className="relative mt-2 p-2 bg-gray-50 border rounded-xl flex items-center gap-3">
                  <img
                    src={duLieuForm.hinh_anh} alt="Xem trước ảnh"
                    className="w-16 h-16 object-cover rounded-lg border bg-white shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/64?text=L%E1%BB%97i+anh';
                    }}
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-gray-700 block">Xem trước ảnh danh mục</span>
                    <span className="text-[11px] text-gray-400 block truncate max-w-[200px] font-mono">
                      {duLieuForm.hinh_anh.startsWith('data:') ? 'Ảnh tải từ máy (Base64)' : duLieuForm.hinh_anh}
                    </span>
                  </div>
                  <button type="button" onClick={() => setDuLieuForm((prev) => ({ ...prev, hinh_anh: '' }))}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded font-medium transition">
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea name="mo_ta" value={duLieuForm.mo_ta} onChange={doiGiaTri} rows={3}
              placeholder="Mô tả ngắn về danh mục..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
          </div>

          {/* Sản phẩm nổi bật */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="sp_noi_bat" name="sp_noi_bat" checked={!!duLieuForm.sp_noi_bat} onChange={doiGiaTri}
              className="w-4 h-4 accent-green-600" />
            <label htmlFor="sp_noi_bat" className="text-sm font-medium text-gray-700 cursor-pointer">
              Hiển thị sản phẩm nổi bật trong danh mục này
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button type="button" onClick={dongModal}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition">
            Hủy
          </button>
          <button type="submit" onClick={xuLyGuiForm} disabled={dangLuu}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed">
            {dangLuu ? 'Đang lưu...' : idDangSua ? '💾 Cập nhật' : '✅ Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}