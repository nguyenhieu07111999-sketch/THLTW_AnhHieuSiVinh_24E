'use client';
import React from 'react';

function taoSlug(ten) {
  return ten.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function FormThuongHieuModal({
  moModal,
  dongModal,
  idDangSua,
  duLieuForm,
  setDuLieuForm,
  logoFile,
  setLogoFile,
  danhSachLoi,
  xuLyGuiForm,
  dangLuu,
}) {
  if (!moModal) return null;

  const doiGiaTri = (e) => {
    const { name, value } = e.target;
    setDuLieuForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'ten_thuong_hieu' && !idDangSua && !prev.duong_dan_th) {
        updated.duong_dan_th = taoSlug(value);
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dongModal} />
      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-white">
            {idDangSua ? '✏️ Sửa thương hiệu' : '➕ Thêm thương hiệu mới'}
          </h2>
          <button onClick={dongModal} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form onSubmit={xuLyGuiForm} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu <span className="text-red-500">*</span></label>
            <input type="text" name="ten_thuong_hieu" value={duLieuForm.ten_thuong_hieu} onChange={doiGiaTri} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {danhSachLoi?.ten_thuong_hieu && <p className="text-red-500 text-xs mt-1">{danhSachLoi.ten_thuong_hieu[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (Slug)</label>
            <input type="text" name="duong_dan_th" value={duLieuForm.duong_dan_th} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            {danhSachLoi?.duong_dan_th && <p className="text-red-500 text-xs mt-1">{danhSachLoi.duong_dan_th[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo thương hiệu</label>
            <label className="cursor-pointer flex items-center justify-center gap-2 border border-dashed border-emerald-400 bg-emerald-50 hover:bg-emerald-100 rounded-lg py-2 text-xs text-emerald-700 font-medium">
              <span>📁 Tải logo từ máy tính</span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setLogoFile(file);
                    setDuLieuForm((prev) => ({
                      ...prev,
                      logo_xem_truoc: URL.createObjectURL(file),
                    }));
                  }
                }}
              />
            </label>
            {(duLieuForm.logo_xem_truoc || duLieuForm.logo) && (
              <div className="relative p-2 bg-gray-50 border rounded-xl flex items-center gap-3">
                <img 
                  src={
                    duLieuForm.logo_xem_truoc 
                      ? duLieuForm.logo_xem_truoc 
                      : (duLieuForm.logo.startsWith('http') 
                          ? duLieuForm.logo 
                          : `http://127.0.0.1:8000/storage/${duLieuForm.logo.startsWith('brands/') ? duLieuForm.logo : 'brands/' + duLieuForm.logo}`)
                  } 
                  alt="Logo Preview" 
                  className="w-16 h-16 object-cover rounded-lg border bg-white" 
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=L%E1%BB%97i'; }}
                />
                <button 
                  type="button" 
                  onClick={() => setLogoFile(null) || setDuLieuForm((prev) => ({ ...prev, logo_xem_truoc: '', logo: '' }))} 
                  className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded"
                >
                  Xóa ảnh
                </button>
              </div>
            )}
            {danhSachLoi?.logo && <p className="text-red-500 text-xs mt-1">{danhSachLoi.logo[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea 
              name="mo_ta" 
              rows={3} 
              value={duLieuForm.mo_ta || ''} 
              onChange={doiGiaTri} 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
            />
          </div>

          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2"><input type="radio" name="trang_thai" value="hien_thi" checked={duLieuForm.trang_thai === 'hien_thi'} onChange={doiGiaTri} className="accent-emerald-600"/> Hiển thị</label>
            <label className="flex items-center gap-2"><input type="radio" name="trang_thai" value="an" checked={duLieuForm.trang_thai === 'an'} onChange={doiGiaTri} className="accent-emerald-600"/> Ẩn</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={dongModal} className="px-4 py-2 rounded-lg text-sm border bg-white">Hủy</button>
            <button type="submit" disabled={dangLuu} className="px-5 py-2 rounded-lg text-sm bg-emerald-600 text-white disabled:opacity-60">{dangLuu ? 'Đang lưu...' : idDangSua ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}