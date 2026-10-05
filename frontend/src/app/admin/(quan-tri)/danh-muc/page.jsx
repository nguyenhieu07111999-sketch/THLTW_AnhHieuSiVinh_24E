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
    </div>
  );
}