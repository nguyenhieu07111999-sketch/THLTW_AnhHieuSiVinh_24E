// src/app/admin/(quan-tri)/danh-muc/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dichVuDanhMuc } from '@/services/dich-vu-danh-muc';
import FormDanhMucModal from '@/components/danh-muc/form-danh-muc-modal';

export default function QuanLyDanhMucPage() {
  // Trạng thái dữ liệu
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState('');

  // Trạng thái điều khiển Modal
  const [moModal, setMoModal] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [danhMucChiTiet, setDanhMucChiTiet] = useState(null);
  const [idDangSua, setIdDangSua] = useState(null);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Giá trị khởi tạo Form
  const giaTriFormMacDinh = {
    ten_danh_muc: '',
    duong_dan_dm: '',
    hinh_anh: '',
    mo_ta: '',
    sp_noi_bat: false,
  };

  const [duLieuForm, setDuLieuForm] = useState(giaTriFormMacDinh);

  // Tải danh sách danh mục từ API
  const taiDanhSach = async () => {
    setDangTai(true);
    try {
      const res = await dichVuDanhMuc.layDanhSach({ all: 1 });
      const data = res.data?.data || res.data || [];
      setDanhSachDanhMuc(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi khi tải danh mục:', err);
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDanhSach();
  }, []);

  // Xử lý gửi Form Thêm mới / Cập nhật
  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});
    try {
      if (idDangSua) {
        await dichVuDanhMuc.capNhat(idDangSua, duLieuForm);
        alert('Cập nhật danh mục thành công!');
      } else {
        await dichVuDanhMuc.themMoi(duLieuForm);
        alert('Thêm danh mục mới thành công!');
      }
      setMoModal(false);
      taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors || {});
      } else {
        alert(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  // Đổi trạng thái Nổi bật (Toggle switch)
  const xuLyDoiNoiBat = async (dm) => {
    const giaTriMoi = !dm.sp_noi_bat;
    try {
      setDanhSachDanhMuc((prev) =>
        prev.map((item) =>
          item.id === dm.id ? { ...item, sp_noi_bat: giaTriMoi } : item
        )
      );
      await dichVuDanhMuc.capNhat(dm.id, {
        ...dm,
        sp_noi_bat: giaTriMoi,
      });
    } catch (err) {
      alert('Không thể thay đổi trạng thái nổi bật!');
      taiDanhSach();
    }
  };

  // Sao chép danh mục (Duplicate)
  const xuLySaoChep = (dm) => {
    setIdDangSua(null);
    setDuLieuForm({
      ten_danh_muc: `${dm.ten_danh_muc} (Bản sao)`,
      duong_dan_dm: dm.duong_dan_dm ? `${dm.duong_dan_dm}-copy` : '',
      hinh_anh: dm.hinh_anh || '',
      mo_ta: dm.mo_ta || '',
      sp_noi_bat: dm.sp_noi_bat || false,
    });
    setDanhSachLoi({});
    setOpenDropdownId(null);
    setMoModal(true);
  };

  // Xử lý Xóa danh mục
  const xuLyXoa = async (id, ten) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${ten}"?`)) {
      try {
        await dichVuDanhMuc.xoa(id);
        alert('Xóa danh mục thành công!');
        taiDanhSach();
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa danh mục!');
      }
    }
  };

  // Danh mục lọc theo từ khóa tìm kiếm
  const danhMucHienThi = danhSachDanhMuc.filter((dm) => {
    const keyword = tuKhoaTimKiem.toLowerCase().trim();
    if (!keyword) return true;
    return (
      dm.ten_danh_muc?.toLowerCase().includes(keyword) ||
      dm.duong_dan_dm?.toLowerCase().includes(keyword) ||
      dm.mo_ta?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="p-6 font-sans">
      {/* Tiêu đề & Nút thao tác */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🗂️</span> Quản Lý Danh Mục
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số: <span className="font-semibold text-emerald-600">{danhSachDanhMuc.length}</span> danh mục
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              setIdDangSua(null);
              setDuLieuForm(giaTriFormMacDinh);
              setDanhSachLoi({});
              setMoModal(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>➕</span> Thêm danh mục
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục theo tên, slug..."
            value={tuKhoaTimKiem}
            onChange={(e) => setTuKhoaTimKiem(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Bảng danh sách danh mục */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-4 w-16">ID</th>
              <th className="p-4 w-20">Hình ảnh</th>
              <th className="p-4">Tên danh mục</th>
              <th className="p-4">Đường dẫn (Slug)</th>
              <th className="p-4">Mô tả</th>
              <th className="p-4 text-center w-28">Nổi bật</th>
              <th className="p-4 text-center w-36">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {dangTai ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : danhMucHienThi.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  {tuKhoaTimKiem
                    ? 'Không tìm thấy danh mục nào phù hợp.'
                    : 'Chưa có danh mục nào.'}
                </td>
              </tr>
            ) : (
              danhMucHienThi.map((dm) => (
                <tr key={dm.id} className="hover:bg-gray-50/80 transition">
                  {/* Cột ID */}
                  <td className="p-4 font-mono text-gray-500 text-xs">#{dm.id}</td>

                  {/* Cột Hình ảnh */}
                  <td className="p-4">
                    {dm.hinh_anh ? (
                      <img
                        src={dm.hinh_anh}
                        alt={dm.ten_danh_muc}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/48?text=DM';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl text-emerald-600">
                        🧺
                      </div>
                    )}
                  </td>

                  {/* Cột Tên danh mục */}
                  <td className="p-4 font-medium text-gray-900">
                    {dm.ten_danh_muc}
                  </td>

                  {/* Cột Đường dẫn */}
                  <td className="p-4 font-mono text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {dm.duong_dan_dm || '-'}
                    </span>
                  </td>

                  {/* Cột Mô tả */}
                  <td className="p-4 text-gray-500 text-xs max-w-xs truncate">
                    {dm.mo_ta || <span className="text-gray-400 italic">Chưa có mô tả</span>}
                  </td>

                  {/* Cột Nổi bật Toggle Switch */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => xuLyDoiNoiBat(dm)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                        dm.sp_noi_bat ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                      title={dm.sp_noi_bat ? 'Đang bật nổi bật' : 'Tắt nổi bật'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          dm.sp_noi_bat ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>

                  {/* Cột Thao tác */}
                  <td className="p-4 text-center relative">
                    <div className="flex justify-center items-center gap-1.5">
                      {/* Xem chi tiết */}
                      <button
                        onClick={() => {
                          setDanhMucChiTiet(dm);
                          setMoModalChiTiet(true);
                        }}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
                        title="Xem chi tiết"
                      >
                        👁
                      </button>

                      {/* Chỉnh sửa */}
                      <button
                        onClick={() => {
                          setIdDangSua(dm.id);
                          setDuLieuForm({
                            ten_danh_muc: dm.ten_danh_muc || '',
                            duong_dan_dm: dm.duong_dan_dm || '',
                            hinh_anh: dm.hinh_anh || '',
                            mo_ta: dm.mo_ta || '',
                            sp_noi_bat: !!dm.sp_noi_bat,
                          });
                          setDanhSachLoi({});
                          setMoModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-xs cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>

                      {/* Xem ngoài trang khách hàng */}
                      <Link
                        href={`/danh-muc`}
                        target="_blank"
                        className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg cursor-pointer"
                        title="Xem ngoài trang cửa hàng"
                      >
                        ↗️
                      </Link>

                      {/* Dropdown Action Menu */}
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() =>
                            setOpenDropdownId(openDropdownId === dm.id ? null : dm.id)
                          }
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg font-bold cursor-pointer"
                        >
                          ⋮
                        </button>

                        {openDropdownId === dm.id && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left">
                            <button
                              onClick={() => xuLySaoChep(dm)}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                            >
                              📋 Sao chép
                            </button>
                            <hr className="my-1 border-gray-100" />
                            <button
                              onClick={() => {
                                setOpenDropdownId(null);
                                xuLyXoa(dm.id, dm.ten_danh_muc);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                            >
                              🗑 Xóa danh mục
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal Thêm / Sửa */}
      <FormDanhMucModal
        isModalOpen={moModal}
        setIsModalOpen={setMoModal}
        editingId={idDangSua}
        formData={duLieuForm}
        setFormData={setDuLieuForm}
        errors={danhSachLoi}
        handleSubmit={xuLyGuiForm}
      />

      {/* Modal Xem Chi Tiết */}
      {moModalChiTiet && danhMucChiTiet && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              🔍 Chi Tiết Danh Mục #{danhMucChiTiet.id}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-center mb-4">
                {danhMucChiTiet.hinh_anh ? (
                  <img
                    src={danhMucChiTiet.hinh_anh}
                    alt={danhMucChiTiet.ten_danh_muc}
                    className="w-28 h-28 object-cover rounded-xl border shadow-sm"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/112?text=DM';
                    }}
                  />
                ) : (
                  <div className="w-28 h-28 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-4xl text-emerald-600">
                    🧺
                  </div>
                )}
              </div>
              <p>
                <strong>Tên danh mục:</strong> {danhMucChiTiet.ten_danh_muc}
              </p>
              <p>
                <strong>Đường dẫn (Slug):</strong>{' '}
                <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {danhMucChiTiet.duong_dan_dm || 'Chưa thiết lập'}
                </span>
              </p>
              <p>
                <strong>Sản phẩm nổi bật:</strong>{' '}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    danhMucChiTiet.sp_noi_bat
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {danhMucChiTiet.sp_noi_bat ? 'Có nổi bật' : 'Bình thường'}
                </span>
              </p>
              <p>
                <strong>Mô tả:</strong>{' '}
                {danhMucChiTiet.mo_ta || <span className="italic text-gray-400">Không có mô tả</span>}
              </p>
              {danhMucChiTiet.ngay_tao && (
                <p className="text-xs text-gray-500">
                  <strong>Ngày tạo:</strong> {danhMucChiTiet.ngay_tao}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMoModalChiTiet(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
=======
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    loai === 'success' ? 'bg-green-600' :
    loai === 'error'   ? 'bg-red-600'   :
                         'bg-amber-500';
  const icon = loai === 'success' ? '✅' : loai === 'error' ? '❌' : '⚠️';
  return (
    <div className={`fixed bottom-6 right-6 z-[100] ${mau} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2`}>
      {icon} {thongBao}
>>>>>>> main
    </div>
  );
}

// ─── Component Modal Form Danh Mục ──────────────────────────────────────────
function ModalFormDanhMuc({ moModal, dongModal, idDangSua, duLieuForm, setDuLieuForm, danhSachCha, danhSachLoi, xuLyGuiForm, dangLuu }) {
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
            {danhSachLoi.parent_id && <p className="text-red-500 text-xs mt-1">{danhSachLoi.parent_id[0]}</p>}
          </div>

          {/* Tên danh mục */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input type="text" name="ten_danh_muc" value={duLieuForm.ten_danh_muc} onChange={doiGiaTri}
              placeholder="Ví dụ: Rau củ quả"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            {danhSachLoi.ten_danh_muc && <p className="text-red-500 text-xs mt-1">{danhSachLoi.ten_danh_muc[0]}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đường dẫn (slug)</label>
            <input type="text" name="duong_dan_dm" value={duLieuForm.duong_dan_dm} onChange={doiGiaTri}
              placeholder="rau-cu-qua (tự động sinh từ tên)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500" />
            {danhSachLoi.duong_dan_dm && <p className="text-red-500 text-xs mt-1">{danhSachLoi.duong_dan_dm[0]}</p>}
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hình ảnh danh mục
            </label>
            <div className="space-y-3">
              {/* Tùy chọn Tải tệp từ máy hoặc Nhập URL */}
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 border border-dashed border-green-400 bg-green-50/50 hover:bg-green-100/50 rounded-lg py-2.5 px-3 text-xs text-green-700 font-medium transition">
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
                          setDuLieuForm((prev) => ({ ...prev, hinh_anh: reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Ô nhập URL trực tiếp */}
              <div>
                <input
                  type="text"
                  name="hinh_anh"
                  value={duLieuForm.hinh_anh}
                  onChange={doiGiaTri}
                  placeholder="Hoặc dán URL hình ảnh (https://...)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                />
              </div>

              {/* Gợi ý ảnh nhanh */}
              <div>
                <span className="text-[11px] text-gray-400 block mb-1.5 font-medium">Gợi ý ảnh mẫu thực phẩm:</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { label: 'Rau củ', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
                    { label: 'Trái cây', url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300' },
                    { label: 'Thịt tươi', url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300' },
                    { label: 'Hải sản', url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300' },
                    { label: 'Trứng sữa', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300' },
                    { label: 'Nước ép', url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDuLieuForm((prev) => ({ ...prev, hinh_anh: item.url }))}
                      className="flex-shrink-0 flex items-center gap-1 bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-600 px-2 py-1 rounded text-[11px] transition"
                    >
                      <img src={item.url} alt={item.label} className="w-4 h-4 rounded object-cover" />
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
                      e.target.src = 'https://via.placeholder.com/64?text=L%E1%BB%97i+anh';
                    }}
                  />
                  <div className="flex-1 text-xs">
                    <span className="font-semibold text-gray-700 block">Xem trước ảnh danh mục</span>
                    <span className="text-[11px] text-gray-400 block truncate max-w-[200px] font-mono">
                      {duLieuForm.hinh_anh.startsWith('data:') ? 'Ảnh tải từ máy (Base64)' : duLieuForm.hinh_anh}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDuLieuForm((prev) => ({ ...prev, hinh_anh: '' }))}
                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded font-medium transition"
                  >
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
            <input type="checkbox" id="sp_noi_bat" name="sp_noi_bat"
              checked={!!duLieuForm.sp_noi_bat} onChange={doiGiaTri}
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

// ─── Một hàng danh mục ───────────────────────────────────────────────────────
function HangDanhMuc({ dm, moModalSua, xuLyXoa, laDanhMucCon, tenDanhMucCha }) {
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

// ─── Trang chính ─────────────────────────────────────────────────────────────
export default function QuanLyDanhMucPage() {
  const [danhSach, setDanhSach] = useState([]);
  const [dangTai, setDangTai] = useState(false);
  const [dangXemThungRac, setDangXemThungRac] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [boLocDanhMuc, setBoLocDanhMuc] = useState(null);
  const [moModal, setMoModal] = useState(false);
  const [idDangSua, setIdDangSua] = useState(null);
  const [duLieuForm, setDuLieuForm] = useState(GIA_TRI_MAC_DINH);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangLuu, setDangLuu] = useState(false);
  const [idDangThaoTacThungRac, setIdDangThaoTacThungRac] = useState(null);
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
      const layTrang = dangXemThungRac
        ? dichVuDanhMuc.layThungRac
        : dichVuDanhMuc.layDanhSach;
      const danhSachDayDu = [];
      const resTrangDau = await layTrang({ per_page: 200, page: 1 });
      const duLieuTrangDau = resTrangDau.data?.data ?? resTrangDau.data;
      if (Array.isArray(duLieuTrangDau)) {
        danhSachDayDu.push(...duLieuTrangDau);
      }

      const tongSoTrangDanhMuc = Number(resTrangDau.data?.meta?.last_page) || 1;
      for (let page = 2; page <= tongSoTrangDanhMuc; page += 1) {
        const resTrang = await layTrang({ per_page: 200, page });
        const duLieuTrang = resTrang.data?.data ?? resTrang.data;
        if (Array.isArray(duLieuTrang)) {
          danhSachDayDu.push(...duLieuTrang);
        }
      }

      setDanhSach(danhSachDayDu);
    } catch (err) {
      console.error('Lỗi tải danh mục:', err);
      hienThongBao(
        dangXemThungRac
          ? 'Không thể tải thùng rác danh mục!'
          : 'Không thể tải danh sách danh mục!',
        'error'
      );
    } finally {
      setDangTai(false);
    }
  }, [dangXemThungRac]);

  useEffect(() => { taiDanhSach(); }, [taiDanhSach]);

  // Danh mục cha (cấp 1)
  const danhSachCha = useMemo(() => danhSach.filter((dm) => !dm.parent_id), [danhSach]);

  const danhSachDangHienThi = useMemo(() => {
    if (dangXemThungRac) return danhSach;
    const danhSachGoc = danhSach.filter((dm) => !dm.parent_id);
    return danhSachGoc.flatMap((dm) => {
      const danhSachCon = dm.children || [];
      if (boLocDanhMuc === 'cha') {
        return [{ danhMuc: { ...dm, so_danh_muc_con: danhSachCon.length }, laDanhMucCon: false }];
      }
      if (boLocDanhMuc === 'con' && danhSachCon.length === 0) return [];
      const hienDanhMucCha = boLocDanhMuc !== 'noibat' || Boolean(dm.sp_noi_bat);
      const cacDanhMucConHienThi = danhSachCon.filter(
        (con) => boLocDanhMuc !== 'noibat' || Boolean(con.sp_noi_bat)
      );

      return [
        ...(hienDanhMucCha
          ? [{ danhMuc: { ...dm, so_danh_muc_con: danhSachCon.length }, laDanhMucCon: false }]
          : []),
        ...cacDanhMucConHienThi.map((con) => ({
          danhMuc: con,
          laDanhMucCon: true,
          tenDanhMucCha: dm.ten_danh_muc,
        })),
      ];
    });
  }, [danhSach, dangXemThungRac, boLocDanhMuc]);
  const soMucMoiTrang = 8;
  const tongSoTrang = Math.max(1, Math.ceil(danhSachDangHienThi.length / soMucMoiTrang));
  const trangDangXem = Math.min(trangHienTai, tongSoTrang);
  const danhSachTrangHienTai = useMemo(() => {
    const viTriBatDau = (trangDangXem - 1) * soMucMoiTrang;
    return danhSachDangHienThi.slice(viTriBatDau, viTriBatDau + soMucMoiTrang);
  }, [danhSachDangHienThi, trangDangXem]);
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

  const moModalThem = () => {
    setIdDangSua(null);
    setDuLieuForm(GIA_TRI_MAC_DINH);
    setDanhSachLoi({});
    setMoModal(true);
  };

  const moModalSua = (dm) => {
    setIdDangSua(dm.id);
    setDuLieuForm({
      parent_id: dm.parent_id ?? '',
      ten_danh_muc: dm.ten_danh_muc ?? '',
      duong_dan_dm: dm.duong_dan_dm ?? '',
      hinh_anh: dm.hinh_anh ?? '',
      mo_ta: dm.mo_ta ?? '',
      sp_noi_bat: dm.sp_noi_bat ?? false,
    });
    setDanhSachLoi({});
    setMoModal(true);
  };

  const dongModal = () => { if (!dangLuu) setMoModal(false); };

  // Gửi form thêm / cập nhật
  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});
    setDangLuu(true);
    const payload = {
      ...duLieuForm,
      parent_id: duLieuForm.parent_id === '' ? null : Number(duLieuForm.parent_id),
      duong_dan_dm: duLieuForm.duong_dan_dm || undefined,
    };
    try {
      if (idDangSua) {
        await dichVuDanhMuc.capNhat(idDangSua, payload);
        hienThongBao('Cập nhật danh mục thành công!', 'success');
      } else {
        await dichVuDanhMuc.themMoi(payload);
        hienThongBao('Thêm danh mục thành công!', 'success');
      }
      setMoModal(false);
      taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors ?? {});
        hienThongBao('Vui lòng kiểm tra lại thông tin!', 'error');
      } else if (err.response?.status === 409) {
        hienThongBao(err.response.data.message || 'Không thể thực hiện thao tác!', 'error');
      } else {
        hienThongBao('Có lỗi xảy ra, vui lòng thử lại!', 'error');
      }
    } finally {
      setDangLuu(false);
    }
  };

  // Xóa danh mục
  const xuLyXoa = async (id, ten) => {
    if (!confirm(`Chuyển danh mục "${ten}" vào thùng rác?`)) return;
    try {
      await dichVuDanhMuc.xoa(id);
      hienThongBao(`Đã chuyển "${ten}" vào thùng rác!`, 'success');
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 404) {
        await taiDanhSach();
      }
      const msg = err.response?.data?.message || 'Không thể xóa danh mục này!';
      hienThongBao(msg, 'error');
    }
  };

  const xuLyKhoiPhuc = async (danhMuc) => {
    if (idDangThaoTacThungRac !== null) return;
    setIdDangThaoTacThungRac(danhMuc.id);
    try {
      await dichVuDanhMuc.khoiPhuc(danhMuc.id);
      hienThongBao(`Đã khôi phục "${danhMuc.ten_danh_muc}"!`, 'success');
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 404) {
        await taiDanhSach();
      }
      hienThongBao(
        err.response?.data?.message || 'Không thể khôi phục danh mục!',
        'error'
      );
    } finally {
      setIdDangThaoTacThungRac(null);
    }
  };

  const xuLyXoaVinhVien = async (danhMuc) => {
    if (idDangThaoTacThungRac !== null) return;
    if (!window.confirm(
      `Xóa vĩnh viễn danh mục "${danhMuc.ten_danh_muc}"? Thao tác này không thể hoàn tác.`
    )) return;

    setIdDangThaoTacThungRac(danhMuc.id);
    try {
      await dichVuDanhMuc.xoaVinhVien(danhMuc.id);
      hienThongBao(`Đã xóa vĩnh viễn "${danhMuc.ten_danh_muc}"!`, 'success');
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 404) {
        await taiDanhSach();
      }
      hienThongBao(
        err.response?.data?.message || 'Không thể xóa vĩnh viễn danh mục!',
        'error'
      );
    } finally {
      setIdDangThaoTacThungRac(null);
    }
  };

  const doiCheDoThungRac = () => {
    setTrangHienTai(1);
    setBoLocDanhMuc(null);
    setDangXemThungRac((dangXem) => !dangXem);
  };

  const chonBoLocDanhMuc = (boLoc) => {
    setTrangHienTai(1);
    setBoLocDanhMuc((boLocHienTai) => boLocHienTai === boLoc ? null : boLoc);
  };

  const tongCap1 = dangXemThungRac ? 0 : danhSachCha.length;
  const tongCap2 = dangXemThungRac
    ? 0
    : danhSachCha.reduce((tong, dm) => tong + (dm.children?.length || 0), 0);
  const tongNoiBat = dangXemThungRac
    ? 0
    : danhSachCha.reduce(
        (tong, dm) =>
          tong +
          Number(dm.sp_noi_bat) +
          (dm.children || []).filter((con) => con.sp_noi_bat).length,
        0
      );

  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {dangXemThungRac ? '🗑️ Thùng Rác Danh Mục' : '🗂️ Quản Lý Danh Mục'}
          </h1>
          {!dangXemThungRac && (
            <p className="text-sm text-gray-500 mt-1">Quản lý danh mục 2 cấp: danh mục cha và danh mục con</p>
          )}
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <button
            onClick={doiCheDoThungRac}
            disabled={dangTai}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
              dangXemThungRac
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {dangXemThungRac ? '← Quay lại danh sách' : '🗑 Xem thùng rác'}
          </button>
          {!dangXemThungRac && (
            <button onClick={moModalThem}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2">
              <span>+</span> Thêm danh mục
            </button>
          )}
        </div>
      </div>

      {/* Thống kê */}
      {!dangXemThungRac && <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          type="button"
          onClick={() => chonBoLocDanhMuc('cha')}
          aria-pressed={boLocDanhMuc === 'cha'}
          className={`w-full text-left bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            boLocDanhMuc === 'cha' ? 'border-blue-500 ring-2 ring-blue-200' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-lg">🗂️</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{tongCap1}</div>
            <div className="text-xs text-gray-500 font-medium">Danh mục cha</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => chonBoLocDanhMuc('con')}
          aria-pressed={boLocDanhMuc === 'con'}
          className={`w-full text-left bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
            boLocDanhMuc === 'con' ? 'border-green-500 ring-2 ring-green-200' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 text-lg">📁</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{tongCap2}</div>
            <div className="text-xs text-gray-500 font-medium">Danh mục con</div>
          </div>
        </button>
        <button
          type="button"
          onClick={() => chonBoLocDanhMuc('noibat')}
          aria-pressed={boLocDanhMuc === 'noibat'}
          className={`w-full text-left bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 ${
            boLocDanhMuc === 'noibat' ? 'border-amber-500 ring-2 ring-amber-200' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 text-lg">⭐</div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{tongNoiBat}</div>
            <div className="text-xs text-gray-500 font-medium">Có sản phẩm nổi bật</div>
          </div>
        </button>
      </div>}

      {/* Bảng danh sách */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-4">ID</th>
              {!dangXemThungRac && <th className="p-4">Hình</th>}
              <th className="p-4">Tên danh mục / Slug</th>
              {dangXemThungRac && <th className="p-4">Danh mục cha</th>}
              {!dangXemThungRac && <th className="p-4 text-center">Cấp</th>}
              {!dangXemThungRac && <th className="p-4 text-center">Nổi bật</th>}
              {dangXemThungRac && <th className="p-4">Ngày chuyển vào thùng rác</th>}
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {dangTai ? (
              <tr>
                <td colSpan={dangXemThungRac ? 5 : 6} className="text-center p-10 text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : danhSachDangHienThi.length === 0 ? (
              <tr>
                <td colSpan={dangXemThungRac ? 5 : 6} className="text-center p-10 text-gray-400">
                  <div className="text-4xl mb-2">{dangXemThungRac ? '🗑️' : '🔍'}</div>
                  <div className="font-medium">
                    {dangXemThungRac ? 'Thùng rác danh mục đang trống' : 'Chưa có danh mục nào'}
                  </div>
                </td>
              </tr>
            ) : dangXemThungRac ? (
              danhSachTrangHienTai.map((dm) => (
                <tr key={dm.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-400 text-sm">#{dm.id}</td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-800">{dm.ten_danh_muc}</div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{dm.duong_dan_dm}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {dm.parent?.ten_danh_muc || '—'}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {dm.deleted_at
                      ? new Date(dm.deleted_at).toLocaleString('vi-VN')
                      : '—'}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => xuLyKhoiPhuc(dm)}
                        disabled={idDangThaoTacThungRac !== null}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-medium transition disabled:opacity-50 disabled:cursor-wait"
                      >
                        {idDangThaoTacThungRac === dm.id ? 'Đang khôi phục...' : 'Khôi phục'}
                      </button>
                      <button
                        onClick={() => xuLyXoaVinhVien(dm)}
                        disabled={idDangThaoTacThungRac !== null}
                        className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-medium transition disabled:opacity-50 disabled:cursor-wait"
                      >
                        {idDangThaoTacThungRac === dm.id ? 'Đang xóa...' : 'Xóa hẳn'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              danhSachTrangHienTai.map(({ danhMuc, laDanhMucCon, tenDanhMucCha }) => (
                <HangDanhMuc
                  key={danhMuc.id}
                  dm={danhMuc}
                  moModalSua={moModalSua}
                  xuLyXoa={xuLyXoa}
                  laDanhMucCon={laDanhMucCon}
                  tenDanhMucCha={tenDanhMucCha}
                />
              ))
            )}
          </tbody>
        </table>
        {!dangTai && danhSachDangHienThi.length > 0 && (
          <div className="bg-gray-50 border-t px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
            <span>
              Hiển thị {(trangDangXem - 1) * soMucMoiTrang + 1}–{Math.min(trangDangXem * soMucMoiTrang, danhSachDangHienThi.length)} trong tổng số {danhSachDangHienThi.length} {dangXemThungRac ? 'danh mục trong thùng rác' : 'danh mục cha'}
            </span>
            <nav aria-label="Phân trang danh mục" className="flex items-center gap-1">
              <button
                disabled={trangDangXem <= 1}
                onClick={() => setTrangHienTai(Math.max(1, trangDangXem - 1))}
                aria-label="Trang trước"
                className="px-2.5 h-7 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed font-medium transition"
              >
                ◀ Trước
              </button>
              {trangBatDau > 1 && (
                <>
                  <button
                    onClick={() => setTrangHienTai(1)}
                    aria-label="Trang 1"
                    className="w-7 h-7 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-semibold transition"
                  >
                    1
                  </button>
                  {trangBatDau > 2 && <span className="px-1 text-gray-400" aria-hidden="true">…</span>}
                </>
              )}
              {cacTrangHienThi.map((page) => (
                <button
                  key={page}
                  onClick={() => setTrangHienTai(page)}
                  aria-label={`Trang ${page}`}
                  aria-current={trangDangXem === page ? 'page' : undefined}
                  className={`w-7 h-7 rounded text-xs font-semibold transition ${
                    trangDangXem === page
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              {trangBatDau + soTrangHienThi - 1 < tongSoTrang && (
                <>
                  {trangBatDau + soTrangHienThi < tongSoTrang && (
                    <span className="px-1 text-gray-400" aria-hidden="true">…</span>
                  )}
                  <button
                    onClick={() => setTrangHienTai(tongSoTrang)}
                    aria-label={`Trang ${tongSoTrang}`}
                    className="w-7 h-7 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 font-semibold transition"
                  >
                    {tongSoTrang}
                  </button>
                </>
              )}
              <button
                disabled={trangDangXem >= tongSoTrang}
                onClick={() => setTrangHienTai(Math.min(tongSoTrang, trangDangXem + 1))}
                aria-label="Trang sau"
                className="px-2.5 h-7 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed font-medium transition"
              >
                Sau ▶
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal form */}
      <ModalFormDanhMuc
        moModal={moModal}
        dongModal={dongModal}
        idDangSua={idDangSua}
        duLieuForm={duLieuForm}
        setDuLieuForm={setDuLieuForm}
        danhSachCha={danhSachCha}
        danhSachLoi={danhSachLoi}
        xuLyGuiForm={xuLyGuiForm}
        dangLuu={dangLuu}
      />
    </div>
  );
}
