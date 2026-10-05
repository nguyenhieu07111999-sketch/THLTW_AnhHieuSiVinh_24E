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
  const [tepHinhAnh, setTepHinhAnh] = useState(null);
  const [anhXemTruoc, setAnhXemTruoc] = useState('');
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [phanTrang, setPhanTrang] = useState({ current_page: 1, last_page: 1, per_page: 8, total: 0 });
  const soSanPhamMoiTrang = 8;

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
  const taiDanhSach = async (trang = trangHienTai) => {
    try {
      const res = dangXemThungRac
        ? await dichVuSanPham.layThungRac(trang)
        : await dichVuSanPham.layDanhSach({ per_page: soSanPhamMoiTrang, page: trang });
      const meta = res.data.meta || {};
      const lastPage = Number(meta.last_page) || 1;
      if (trang > lastPage) {
        setTrangHienTai(lastPage);
        return;
      }
      setDanhSachSanPham(res.data.data || res.data);
      setPhanTrang({
        current_page: Number(meta.current_page) || trang,
        last_page: lastPage,
        per_page: Number(meta.per_page) || soSanPhamMoiTrang,
        total: Number(meta.total) || 0,
      });
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
          ? await dichVuSanPham.layThungRac(trangHienTai)
          : await dichVuSanPham.layDanhSach({ per_page: soSanPhamMoiTrang, page: trangHienTai });
        
        // Tải danh mục và thương hiệu nếu chưa có
        let resTH;
        if (dichVuSanPham.layDanhMuc && dichVuSanPham.layThuongHieu) {
          [resTH] = await Promise.all([dichVuSanPham.layThuongHieu()]);

          const resTrangDanhMucDau = await dichVuSanPham.layDanhMuc({
            per_page: 200,
            page: 1,
          });
          const danhMucCha = resTrangDanhMucDau.data.data || resTrangDanhMucDau.data;
          const danhSachDanhMucDayDu = Array.isArray(danhMucCha) ? [...danhMucCha] : [];
          const tongTrangDanhMuc = Number(resTrangDanhMucDau.data.meta?.last_page) || 1;

          for (let page = 2; page <= tongTrangDanhMuc; page += 1) {
            const resTrangDanhMuc = await dichVuSanPham.layDanhMuc({
              per_page: 200,
              page,
            });
            const danhMucTrang = resTrangDanhMuc.data.data || resTrangDanhMuc.data;
            if (Array.isArray(danhMucTrang)) danhSachDanhMucDayDu.push(...danhMucTrang);
          }

          const danhSachDanhMucDeChon = danhSachDanhMucDayDu.flatMap((danhMuc) => [
            {
              ...danhMuc,
              ten_hien_thi: `Danh mục cha: ${danhMuc.ten_danh_muc}`,
            },
            ...(danhMuc.children || []).map((danhMucCon) => ({
              ...danhMucCon,
              ten_hien_thi: `↳ ${danhMucCon.ten_danh_muc} (thuộc ${danhMuc.ten_danh_muc})`,
            })),
          ]);

          if (isMounted) setDanhSachDanhMuc(danhSachDanhMucDeChon);
        }

        if (isMounted) {
          const meta = resSP.data.meta || {};
          const lastPage = Number(meta.last_page) || 1;
          if (trangHienTai > lastPage) {
            setTrangHienTai(lastPage);
          } else {
            setDanhSachSanPham(resSP.data.data || resSP.data);
            setPhanTrang({
              current_page: Number(meta.current_page) || trangHienTai,
              last_page: lastPage,
              per_page: Number(meta.per_page) || soSanPhamMoiTrang,
              total: Number(meta.total) || 0,
            });
          }
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
  }, [dangXemThungRac, trangHienTai]);

  // Xử lý Thêm mới / Cập nhật sản phẩm
  const xuLyGuiForm = async (e) => {
    e.preventDefault();
    setDanhSachLoi({});
    const payload = {
      ...duLieuForm,
      danh_muc_id: Number(duLieuForm.danh_muc_id),
      thuong_hieu_id: duLieuForm.thuong_hieu_id ? Number(duLieuForm.thuong_hieu_id) : null,
      gia_ban: Number(duLieuForm.gia_ban),
      gia_giam: duLieuForm.gia_giam === '' ? null : Number(duLieuForm.gia_giam),
      so_luong_ton_kho: Number(duLieuForm.so_luong_ton_kho),
      duong_dan_sp: duLieuForm.duong_dan_sp?.trim() || null,
      don_vi_tinh: duLieuForm.don_vi_tinh?.trim() || null,
      mo_ta_ngan: duLieuForm.mo_ta_ngan?.trim() || null,
      chi_tiet: duLieuForm.chi_tiet?.trim() || null,
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, String(value));
    });
    if (tepHinhAnh) formData.append('hinh_anh', tepHinhAnh);

    try {
      if (idDangSua) {
        await dichVuSanPham.capNhat(idDangSua, formData);
        alert('Cập nhật sản phẩm thành công!');
        setMoModal(false);
        setTepHinhAnh(null);
        setAnhXemTruoc('');
        await taiDanhSach();
      } else {
        await dichVuSanPham.themMoi(formData);
        alert('Thêm sản phẩm thành công!');
        setTrangHienTai(1);
        setMoModal(false);
        setTepHinhAnh(null);
        setAnhXemTruoc('');
        await taiDanhSach(1);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors || {};
        setDanhSachLoi(errors);
        const loiDauTien = Object.values(errors).flat()[0];
        if (loiDauTien) alert(loiDauTien);
      } else {
        alert(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  // Xử lý Xóa tạm
  const xuLyXoaTam = async (id) => {
    if (confirm('Bạn có chắc chắn muốn chuyển sản phẩm này vào thùng rác?')) {
      try {
        await dichVuSanPham.xoaTam(id);
        await taiDanhSach();
        alert('Đã chuyển sản phẩm vào thùng rác!');
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể chuyển sản phẩm vào thùng rác!');
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
      alert(err.response?.data?.message || 'Lỗi khi khôi phục sản phẩm!');
    }
  };

  // Xử lý Xóa vĩnh viễn
  const xuLyXoaVinhVien = async (id) => {
    if (confirm('CẢNH BÁO: Sản phẩm sẽ bị XÓA VĨNH VIỄN khỏi cơ sở dữ liệu!')) {
      try {
        await dichVuSanPham.xoaVinhVien(id);
        await taiDanhSach();
        alert('Đã xóa vĩnh viễn sản phẩm!');
      } catch (err) {
        alert(err.response?.data?.message || 'Không thể xóa vĩnh viễn sản phẩm!');
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
            onClick={() => {
              setTrangHienTai(1);
              setDangXemThungRac(!dangXemThungRac);
            }}
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
                setTepHinhAnh(null);
                setAnhXemTruoc('');
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
                            setTepHinhAnh(null);
                            setAnhXemTruoc(sp.hinh_anh || '');
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
        {!dangTai && phanTrang.total > 0 && (
          <div className="bg-gray-50 border-t px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
            <span>
              Hiển thị {(phanTrang.current_page - 1) * phanTrang.per_page + 1}–{Math.min(phanTrang.current_page * phanTrang.per_page, phanTrang.total)} trong tổng số {phanTrang.total} sản phẩm
            </span>
            {phanTrang.last_page > 1 && (
              <nav aria-label="Phân trang sản phẩm" className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={trangHienTai <= 1}
                  onClick={() => setTrangHienTai(Math.max(1, trangHienTai - 1))}
                  className="px-3 h-8 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                {Array.from({ length: phanTrang.last_page }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setTrangHienTai(page)}
                    aria-label={`Trang ${page}`}
                    aria-current={trangHienTai === page ? 'page' : undefined}
                    className={`w-8 h-8 rounded font-medium ${
                      trangHienTai === page
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={trangHienTai >= phanTrang.last_page}
                  onClick={() => setTrangHienTai(Math.min(phanTrang.last_page, trangHienTai + 1))}
                  className="px-3 h-8 rounded border border-gray-300 bg-white hover:bg-gray-100 disabled:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </nav>
            )}
          </div>
        )}
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
        imageFile={tepHinhAnh}
        setImageFile={setTepHinhAnh}
        imagePreview={anhXemTruoc}
        setImagePreview={setAnhXemTruoc}
      />
    </div>
  );
}