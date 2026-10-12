'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import FormSanPhamModal from '@/components/san-pham/form-san-pham-modal';
import PhanTrang from '@/components/dieu-huong/phan-trang';
import Toast from '@/components/thong-bao/toast';
import { dichVuSanPham } from '@/services/dich-vu-san-pham';

const SO_SAN_PHAM_MOI_TRANG = 8;

const GIA_TRI_FORM_MAC_DINH = {
  danh_muc_id: '',
  thuong_hieu_id: '',
  ten_san_pham: '',
  duong_dan_sp: '',
  hinh_anh: '',
  hinh_anh_xem_truoc: '',
  gia_ban: '',
  gia_giam: '',
  so_luong_ton_kho: 0,
  don_vi_tinh: 'Kg',
  mo_ta_ngan: '',
  chi_tiet: '',
  trang_thai: 'hien_thi',
};

const layMangDuLieu = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

async function layTatCaSanPham(xemThungRac) {
  const sanPham = [];
  let trang = 1;
  let tongTrang = 1;

  do {
    const response = xemThungRac
      ? await dichVuSanPham.layThungRac(trang)
      : await dichVuSanPham.layDanhSach({ page: trang, per_page: 200 });
    sanPham.push(...layMangDuLieu(response));

    const payload = response?.data;
    const meta = payload?.meta || payload?.data?.meta;
    tongTrang = Math.max(trang, Number(meta?.last_page) || 1);
    trang += 1;
  } while (trang <= tongTrang);

  return sanPham;
}

