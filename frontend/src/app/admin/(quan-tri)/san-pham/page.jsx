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
  const [idDangSua, setIdDangSua] = useState(null);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangXemThungRac, setDangXemThungRac] = useState(false);

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

  // Hàm tải lại danh sách sản phẩm (dùng sau khi Thêm / Sửa / Xóa)
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

  // useEffect tự kích hoạt lấy dữ liệu chuẩn React
  useEffect(() => {
    let isMounted = true;

    const layDuLieu = async () => {
      setDangTai(true);
      try {
        // Tải sản phẩm
        const resSP = dangXemThungRac
          ? await dichVuSanPham.layThungRac()
          : await dichVuSanPham.layDanhSach();
        
        // Tải danh mục và thương hiệu nếu chưa có
        let resDM, resTH;
        if (dichVuSanPham.layDanhMuc && dichVuSanPham.layThuongHieu) {
          [resDM, resTH] = await Promise.all([
            dichVuSanPham.layDanhMuc(),
            dichVuSanPham.layThuongHieu(),
          ]);
        }

        if (isMounted) {
          setDanhSachSanPham(resSP.data.data || resSP.data);
          if (resDM) setDanhSachDanhMuc(resDM.data.data || resDM.data);
          if (resTH) setDanhSachThuongHieu(resTH.data.data || resTH.data);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        if (isMounted) setDangTai(false);
      }
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

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b text-xs uppercase text-gray-600 font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Số lượng tồn</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {dangTai ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : danhSachSanPham.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
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
                  <td className="p-4 text-center">
                    {!dangXemThungRac ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setIdDangSua(sp.id);
                            setDuLieuForm(sp);
                            setDanhSachLoi({});
                            setMoModal(true);
                          }}
                          className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-xs font-medium"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => xuLyXoaTam(sp.id)}
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    ) : (
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
    </div>
  );
}