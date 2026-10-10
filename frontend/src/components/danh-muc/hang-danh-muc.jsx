import React from 'react';

export default function HangDanhMuc({ dm, moModalSua, xuLyXoa, laDanhMucCon, tenDanhMucCha }) {
  return (
    <tr className={`${laDanhMucCon ? 'bg-green-50/50 hover:bg-green-50' : 'hover:bg-gray-50'} transition`}>
      <td className={`p-4 font-mono text-gray-400 text-sm ${laDanhMucCon ? 'pl-8' : ''}`}>#{dm.id}</td>
      <td className="p-4">
        {dm.hinh_anh ? (
          <img src={dm.hinh_anh} alt={dm.ten_danh_muc}
            className={`${laDanhMucCon ? 'w-8 h-8' : 'w-10 h-10'} object-cover rounded-lg border`}
            onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div className={`${laDanhMucCon ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-lg'} rounded-lg bg-green-100 flex items-center justify-center text-green-600`}>
            {laDanhMucCon ? '📁' : '🗂️'}
          </div>
        )}
      </td>
      <td className="p-4">
        <div className={`flex items-center gap-2 ${laDanhMucCon ? 'pl-5' : ''}`}>
          {laDanhMucCon && <span className="text-gray-400 text-xs">└</span>}
          <span className={`${laDanhMucCon ? 'font-medium text-gray-700' : 'font-semibold text-gray-800'}`}>
            {dm.ten_danh_muc}
          </span>
          {!laDanhMucCon && dm.so_danh_muc_con > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {dm.so_danh_muc_con} con
            </span>
          )}
        </div>
        {laDanhMucCon && tenDanhMucCha && (
          <div className="text-[11px] text-gray-400 mt-0.5 pl-10">Thuộc: {tenDanhMucCha}</div>
        )}
        <div className={`text-xs text-gray-400 mt-0.5 font-mono ${laDanhMucCon ? 'pl-10' : ''}`}>{dm.duong_dan_dm}</div>
      </td>
      <td className="p-4 text-center">
        <span className={`inline-block w-2 h-2 rounded-full ${laDanhMucCon ? 'bg-green-400' : 'bg-gray-300'}`} />
        <span className={`ml-1 text-xs ${laDanhMucCon ? 'text-green-600' : 'text-gray-500'}`}>
          {laDanhMucCon ? 'Danh mục con' : 'Danh mục cha'}
        </span>
      </td>
      <td className="p-4 text-center">
        {dm.sp_noi_bat ? (
          <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">⭐ Có</span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="p-4 text-center">
        <div className="flex justify-center gap-2">
          <button onClick={() => moModalSua(dm)}
            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-medium transition">Sửa</button>
          <button onClick={() => xuLyXoa(dm.id, dm.ten_danh_muc)}
            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium transition">Xóa</button>
        </div>
      </td>
    </tr>
  );
}