export default function QuanLySanPhamPage() {
  const [danhSachSanPham, setDanhSachSanPham] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState([]);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [moModal, setMoModal] = useState(false);
  const [moModalChiTiet, setMoModalChiTiet] = useState(false);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState(null);
  const [idDangSua, setIdDangSua] = useState(null);
  const [danhSachLoi, setDanhSachLoi] = useState({});
  const [dangXemThungRac, setDangXemThungRac] = useState(false);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [duLieuForm, setDuLieuForm] = useState(GIA_TRI_FORM_MAC_DINH);
  const [hinhAnhFile, setHinhAnhFile] = useState(null);
  const [thongBao, setThongBao] = useState('');
  const [loaiThongBao, setLoaiThongBao] = useState('success');
  const timerThongBao = useRef(null);

  const tongSoTrang = Math.max(1, Math.ceil(danhSachSanPham.length / SO_SAN_PHAM_MOI_TRANG));
  const trangDangXem = Math.min(trangHienTai, tongSoTrang);
  const viTriBatDau = (trangDangXem - 1) * SO_SAN_PHAM_MOI_TRANG;
  const danhSachHienThi = danhSachSanPham.slice(viTriBatDau, viTriBatDau + SO_SAN_PHAM_MOI_TRANG);

  const hienThongBao = useCallback((noiDung, loai = 'success') => {
    if (timerThongBao.current) clearTimeout(timerThongBao.current);
    setThongBao(noiDung);
    setLoaiThongBao(loai);
    timerThongBao.current = setTimeout(() => setThongBao(''), 3000);
  }, []);

  useEffect(() => () => {
    if (timerThongBao.current) clearTimeout(timerThongBao.current);
  }, []);

  const taiDanhSach = async () => {
    setDangTai(true);
    try {
      setDanhSachSanPham(await layTatCaSanPham(dangXemThungRac));
    } catch (err) {
      console.error('Lỗi khi tải danh sách sản phẩm:', err);
      hienThongBao('Không thể tải danh sách sản phẩm. Vui lòng thử lại.', 'error');
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const layDuLieu = async () => {
      setDangTai(true);
      try {
        const sanPham = await layTatCaSanPham(dangXemThungRac);
        if (isMounted) setDanhSachSanPham(sanPham);
      } catch (err) {
        console.error('Lỗi khi tải sản phẩm:', err);
        if (isMounted) hienThongBao('Không thể tải danh sách sản phẩm. Vui lòng thử lại.', 'error');
      } finally {
        if (isMounted) setDangTai(false);
      }

      try {
        const response = await dichVuSanPham.layDanhMuc();
        if (isMounted) setDanhSachDanhMuc(layMangDuLieu(response));
      } catch (err) {
        console.warn('Không thể tải danh mục sản phẩm:', err);
      }

      try {
        const response = await dichVuSanPham.layThuongHieu();
        if (isMounted) setDanhSachThuongHieu(layMangDuLieu(response));
      } catch (err) {
        console.warn('Không thể tải thương hiệu sản phẩm:', err);
      }
    };

    layDuLieu();
    return () => {
      isMounted = false;
    };
  }, [dangXemThungRac, hienThongBao]);

  const moModalThem = () => {
    setIdDangSua(null);
    setDuLieuForm({ ...GIA_TRI_FORM_MAC_DINH });
    setHinhAnhFile(null);
    setDanhSachLoi({});
    setMoModal(true);
  };

  const moModalSua = (sanPham) => {
    setIdDangSua(sanPham.id);
    setDuLieuForm({
      ...GIA_TRI_FORM_MAC_DINH,
      ...sanPham,
      hinh_anh_xem_truoc: sanPham.hinh_anh || '',
    });
    setHinhAnhFile(null);
    setDanhSachLoi({});
    setMoModal(true);
  };

  const dongModal = () => {
    if (dangLuu) return;
    setMoModal(false);
    setHinhAnhFile(null);
    setDanhSachLoi({});
  };

  const xuLyGuiForm = async (event) => {
    event.preventDefault();
    setDanhSachLoi({});

    const duLieuGui = new FormData();
    Object.entries(duLieuForm).forEach(([key, value]) => {
      if (!['hinh_anh', 'hinh_anh_xem_truoc', 'id', 'deleted_at'].includes(key) && value !== undefined && value !== null) {
        duLieuGui.append(key, value);
      }
    });
    if (hinhAnhFile) {
      duLieuGui.append('hinh_anh', hinhAnhFile);
      duLieuGui.append('hinh_anh_xem_truoc', duLieuForm.hinh_anh_xem_truoc || '');
    }

    setDangLuu(true);
    try {
      if (idDangSua) {
        await dichVuSanPham.capNhat(idDangSua, duLieuGui);
        hienThongBao('Cập nhật sản phẩm thành công!');
      } else {
        await dichVuSanPham.themMoi(duLieuGui);
        setTrangHienTai(1);
        hienThongBao('Thêm sản phẩm thành công!');
      }
      setMoModal(false);
      setHinhAnhFile(null);
      await taiDanhSach();
    } catch (err) {
      if (err.response?.status === 422) {
        setDanhSachLoi(err.response.data.errors || {});
      } else {
        console.error('Lỗi khi lưu sản phẩm:', err);
        hienThongBao(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.', 'error');
      }
    } finally {
      setDangLuu(false);
    }
  };

  const xuLyXoaTam = async (sanPham) => {
    if (!confirm(`Bạn có chắc chắn muốn chuyển "${sanPham.ten_san_pham}" vào thùng rác?`)) return;

    try {
      await dichVuSanPham.xoaTam(sanPham.id);
      hienThongBao(`Đã chuyển "${sanPham.ten_san_pham}" vào thùng rác!`);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi chuyển sản phẩm vào thùng rác:', err);
      hienThongBao(err.response?.data?.message || 'Không thể chuyển sản phẩm vào thùng rác.', 'error');
    }
  };

  const xuLyKhoiPhuc = async (id) => {
    const sanPham = danhSachSanPham.find((item) => Number(item.id) === Number(id));
    try {
      await dichVuSanPham.khoiPhuc(id);
      hienThongBao(`Đã khôi phục "${sanPham?.ten_san_pham || 'sản phẩm'}"!`);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi khôi phục sản phẩm:', err);
      hienThongBao(err.response?.data?.message || 'Không thể khôi phục sản phẩm.', 'error');
    }
  };

  const xuLyXoaVinhVien = async (sanPham) => {
    if (!confirm(`CẢNH BÁO: Xóa vĩnh viễn "${sanPham.ten_san_pham}" khỏi hệ thống?`)) return;

    try {
      await dichVuSanPham.xoaVinhVien(sanPham.id);
      hienThongBao(`Đã xóa vĩnh viễn "${sanPham.ten_san_pham}"!`);
      await taiDanhSach();
    } catch (err) {
      console.error('Lỗi khi xóa vĩnh viễn sản phẩm:', err);
      hienThongBao(err.response?.data?.message || 'Không thể xóa vĩnh viễn sản phẩm.', 'error');
    }
  };

  const doiCheDoThungRac = () => {
    setTrangHienTai(1);
    setDangXemThungRac((hienTai) => !hienTai);
  };

  const soCot = dangXemThungRac ? 4 : 6;

  return (
    <div className="p-6 font-sans">
      <Toast thongBao={thongBao} loai={loaiThongBao} />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {dangXemThungRac ? '🗑 Thùng Rác Sản Phẩm' : '📦 Quản Lý Sản Phẩm'}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={doiCheDoThungRac}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${dangXemThungRac
                ? 'border-amber-300 bg-amber-100 text-amber-800'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
          >
            {dangXemThungRac ? '← Quay lại danh sách' : '🗑 Xem thùng rác'}
          </button>
          {!dangXemThungRac && (
            <button
              onClick={moModalThem}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
            >
              + Thêm sản phẩm
            </button>
          )}
        </div>
      </div>

      <div className="overflow-visible rounded-xl border bg-white shadow">
        <table className="w-full border-collapse text-left">
          <thead className="border-b bg-gray-50 text-xs font-semibold uppercase text-gray-600">
            <tr>
              <th className="p-4">ID</th>
              {!dangXemThungRac && <th className="p-4">Hình ảnh</th>}
              <th className="p-4">Tên sản phẩm</th>
              {!dangXemThungRac && <th className="p-4">Giá bán</th>}
              {!dangXemThungRac && <th className="p-4">Số lượng tồn</th>}
              {dangXemThungRac && <th className="p-4">Ngày xóa</th>}
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {dangTai ? (
              <tr><td colSpan={soCot} className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : danhSachHienThi.length === 0 ? (
              <tr><td colSpan={soCot} className="p-8 text-center text-gray-500">
                {dangXemThungRac ? 'Thùng rác trống.' : 'Chưa có sản phẩm nào.'}
              </td></tr>
            ) : danhSachHienThi.map((sanPham) => (
              <tr key={sanPham.id} className="transition hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-500">#{sanPham.id}</td>
                {!dangXemThungRac && (
                  <td className="p-4">
                    <img
                      src={sanPham.hinh_anh || 'https://via.placeholder.com/48'}
                      alt={sanPham.ten_san_pham}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  </td>
                )}
                <td className="p-4 font-medium text-gray-800">{sanPham.ten_san_pham}</td>
                {!dangXemThungRac && (
                  <>
                    <td className="p-4 font-medium text-emerald-600">
                      {Number(sanPham.gia_ban).toLocaleString('vi-VN')} đ
                    </td>
                    <td className="p-4">
                      {sanPham.so_luong_ton_kho}{' '}
                      <span className="text-xs text-gray-400">{sanPham.don_vi_tinh}</span>
                    </td>
                  </>
                )}
                {dangXemThungRac && (
                  <td className="p-4 text-gray-500">
                    {sanPham.deleted_at ? new Date(sanPham.deleted_at).toLocaleString('vi-VN') : '—'}
                  </td>
                )}
                <td className="p-4 text-center">
                  {dangXemThungRac ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => xuLyKhoiPhuc(sanPham.id)}
                        className="rounded bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                      >
                        Khôi phục
                      </button>
                      <button
                        onClick={() => xuLyXoaVinhVien(sanPham)}
                        className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Xóa hẳn
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSanPhamChiTiet(sanPham);
                          setMoModalChiTiet(true);
                        }}
                        className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
                        title="Xem chi tiết"
                      >
                        Xem
                      </button>
                      <button
                        onClick={() => moModalSua(sanPham)}
                        className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => xuLyXoaTam(sanPham)}
                        className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                      >
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!dangTai && danhSachSanPham.length > 0 && (
          <PhanTrang
            trangHienTai={trangDangXem}
            tongSoTrang={tongSoTrang}
            setTrangHienTai={setTrangHienTai}
            tongSoItem={danhSachSanPham.length}
            soItemMoiTrang={SO_SAN_PHAM_MOI_TRANG}
            tenLoaiItem="sản phẩm"
          />
        )}
      </div>

      <FormSanPhamModal
        moModal={moModal}
        dongModal={dongModal}
        idDangSua={idDangSua}
        duLieuForm={duLieuForm}
        setDuLieuForm={setDuLieuForm}
        danhSachDanhMuc={danhSachDanhMuc}
        danhSachThuongHieu={danhSachThuongHieu}
        danhSachLoi={danhSachLoi}
        xuLyGuiForm={xuLyGuiForm}
        hinhAnhFile={hinhAnhFile}
        setHinhAnhFile={setHinhAnhFile}
        dangLuu={dangLuu}
      />

      {moModalChiTiet && sanPhamChiTiet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 border-b pb-2 text-xl font-bold text-gray-800">
              Chi tiết sản phẩm #{sanPhamChiTiet.id}
            </h2>
            <div className="space-y-3 text-sm">
              <div className="mb-4 flex justify-center">
                <img
                  src={sanPhamChiTiet.hinh_anh || 'https://via.placeholder.com/120'}
                  alt={sanPhamChiTiet.ten_san_pham}
                  className="h-32 w-32 rounded-xl border object-cover shadow-sm"
                />
              </div>
              <p><strong>Tên sản phẩm:</strong> {sanPhamChiTiet.ten_san_pham}</p>
              <p><strong>Đường dẫn:</strong> {sanPhamChiTiet.duong_dan_sp || 'Chưa thiết lập'}</p>
              <p><strong>Giá bán:</strong> {Number(sanPhamChiTiet.gia_ban).toLocaleString('vi-VN')} đ</p>
              <p><strong>Tồn kho:</strong> {sanPhamChiTiet.so_luong_ton_kho} {sanPhamChiTiet.don_vi_tinh}</p>
              <p><strong>Mô tả ngắn:</strong> {sanPhamChiTiet.mo_ta_ngan || 'Không có mô tả'}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setMoModalChiTiet(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
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
