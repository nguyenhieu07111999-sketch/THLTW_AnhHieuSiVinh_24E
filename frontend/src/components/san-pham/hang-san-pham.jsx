import React from 'react';

export default function HangSanPham({ sp, dangXemThungRac, openDropdownId, setOpenDropdownId, actions, modalData, setSanPhamChiTiet, setMoModalChiTiet }) {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="p-4 font-mono text-gray-500">#{sp.id}</td>
      <td className="p-4">
        <img src={sp.hinh_anh || 'https://via.placeholder.com/48'} alt={sp.ten_san_pham} className="w-12 h-12 object-cover rounded-lg border" />
      </td>
      <td className="p-4 font-medium text-gray-800">{sp.ten_san_pham}</td>
      <td className="p-4 text-emerald-600 font-medium">{Number(sp.gia_ban).toLocaleString('vi-VN')} đ</td>
      <td className="p-4 font-medium text-amber-600">
        {sp.gia_giam ? `${Number(sp.gia_giam).toLocaleString('vi-VN')} đ` : <span className="text-gray-300">—</span>}
      </td>
      <td className="p-4">{sp.so_luong_ton_kho} <span className="text-xs text-gray-400">{sp.don_vi_tinh}</span></td>
      
      <td className="p-4 text-center">
        {!dangXemThungRac ? (
          <button
            onClick={() => actions.xuLyDoiTrangThai(sp)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${sp.trang_thai === 'hien_thi' ? 'bg-emerald-500' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sp.trang_thai === 'hien_thi' ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        ) : (
          <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-500">Đã xóa</span>
        )}
      </td>

      <td className="p-4 text-center relative">
        {!dangXemThungRac ? (
          <div className="flex justify-center items-center gap-1.5">
            <button onClick={() => { setSanPhamChiTiet(sp); setMoModalChiTiet(true); }} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">👁</button>
            <button onClick={() => modalData.moModalSua(sp)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-xs">✏️</button>
            <a href={`/san-pham/${sp.duong_dan_sp || sp.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg">↗️</a>
            
            <div className="relative inline-block text-left">
              <button onClick={() => setOpenDropdownId(openDropdownId === sp.id ? null : sp.id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg font-bold">⋮</button>
              {openDropdownId === sp.id && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left">
                  <button onClick={() => { setOpenDropdownId(null); modalData.xuLySaoChep(sp); }} className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">📋 Sao chép</button>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { setOpenDropdownId(null); actions.xuLyXoaTam(sp.id); }} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50">🗑 Chuyển thùng rác</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            <button onClick={() => actions.xuLyKhoiPhuc(sp.id)} className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs font-medium">Khôi phục</button>
            <button onClick={() => actions.xuLyXoaVinhVien(sp.id)} className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium">Xóa hẳn</button>
          </div>
        )}
      </td>
    </tr>
  );
}