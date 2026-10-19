'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import * as dichVuBaiViet from '@/services/dich-vu-bai-viet';
import TheTinTuc from '@/components/bai-viet/the-tin-tuc';
import PhanTrang from '@/components/dieu-huong/phan-trang';

export default function TrangDanhSachBaiViet() {
  const [dsBaiViet, setDsBaiViet] = useState([]);
  const [dsChuDe, setDsChuDe] = useState([]);
  const [dangTai, setDangTai] = useState(true);

  // Bộ lọc
  const [chuDeChon, setChuDeChon] = useState('tat-ca');
  const [tuKhoa, setTuKhoa] = useState('');

  // Phân trang
  const [trangHienTai, setTrangHienTai] = useState(1);
  const soItemMoiTrang = 9;

  useEffect(() => {
    let active = true;
    setDangTai(true);

    Promise.all([
      dichVuBaiViet.layDanhSach({ per_page: 200 }),
      dichVuBaiViet.layChuDe(),
    ])
      .then(([resBaiViet, resChuDe]) => {
        if (!active) return;
        const listBv = Array.isArray(resBaiViet) ? resBaiViet : (resBaiViet?.data || []);
        const listCd = Array.isArray(resChuDe) ? resChuDe : (resChuDe?.data || []);
        
        // Chỉ lấy các bài viết đã xuất bản
        const bvXuatBan = listBv.filter((b) => b.trang_thai === 'xuat_ban' || b.trang_thai === 'dang');
        setDsBaiViet(bvXuatBan);
        setDsChuDe(listCd);
      })
      .catch((err) => {
        console.error('Lỗi tải bài viết:', err);
      })
      .finally(() => {
        if (active) setDangTai(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Lọc bài viết theo danh mục chủ đề và từ khóa tìm kiếm
  const dsLoc = useMemo(() => {
    return dsBaiViet.filter((b) => {
      const khopTuKhoa = !tuKhoa.trim() || b.tieu_de?.toLowerCase().includes(tuKhoa.trim().toLowerCase());
      const khopChuDe = chuDeChon === 'tat-ca' || String(b.chu_de_id) === String(chuDeChon);
      return khopTuKhoa && khopChuDe;
    });
  }, [dsBaiViet, tuKhoa, chuDeChon]);

  // Dữ liệu phân trang
  const tongSoItem = dsLoc.length;
  const tongSoTrang = Math.max(1, Math.ceil(tongSoItem / soItemMoiTrang));
  const danhSachHienThi = dsLoc.slice((trangHienTai - 1) * soItemMoiTrang, trangHienTai * soItemMoiTrang);

  const handleChonChuDe = (id) => {
    setChuDeChon(id);
    setTrangHienTai(1);
  };

  return (
    <div className="bg-emerald-50/30 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Banner tiêu đề */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white rounded-3xl p-8 md:p-12 mb-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-emerald-100 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
              Cẩm nang nông sản sạch
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
              Tin Tức & Kinh Nghiệm Nông Sản
            </h1>
            <p className="text-emerald-100 text-sm md:text-base leading-relaxed">
              Cập nhật các mẹo bảo quản, công thức nấu ăn ngon và bí quyết lựa chọn thực phẩm xanh chuẩn VietGAP cho bữa cơm gia đình.
            </p>
          </div>
          <div className="absolute -right-8 -bottom-10 text-9xl opacity-15 select-none pointer-events-none">
            🥬
          </div>
        </div>

        {/* Thanh tìm kiếm & Tabs chủ đề */}
        <div className="bg-white p-4 md:p-5 rounded-2xl border border-emerald-100 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Lọc nhanh theo chủ đề */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleChonChuDe('tat-ca')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  chuDeChon === 'tat-ca'
                    ? 'bg-emerald-600 text-white shadow-md font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                Tất cả chủ đề
              </button>
              {dsChuDe.map((cd) => (
                <button
                  key={cd.id}
                  type="button"
                  onClick={() => handleChonChuDe(cd.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    String(chuDeChon) === String(cd.id)
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {cd.ten_chu_de}
                </button>
              ))}
            </div>

            {/* Ô tìm kiếm */}
            <div className="w-full md:w-72 relative">
              <input
                type="text"
                value={tuKhoa}
                onChange={(e) => {
                  setTuKhoa(e.target.value);
                  setTrangHienTai(1);
                }}
                placeholder="Tìm bài viết..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-gray-50/50"
              />
              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            </div>
          </div>
        </div>

        {/* Lưới danh sách bài viết */}
        {dangTai ? (
          <div className="py-24 text-center">
            <div className="inline-block animate-spin text-3xl mb-3">🌱</div>
            <p className="text-gray-500 text-sm">Đang tải danh sách bài viết...</p>
          </div>
        ) : danhSachHienThi.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-emerald-100 shadow-sm max-w-lg mx-auto">
            <span className="text-5xl mb-4 block">📖</span>
            <h3 className="font-bold text-gray-800 text-lg mb-1">Chưa có bài viết nào</h3>
            <p className="text-gray-500 text-sm">
              Không tìm thấy bài viết phù hợp với lựa chọn hoặc từ khóa hiện tại.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {danhSachHienThi.map((bv) => (
              <TheTinTuc key={bv.id} baiViet={bv} />
            ))}
          </div>
        )}

        {/* Phân trang */}
        {!dangTai && tongSoTrang > 1 && (
          <div className="flex justify-center mt-10">
            <div className="bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm inline-block">
              <PhanTrang
                trangHienTai={trangHienTai}
                tongSoTrang={tongSoTrang}
                setTrangHienTai={setTrangHienTai}
                tongSoItem={tongSoItem}
                soItemMoiTrang={soItemMoiTrang}
                tenLoaiItem="bài viết"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}