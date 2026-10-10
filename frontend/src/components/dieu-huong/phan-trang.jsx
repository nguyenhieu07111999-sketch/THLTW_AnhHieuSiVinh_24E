import React from 'react';

export default function PhanTrang({
  trangHienTai,
  tongSoTrang,
  setTrangHienTai,
  tongSoItem,
  soItemMoiTrang,
  tenLoaiItem = 'mục'
}) {
  if (tongSoItem === 0) return null;

  // Đảm bảo trang hiện tại không vượt quá tổng số trang
  const trangDangXem = Math.min(trangHienTai, tongSoTrang);
  
  // Tính toán hiển thị các nút phân trang (tối đa 5 nút liền kề)
  const soTrangHienThi = Math.min(5, tongSoTrang);
  const trangBatDau = Math.max(
    1,
    Math.min(
      trangDangXem - Math.floor(soTrangHienThi / 2),
      tongSoTrang - soTrangHienThi + 1
    )
  );
  const cacTrangHienThi = Array.from(
    { length: soTrangHienThi },
    (_, index) => trangBatDau + index
  );

  // Tính toán số thứ tự item đang hiển thị
  const itemBatDau = (trangDangXem - 1) * soItemMoiTrang + 1;
  const itemKetThuc = Math.min(trangDangXem * soItemMoiTrang, tongSoItem);

  return (
    <div className="bg-gray-50 border-t px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
      <span>
        Hiển thị {itemBatDau}–{itemKetThuc} trong tổng số {tongSoItem} {tenLoaiItem}
      </span>
      <nav aria-label="Phân trang" className="flex items-center gap-1">
        {/* Nút Trước */}
        <button
          disabled={trangDangXem <= 1}
          onClick={() => setTrangHienTai(Math.max(1, trangDangXem - 1))}
          className="px-2.5 h-7 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          ◀ Trước
        </button>

        {/* Nút Trang 1 (Nếu bị ẩn) */}
        {trangBatDau > 1 && (
          <>
            <button
              onClick={() => setTrangHienTai(1)}
              className="w-7 h-7 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-semibold transition"
            >
              1
            </button>
            {trangBatDau > 2 && <span className="px-1 text-gray-400">…</span>}
          </>
        )}

        {/* Các nút trang hiện tại */}
        {cacTrangHienThi.map((page) => (
          <button
            key={page}
            onClick={() => setTrangHienTai(page)}
            className={`w-7 h-7 rounded text-xs font-semibold transition ${
              trangDangXem === page
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Nút Trang Cuối (Nếu bị ẩn) */}
        {trangBatDau + soTrangHienThi - 1 < tongSoTrang && (
          <>
            {trangBatDau + soTrangHienThi < tongSoTrang && (
              <span className="px-1 text-gray-400">…</span>
            )}
            <button
              onClick={() => setTrangHienTai(tongSoTrang)}
              className="w-7 h-7 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-semibold transition"
            >
              {tongSoTrang}
            </button>
          </>
        )}

        {/* Nút Sau */}
        <button
          disabled={trangDangXem >= tongSoTrang}
          onClick={() => setTrangHienTai(Math.min(tongSoTrang, trangDangXem + 1))}
          className="px-2.5 h-7 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
        >
          Sau ▶
        </button>
      </nav>
    </div>
  );
}