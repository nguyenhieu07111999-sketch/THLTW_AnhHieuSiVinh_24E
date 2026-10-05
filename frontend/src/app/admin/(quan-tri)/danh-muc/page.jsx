// src/app/admin/(quan-tri)/danh-muc/page.jsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { dichVuDanhMuc } from '@/services/dich-vu-danh-muc';

// ─── Giá trị form mặc định ──────────────────────────────────────────────────
const GIA_TRI_MAC_DINH = {
  parent_id: '',
  ten_danh_muc: '',
  duong_dan_dm: '',
  hinh_anh: '',
  mo_ta: '',
  sp_noi_bat: false,
};

// ─── Hàm tạo slug từ tên ────────────────────────────────────────────────────
function taoSlug(ten) {
  if (!ten) return '';
  return ten
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ─── Component Toast thông báo ───────────────────────────────────────────────
function Toast({ thongBao, loai }) {
  if (!thongBao) return null;
  const mau =
    loai === 'success'
      ? 'bg-emerald-600'
      : loai === 'error'
      ? 'bg-red-600'
      : 'bg-amber-500';
  const icon = loai === 'success' ? '✅' : loai === 'error' ? '❌' : '⚠️';
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] ${mau} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2 animate-bounce`}
    >
      <span>{icon}</span> <span>{thongBao}</span>
    </div>
  );
}

// ─── Component Modal Form Danh Mục ──────────────────────────────────────────
function ModalFormDanhMuc({
  moModal,
  dongModal,
  idDangSua,
  duLieuForm,
  setDuLieuForm,
  danhSachCha,
  danhSachLoi,
  xuLyGuiForm,
  dangLuu,
}) {
  if (!moModal) return null;

  const doiGiaTri = (e) => {
    const { name, value, type, checked } = e.target;
    setDuLieuForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      if (name === 'ten_danh_muc' && !idDangSua && !prev.duong_dan_dm) {
        updated.duong_dan_dm = taoSlug(value);
      }
      return updated;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dongModal}
      />
      <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {idDangSua ? '✏️ Sửa danh mục' : '➕ Thêm danh mục mới'}
          </h2>
          <button
            onClick={dongModal}
            className="text-white/70 hover:text-white text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={xuLyGuiForm}
          className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
        >
          {/* Danh mục cha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục cha{' '}
              <span className="text-gray-400 font-normal">
                (để trống = danh mục gốc)
              </span>
            </label>
            <select
              name="parent_id"
              value={duLieuForm.parent_id || ''}
              onChange={doiGiaTri}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="">— Danh mục gốc —</option>
              {danhSachCha.map((dm) => (
                <option key={dm.id} value={dm.id}>
                  {dm.ten_danh_muc}
                </option>
              ))}
            </select>
            {danhSachLoi.parent_id && (
              <p className="text-red-500 text-xs mt-1">
                {danhSachLoi.parent_id[0]}
              </p>
            )}
          </div>

          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ten_danh_muc"
              value={duLieuForm.ten_danh_muc}
              onChange={doiGiaTri}
              placeholder="Ví dụ: Rau củ quả"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {danhSachLoi.ten_danh_muc && (
              <p className="text-red-500 text-xs mt-1">
                {danhSachLoi.ten_danh_muc[0]}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường dẫn (slug)
            </label>
            <input
              type="text"
              name="duong_dan_dm"
              value={duLieuForm.duong_dan_dm}
              onChange={doiGiaTri}
              placeholder="rau-cu-qua (tự động sinh từ tên)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {danhSachLoi.duong_dan_dm && (
              <p className="text-red-500 text-xs mt-1">
                {danhSachLoi.duong_dan_dm[0]}
              </p>
            )}
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh danh mục
            </label>
            <div className="space-y-3">
              {/* Tải tệp từ máy */}
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 border border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/50 rounded-lg py-2.5 px-3 text-xs text-emerald-700 font-medium transition">
                  <span>📁 Tải ảnh từ máy tính</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDuLieuForm((prev) => ({
                            ...prev,
                            hinh_anh: reader.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Ô nhập URL */}
              <div>
                <input
                  type="text"
                  name="hinh_anh"
                  value={duLieuForm.hinh_anh}
                  onChange={doiGiaTri}
                  placeholder="Hoặc dán URL hình ảnh (https://...)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Gợi ý ảnh mẫu */}
              <div>
                <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">
                  Gợi ý ảnh mẫu thực phẩm:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    {
                      label: 'Rau củ',
                      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
                    },
                    {
                      label: 'Trái cây',
                      url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300',
                    },
                    {
                      label: 'Thịt tươi',
                      url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300',
                    },
                    {
                      label: 'Hải sản',
                      url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300',
                    },
                    {
                      label: 'Trứng sữa',
                      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300',
                    },
                    {
                      label: 'Nước ép',
                      url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300',
                    },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setDuLieuForm((prev) => ({
                          ...prev,
                          hinh_anh: item.url,
                        }))
                      }
                      className="flex-shrink-0 flex items-center gap-1 bg-gray-100 hover:bg-emerald-100 hover:text-emerald-800 text-gray-600 px-2 py-1 rounded text-[11px] transition cursor-pointer"
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-4 h-4 rounded object-cover"
                      />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khung xem trước ảnh */}
              {duLieuForm.hinh_anh && (
                <div className="relative mt-2 p-2 bg-gray-50 border rounded-xl flex items-center gap-3">
                  <img
                    src={duLieuForm.hinh_anh}
                    alt="Xem trước ảnh"
                    className="w-16 h-16 object-cover rounded-lg border bg-white shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://via.placeholder.com/64?text=L%E1%BB%97i+anh';
                    }}
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-gray-700 block">
                      Xem trước ảnh danh mục
                    </span>
                    <span className="text-[11px] text-gray-400 block truncate max-w-[200px] font-mono">
                      {duLieuForm.hinh_anh.startsWith('data:')
                        ? 'Ảnh tải từ máy (Base64)'
                        : duLieuForm.hinh_anh}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setDuLieuForm((prev) => ({ ...prev, hinh_anh: '' }))
                    }
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded font-medium transition cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="mo_ta"
              value={duLieuForm.mo_ta}
              onChange={doiGiaTri}
              rows={3}
              placeholder="Mô tả ngắn về danh mục..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Sản phẩm nổi bật */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="sp_noi_bat"
              name="sp_noi_bat"
              checked={!!duLieuForm.sp_noi_bat}
              onChange={doiGiaTri}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <label
              htmlFor="sp_noi_bat"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Hiển thị sản phẩm nổi bật trong danh mục này
            </label>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={dongModal}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white hover:bg-gray-50 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={xuLyGuiForm}
            disabled={dangLuu}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {dangLuu ? 'Đang lưu...' : idDangSua ? '💾 Cập nhật' : '✅ Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Component Hàng Danh Mục ────────────────────────────────────────────────
function HangDanhMuc({ dm, moModalSua, xuLyXoa, laDanhMucCon, tenDanhMucCha }) {
  return (
    <tr
      className={`${
        laDanhMucCon ? 'bg-emerald-50/30 hover:bg-emerald-50/60' : 'hover:bg-gray-50'
      } transition`}
    >
      <td
        className={`p-4 font-mono text-gray-400 text-xs ${
          laDanhMucCon ? 'pl-8' : ''
        }`}
      >
        #{dm.id}
      </td>
      <td className="p-4">
        {dm.hinh_anh ? (
          <img
            src={dm.hinh_anh}
            alt={dm.ten_danh_muc}
            className={`${
              laDanhMucCon ? 'w-8 h-8' : 'w-10 h-10'
            } object-cover rounded-lg border border-gray-200`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/40?text=DM';
            }}
          />
        ) : (
          <div
            className={`${
              laDanhMucCon ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-base'
            } rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700`}
          >
            {laDanhMucCon ? '📁' : '🗂️'}
          </div>
        )}
      </td>
      <td className="p-4">
        <div className={`flex items-center gap-2 ${laDanhMucCon ? 'pl-4' : ''}`}>
          {laDanhMucCon && <span className="text-gray-400 text-xs">└</span>}
          <span
            className={`${
              laDanhMucCon
                ? 'font-medium text-gray-700'
                : 'font-semibold text-gray-900'
            }`}
          >
            {dm.ten_danh_muc}
          </span>
          {!laDanhMucCon && dm.so_danh_muc_con > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
              {dm.so_danh_muc_con} con
            </span>
          )}
        </div>
        {laDanhMucCon && tenDanhMucCha && (
          <div className="text-[11px] text-gray-400 mt-0.5 pl-8">
            Thuộc: {tenDanhMucCha}
          </div>
        )}
        <div
          className={`text-xs text-gray-400 mt-0.5 font-mono ${
            laDanhMucCon ? 'pl-8' : ''
          }`}
        >
          {dm.duong_dan_dm || '-'}
        </div>
      </td>
      <td className="p-4 text-center">
        <span
          className={`inline-block w-2 h-2 rounded-full ${
            laDanhMucCon ? 'bg-emerald-400' : 'bg-blue-400'
          }`}
        />
        <span
          className={`ml-1.5 text-xs ${
            laDanhMucCon ? 'text-emerald-700' : 'text-blue-700'
          }`}
        >
          {laDanhMucCon ? 'Danh mục con' : 'Danh mục gốc'}
        </span>
      </td>
      <td className="p-4 text-center">
        {dm.sp_noi_bat ? (
          <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-200">
            ⭐ Có
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="p-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => moModalSua(dm)}
            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            Sửa
          </button>
          <button
            onClick={() => xuLyXoa(dm.id, dm.ten_danh_muc)}
            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Trang chính QuanLyDanhMucPage ──────────────────────────────────────────
export default function QuanLyDanhMucPage() {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  // Trạng thái điều khiển Modal & Form
  const [moModal, setMoModal] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [duLieuForm, setDuLieuForm] = useState(GIA_TRI_MAC_DINH);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangLuu, setDangLuu] = useState(false);

  // Trạng thái Thông báo Toast
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('success');

  const hienThongBao = (msg, loai = 'success') => {
    setThongBao(msg);
    setLoaiThongBao(loai);
    setTimeout(() => setThongBao(''), 3000);
  };

  // Tải danh sách danh mục
  const taiDanhSach = useCallback(async () => {
    setDangTai(true);
    try {
      const res = await dichVuDanhMuc.layDanhSach({ all: 1 });
      const data = res.data?.data || res.data || [];
      setDanhSach(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
      hienThongBao('Không thể tải danh sách danh mục!', 'error');
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    taiDanhSach();
  }, [taiDanhSach]);

  // Lọc danh sách danh mục gốc (parent_id null hoặc bằng 0)
  const danhSachDanhMucCha = useMemo(() => {
    return danhSach.filter((dm) => !dm.parent_id);
  }, [danhSach]);

  // Lọc và sắp xếp hiển thị theo cây Cha - Con
  const danhMucHienThi = useMemo(() => {
    const keyword = tuKhoaTimKiem.toLowerCase().trim();

    if (keyword) {
      return danhSach.filter(
        (dm) =>
          dm.ten_danh_muc?.toLowerCase().includes(keyword) ||
          dm.duong_dan_dm?.toLowerCase().includes(keyword) ||
          dm.mo_ta?.toLowerCase().includes(keyword)
      );
    }

    // Khi không tìm kiếm: hiển thị cấu trúc phân cấp
    const rootCategories = danhSach.filter((dm) => !dm.parent_id);
    const result = [];

    rootCategories.forEach((parent) => {
      const children = danhSach.filter((dm) => dm.parent_id === parent.id);
      result.push({
        ...parent,
        so_danh_muc_con: children.length,
        laCon: false,
      });

      children.forEach((child) => {
        result.push({
          ...child,
          tenDanhMucCha: parent.ten_danh_muc,
          laCon: true,
        });
      });
    });

    return result;
  }, [danhSach, tuKhoaTimKiem]);

  // Mở modal sửa
  const moModalSua = (dm) => {
    setIdDangSua(dm.id);
    setDuLieuForm({
      parent_id: dm.parent_id || '',
      ten_danh_muc: dm.ten_danh_muc || '',
      duong_dan_dm: dm.duong_dan_dm || '',
      hinh_anh: dm.hinh_anh || '',
      mo_ta: dm.mo_ta || '',
      sp_noi_bat: !!dm.sp_noi_bat,
    });
    setDanhSachLoi({});
    setMoModal(true);
  };

  // Mở modal thêm mới
  const moModalThem = () => {
    setIdDangSua(null);
    setDuLieuForm(GIA_TRI_MAC_DINH);
    setDanhSachLoi({});
    setMoModal(true);
  };

  // Xử lý Thêm/Sửa
  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});
    setDangLuu(true);

    try {
      if (idDangSua) {
        await dichVuDanhMuc.capNhat(idDangSua, duLieuForm);
        hienThongBao('Cập nhật danh mục thành công!', 'success');
      } else {
        await dichVuDanhMuc.themMoi(duLieuForm);
        hienThongBao('Thêm danh mục mới thành công!', 'success');
      }
      setMoModal(false);
      taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors || {});
      } else {
        hienThongBao(
          err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!',
          'error'
        );
      }
    } finally {
      setDangLuu(false);
    }
  };

  // Xử lý Xóa danh mục
  const xuLyXoa = async (id, ten) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${ten}"?`)) {
      try {
        await dichVuDanhMuc.xoa(id);
        hienThongBao('Xóa danh mục thành công!', 'success');
        taiDanhSach();
      } catch (err) {
        hienThongBao(
          err.response?.data?.message || 'Không thể xóa danh mục này!',
          'error'
        );
      }
    }
  };

  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />

      {/* Header & Tiêu đề */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🗂️</span> Quản Lý Danh Mục
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số danh mục:{' '}
            <span className="font-semibold text-emerald-600">
              {danhSach.length}
            </span>
          </p>
        </div>

        <button
          onClick={moModalThem}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>➕</span> Thêm danh mục
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục theo tên, slug, mô tả..."
            value={tuKhoaTimKiem}
            onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Bảng Danh sách */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-4 w-16">ID</th>
              <th className="p-4 w-20">Hình ảnh</th>
              <th className="p-4">Tên danh mục</th>
              <th className="p-4 text-center w-36">Cấp danh mục</th>
              <th className="p-4 text-center w-28">Nổi bật</th>
              <th className="p-4 text-center w-36">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {dangTai ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : danhMucHienThi.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  {tuKhoaTimKiem
                    ? 'Không tìm thấy danh mục nào phù hợp.'
                    : 'Chưa có danh mục nào.'}
                </td>
              </tr>
            ) : (
              danhMucHienThi.map((dm) => (
                <HangDanhMuc
                  key={dm.id}
                  dm={dm}
                  moModalSua={moModalSua}
                  xuLyXoa={xuLyXoa}
                  laDanhMucCon={dm.laCon}
                  tenDanhMucCha={dm.tenDanhMucCha}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm / Sửa */}
      <ModalFormDanhMuc
        moModal={moModal}
        dongModal={() => setMoModal(false)}
        idDangSua={idDangSua}
        duLieuForm={duLieuForm}
        setDuLieuForm={setDuLieuForm}
        danhSachCha={danhSachDanhMucCha.filter((dm) => dm.id !== idDangSua)}
        danhSachLoi={danhSachLoi}
        xuLyGuiForm={xuLyGuiForm}
        dangLuu={dangLuu}
      />
    </div>
  );
}