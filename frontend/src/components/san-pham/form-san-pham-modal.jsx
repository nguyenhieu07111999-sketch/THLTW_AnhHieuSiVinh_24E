'use client';
import React from 'react';

function taoSlug(ten) {
  return ten.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export default function FormSanPhamModal({ moModal, dongModal, idDangSua, duLieuForm, setDuLieuForm, danhSachLoi, xuLyGuiForm, dangLuu, categories = [], brands = [] }) {
  if (!moModal) return null;

  const doiGiaTri = (e) => {
    const { name, value, type, checked } = e.target;
    setDuLieuForm((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Tự động tạo slug khi nhập tên sản phẩm mới
      if (name === 'ten_san_pham' && !idDangSua && !prev.duong_dan_sp) {
        updated.duong_dan_sp = taoSlug(value);
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dongModal} />
      <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-white">
            {idDangSua ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm mới'}
          </h2>
          <button onClick={dongModal} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        <form className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CỘT 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input type="text" name="ten_san_pham" value={duLieuForm.ten_san_pham} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                {danhSachLoi?.ten_san_pham && <p className="text-red-500 text-xs mt-1">{danhSachLoi.ten_san_pham[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (Slug)</label>
                <input type="text" name="duong_dan_sp" value={duLieuForm.duong_dan_sp} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
                  <select name="danh_muc_id" value={duLieuForm.danh_muc_id} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">— Chọn danh mục —</option>
                    {categories.map((dm) => <option key={dm.id} value={dm.id}>{dm.ten_danh_muc}</option>)}
                  </select>
                  {danhSachLoi?.danh_muc_id && <p className="text-red-500 text-xs mt-1">{danhSachLoi.danh_muc_id[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                  <select name="thuong_hieu_id" value={duLieuForm.thuong_hieu_id} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">— Không có —</option>
                    {brands.map((th) => <option key={th.id} value={th.id}>{th.ten_thuong_hieu}</option>)}
                  </select>
                </div>
              </div>

              {/* Upload Ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                <div className="space-y-3">
                  <label className="cursor-pointer flex items-center justify-center gap-2 border border-dashed border-emerald-400 bg-emerald-50 hover:bg-emerald-100 rounded-lg py-2 text-xs text-emerald-700 font-medium">
                    <span>📁 Tải ảnh từ máy tính</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDuLieuForm((prev) => ({ 
                            ...prev, 
                            hinh_anh_file: file,
                            hinh_anh_preview: URL.createObjectURL(file) 
                          }));
                        }
                      }}
                    />
                  </label>
                  
                  {/* Hiển thị ảnh xem trước (ưu tiên ảnh mới tải lên, nếu không có thì hiện ảnh cũ từ DB) */}
                 {(duLieuForm.hinh_anh_preview || duLieuForm.hinh_anh) && (
                    <div className="relative p-2 bg-gray-50 border rounded-xl flex items-center gap-3">
                      <img 
                        src={duLieuForm.hinh_anh_preview || duLieuForm.hinh_anh} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded-lg border bg-white" 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=Lỗi'; }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setDuLieuForm((prev) => ({ ...prev, hinh_anh_file: null, hinh_anh_preview: '', hinh_anh: '' }))} 
                        className="text-red-500 text-xs bg-red-50 px-2 py-1 rounded"
                      >
                        Xóa ảnh
                      </button>
                    </div>
                  )}
                  {danhSachLoi?.hinh_anh && <p className="text-red-500 text-xs mt-1">{danhSachLoi.hinh_anh[0]}</p>}
                </div>
              </div>
            </div>

            {/* CỘT 2 */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán <span className="text-red-500">*</span></label>
                  <input type="number" name="gia_ban" value={duLieuForm.gia_ban} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {danhSachLoi?.gia_ban && <p className="text-red-500 text-xs mt-1">{danhSachLoi.gia_ban[0]}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho <span className="text-red-500">*</span></label>
                  <input type="number" name="so_luong_ton_kho" value={duLieuForm.so_luong_ton_kho} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {danhSachLoi?.so_luong_ton_kho && <p className="text-red-500 text-xs mt-1">{danhSachLoi.so_luong_ton_kho[0]}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tính</label>
                <select name="don_vi_tinh" value={duLieuForm.don_vi_tinh} onChange={doiGiaTri} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="Kg">Kg</option><option value="Hộp">Hộp</option>
                </select>
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2"><input type="radio" name="trang_thai" value="hien_thi" checked={duLieuForm.trang_thai === 'hien_thi'} onChange={doiGiaTri} className="accent-emerald-600"/> Hiện</label>
                <label className="flex items-center gap-2"><input type="radio" name="trang_thai" value="an" checked={duLieuForm.trang_thai === 'an'} onChange={doiGiaTri} className="accent-emerald-600"/> Ẩn</label>
              </div>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
          <button type="button" onClick={dongModal} className="px-4 py-2 rounded-lg text-sm border bg-white">Hủy</button>
          <button type="button" onClick={xuLyGuiForm} disabled={dangLuu} className="px-5 py-2 rounded-lg text-sm bg-emerald-600 text-white disabled:opacity-60">{dangLuu ? 'Đang lưu...' : idDangSua ? 'Cập nhật' : 'Thêm mới'}</button>
        </div>
      </div>
    </div>
  );
}