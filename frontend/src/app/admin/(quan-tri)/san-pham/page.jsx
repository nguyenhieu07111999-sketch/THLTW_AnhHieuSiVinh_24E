// src/app/admin/(quan-tri)/san-pham/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { dichVuSanPham } from '@/services/dich-vu-san-pham';
import FormSanPhamModal from '@/components/san-pham/form-san-pham-modal';

export default function QuanLySanPhamPage() {
  // Trạng thái dữ liệu
  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState([]);

  // Trạng thái điều khiển giao diện
  const [dangTai, setDangTai] = useState(false);
  const [moModal, setMoModal] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState(null);
  const [idDangSua, setIdDangSua] = useState(null);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangXemThungRac, setDangXemThungRac] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Giá trị khởi tạo Form
  const giaTriFormMacDinh = {
    danh_muc_id: '',
    thuong_hieu_id: '',
    ten_san_pham: '',
    duong_dan_sp: '',
    hinh_anh: '',
    gia_ban: '',
    gia_giam: '',
    so_luong_ton_kho: 0,
    don_vi_tinh: 'Kg',
    mo_ta_ngan: '',
    chi_tiet: '',
    trang_thai: 'hien_thi',
  };

  const [duLieuForm, setDuLieuForm] = useState(giaTriFormMacDinh);

  // Hàm tải lại danh sách sản phẩm
  const taiDanhSach = async () => {
    try {
      const res = dangXemThungRac
        ? await dichVuSanPham.layThungRac()
        : await dichVuSanPham.layDanhSach();
      setDanhSachSanPham(res.data.data || res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm:', err);
    }
  };

  // useEffect tự kích hoạt lấy dữ liệu chuẩn React & an toàn
  useEffect(() => {
    let isMounted = true;

    const layDuLieu = async () => {
      setDangTai(true);

      // 1. Tải danh sách sản phẩm
      try {
        const resSP = dangXemThungRac
          ? await dichVuSanPham.layThungRac()
          : await dichVuSanPham.layDanhSach();
        if (isMounted) setDanhSachSanPham(resSP.data.data || resSP.data);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
      }

      // 2. Tải danh mục (Bọc try-catch riêng để tránh lỗi 500 khi partner chưa làm xong)
      if (dichVuSanPham.layDanhMuc) {
        try {
          const resDM = await dichVuSanPham.layDanhMuc();
          if (isMounted) setDanhSachDanhMuc(resDM.data.data || resDM.data);
        } catch (err) {
          console.warn('API Danh mục chưa sẵn sàng:', err);
        }
      }

      // 3. Tải thương hiệu
      if (dichVuSanPham.layThuongHieu) {
        try {
          const resTH = await dichVuSanPham.layThuongHieu();
          if (isMounted) setDanhSachThuongHieu(resTH.data.data || resTH.data);
        } catch (err) {
          console.warn('API Thương hiệu chưa sẵn sàng:', err);
        }
      }

      if (isMounted) setDangTai(false);
    };

    layDuLieu();

    return () => {
      isMounted = false;
    };
  }, [dangXemThungRac]);

  // Xử lý Thêm mới / Cập nhật sản phẩm
  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});
    try {
      if (idDangSua) {
        await dichVuSanPham.capNhat(idDangSua, duLieuForm);
        alert('Cập nhật sản phẩm thành công!');
      } else {
        await dichVuSanPham.themMoi(duLieuForm);
        alert('Thêm sản phẩm thành công!');
      }
      setMoModal(false);
      taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors);
      } else {
        alert('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  // Đổi trạng thái Ẩn / Hiện
  const xuLyDoiTrangThai = async (sp) => {
    const trangThaiMoi = sp.trang_thai === 'hien_thi' ? 'an' : 'hien_thi';
    try {
      setDanhSachSanPham((prev) =>
        prev.map((item) => (item.id === sp.id ? { ...item, trang_thai: trangThaiMoi } : item))
      );
      if (dichVuSanPham.capNhat) {
        await dichVuSanPham.capNhat(sp.id, { ...sp, trang_thai: trangThaiMoi });
      }
    } catch (err) {
      alert('Không thể thay đổi trạng thái!');
      taiDanhSach();
    }
  };

  // Sao chép sản phẩm (Duplicate)
  const xuLySaoChep = (sp) => {
    setIdDangSua(null);
    setDuLieuForm({
      ...sp,
      ten_san_pham: `${sp.ten_san_pham} (Bản sao)`,
      duong_dan_sp: sp.duong_dan_sp ? `${sp.duong_dan_sp}-copy` : '',
    });
    setDanhSachLoi({});
    setOpenDropdownId(null);
    setMoModal(true);
  };

  // Xử lý Xóa tạm
  const xuLyXoaTam = async (id) => {
    if (confirm('Bạn có chắc chắn muốn chuyển sản phẩm này vào thùng rác?')) {
      try {
        await dichVuSanPham.xoaTam(id);
        taiDanhSach();
      } catch (err) {
        alert('Không thể chuyển sản phẩm vào thùng rác!');
      }
    }
  };

  // Xử lý Khôi phục
  const xuLyKhoiPhuc = async (id) => {
    try {
      await dichVuSanPham.khoiPhuc(id);
      alert('Khôi phục sản phẩm thành công!');
      taiDanhSach();
    } catch (err) {
      alert('Lỗi khi khôi phục sản phẩm!');
    }
  };

  // Xử lý Xóa vĩnh viễn
  const xuLyXoaVinhVien = async (id) => {
    if (confirm('CẢNH BÁO: Sản phẩm sẽ bị XÓA VĨNH VIỄN khỏi cơ sở dữ liệu!')) {
      try {
        await dichVuSanPham.xoaVinhVien(id);
        taiDanhSach();
      } catch (err) {
        alert('Không thể xóa vĩnh viễn sản phẩm!');
      }
    }
  };

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {dangXemThungRac ? '🗑 Thùng Rác Sản Phẩm' : '📦 Quản Lý Sản Phẩm'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDangXemThungRac(!dangXemThungRac)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
              dangXemThungRac
                ? 'bg-amber-100 border-amber-300 text-amber-800'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {dangXemThungRac ? '← Quay lại Danh sách' : '🗑 Xem Thùng rác'}
          </button>
          {!dangXemThungRac && (
            <button
              onClick={() => {
                setIdDangSua(null);
                setDuLieuForm(giaTriFormMacDinh);
                setDanhSachLoi({});
                setMoModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
            >
              + Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Số lượng tồn</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {dangTai ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachSanPham.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  Không có sản phẩm nào.
                </td>
              </tr>
            ) : (
              danhSachSanPham.map((sp) => (
                <tr key={sp.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-gray-500">#{sp.id}</td>
                  <td className="p-4">
                    <img
                      src={sp.hinh_anh || 'https://via.placeholder.com/48'}
                      alt={sp.ten_san_pham}
                      className="w-12 h-12 object-cover rounded-lg border"
                    />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{sp.ten_san_pham}</td>
                  <td className="p-4 text-emerald-600 font-medium">
                    {Number(sp.gia_ban).toLocaleString('vi-VN')} đ
                  </td>
                  <td className="p-4">
                    {sp.so_luong_ton_kho} <span className="text-xs text-gray-400">{sp.don_vi_tinh}</span>
                  </td>

                  {/* Cột Trạng Thái Toggle Switch */}
                  <td className="p-4 text-center">
                    {!dangXemThungRac ? (
                      <button
                        onClick={() => xuLyDoiTrangThai(sp)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          sp.trang_thai === 'hien_thi' ? 'bg-emerald-500' : 'bg-gray-300'
                        }`}
                        title={sp.trang_thai === 'hien_thi' ? 'Đang Hiển thị' : 'Đang Ẩn'}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            sp.trang_thai === 'hien_thi' ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                        Đã xóa
                      </span>
                    )}
                  </td>

                  {/* Cột Thao Tác Tích Hợp Nâng Cao */}
                  <td className="p-4 text-center relative">
                    {!dangXemThungRac ? (
                      <div className="flex justify-center items-center gap-1.5">
                        {/* Xem chi tiết */}
                        <button
                          onClick={() => {
                            setSanPhamChiTiet(sp);
                            setMoModalChiTiet(true);
                          }}
                          className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
                          title="Xem chi tiết"
                        >
                          👁
                        </button>

                        {/* Sửa */}
                        <button
                          onClick={() => {
                            setIdDangSua(sp.id);
                            setDuLieuForm(sp);
                            setDanhSachLoi({});
                            setMoModal(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-medium text-xs"
                          title="Chỉnh sửa"
                        >
                          ✏️
                        </button>

                        {/* Xem ngoài trang bán hàng */}
                        <a
                          href={`/san-pham/${sp.duong_dan_sp || sp.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"
                          title="Xem ngoài trang bán hàng"
                        >
                          ↗️
                        </a>

                        {/* Menu thả xuống */}
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setOpenDropdownId(openDropdownId === sp.id ? null : sp.id)
                            }
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg font-bold"
                          >
                            ⋮
                          </button>

                          {openDropdownId === sp.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 text-left">
                              <button
                                onClick={() => xuLySaoChep(sp)}
                                className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                📋 Sao chép
                              </button>
                              <hr className="my-1 border-gray-100" />
                              <button
                                onClick={() => {
                                  setOpenDropdownId(null);
                                  xuLyXoaTam(sp.id);
                                }}
                                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                🗑 Chuyển thùng rác
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Thao tác Thùng Rác */
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => xuLyKhoiPhuc(sp.id)}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs font-medium"
                        >
                          Khôi phục
                        </button>
                        <button
                          onClick={() => xuLyXoaVinhVien(sp.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs font-medium"
                        >
                          Xóa hẳn
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal Thêm / Sửa */}
      <FormSanPhamModal
        isModalOpen={moModal}
        setIsModalOpen={setMoModal}
        editingId={idDangSua}
        formData={duLieuForm}
        setFormData={setDuLieuForm}
        categories={danhSachDanhMuc}
        brands={danhSachThuongHieu}
        errors={danhSachLoi}
        handleSubmit={xuLyGuiForm}
      />

      {/* Modal Xem Chi Tiết */}
      {moModalChiTiet && sanPhamChiTiet && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              🔍 Chi Tiết Sản Phẩm #{sanPhamChiTiet.id}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-center mb-4">
                <img
                  src={sanPhamChiTiet.hinh_anh || 'https://via.placeholder.com/120'}
                  alt={sanPhamChiTiet.ten_san_pham}
                  className="w-32 h-32 object-cover rounded-xl border shadow-sm"
                />
              </div>
              <p><strong>Tên sản phẩm:</strong> {sanPhamChiTiet.ten_san_pham}</p>
              <p><strong>Đường dẫn (Slug):</strong> {sanPhamChiTiet.duong_dan_sp || 'Chưa thiết lập'}</p>
              <p>
                <strong>Giá bán:</strong>{' '}
                <span className="text-emerald-600 font-semibold">
                  {Number(sanPhamChiTiet.gia_ban).toLocaleString('vi-VN')} đ
                </span>
              </p>
              <p>
                <strong>Tồn kho:</strong> {sanPhamChiTiet.so_luong_ton_kho} {sanPhamChiTiet.don_vi_tinh}
              </p>
              <p><strong>Mô tả ngắn:</strong> {sanPhamChiTiet.mo_ta_ngan || 'Không có mô tả'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMoModalChiTiet(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
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