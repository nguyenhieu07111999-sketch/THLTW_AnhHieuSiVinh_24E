'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dichVuSanPham } from '@/services/dich-vu-san-pham';
import { themVaoGio } from '@/services/dich-vu-gio-hang';
import TheSanPham from '@/components/san-pham/the-san-pham';
import BinhLuanDanhGia from '@/components/san-pham/binh-luan-danh-gia';
import { tinhTongTien, dinhDangTienVND } from '@/utils/tinh-toan';

export default function TrangChiTietSanPham({ params }) {
  const router = useRouter();
  const { id } = React.use(params); 

  const [sanPham, setSanPham] = useState(null);
  const [sanPhamLienQuan, setSanPhamLienQuan] = useState([]);
  const [soLuong, setSoLuong] = useState(1);
  const [dangTai, setDangTai] = useState(true);
  const [dangThemVaoGio, setDangThemVaoGio] = useState(false);
  const [loiThemVaoGio, setLoiThemVaoGio] = useState('');

  useEffect(() => {
    const taiChiTietVaLienQuan = async () => {
      setDangTai(true);
      try {
        const resChiTiet = await dichVuSanPham.layChiTiet(id);
        const dataSanPham = resChiTiet.data.data || resChiTiet.data;
        setSanPham(dataSanPham);

        if (dataSanPham && dataSanPham.danh_muc_id) {
          const resLienQuan = await dichVuSanPham.layDanhSach({
            danh_muc_id: dataSanPham.danh_muc_id,
            per_page: 5, 
          });
          const danhSachLienQuan = resLienQuan.data.data || resLienQuan.data;
          
          const daLoc = danhSachLienQuan.filter(sp => sp.id !== Number(id)).slice(0, 4);
          setSanPhamLienQuan(daLoc);
        }
      } catch (error) {
        console.error('Lỗi khi tải chi tiết sản phẩm:', error);
      } finally {
        setDangTai(false);
      }
    };

    if (id) {
      taiChiTietVaLienQuan();
      window.scrollTo(0, 0); 
      setSoLuong(1); 
    }
  }, [id]);

  const tonKho = sanPham?.so_luong_ton_kho !== undefined ? Number(sanPham.so_luong_ton_kho) : 99;

  const handleTangSoLuong = () => {
    if (soLuong < tonKho) {
      setSoLuong(prev => prev + 1);
    } else {
      alert(`Số lượng bạn chọn đã đạt mức tối đa trong kho (${tonKho} sản phẩm)!`);
    }
  };

  const handleGiamSoLuong = () => {
    setSoLuong(prev => Math.max(1, prev - 1));
  };

  const handleThemVaoGio = async () => {
    setLoiThemVaoGio('');

    if (soLuong > tonKho) {
      alert('Số lượng vượt quá tồn kho cho phép!');
      return;
    }

    if (!localStorage.getItem('access_token')) {
      router.push(`/dang-nhap?redirect=${encodeURIComponent(`/danh-muc/${sanPham.id}`)}`);
      return;
    }

    setDangThemVaoGio(true);
    try {
      await themVaoGio(sanPham.id, soLuong);
      router.push('/gio-hang');
    } catch (error) {
      const errors = error.response?.data?.errors;
      setLoiThemVaoGio(
        errors
          ? Object.values(errors).flat().join(' | ')
          : error.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ. Vui lòng thử lại.'
      );
    } finally {
      setDangThemVaoGio(false);
    }
  };

  if (dangTai) {
    return <div className="text-center py-24 text-gray-500">Đang tải thông tin sản phẩm...</div>;
  }

  if (!sanPham) {
    return (
      <div className="text-center py-24 text-gray-400">
        Không tìm thấy thông tin sản phẩm hoặc sản phẩm đã bị xóa.
      </div>
    );
  }

  const donGiaHienTai = Number(sanPham.gia_giam > 0 ? sanPham.gia_giam : sanPham.gia_ban);
  const tongTienTamTinh = tinhTongTien(sanPham.gia_ban, sanPham.gia_giam, soLuong);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Đường dẫn điều hướng */}
      <div className="text-sm text-gray-500">
        <Link href="/" className="hover:underline">Trang chủ</Link> /{' '}
        <Link href="/danh-muc" className="hover:underline">Danh mục</Link> /{' '}
        <span className="text-emerald-700 font-medium">{sanPham.ten_san_pham}</span>
      </div>

      {/* Thông tin chi tiết sản phẩm */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ảnh sản phẩm */}
        <div className="h-80 bg-emerald-50 rounded-xl flex items-center justify-center overflow-hidden border border-emerald-100">
          {sanPham.hinh_anh ? (
            <img
              src={sanPham.hinh_anh.startsWith('http') ? sanPham.hinh_anh : `http://127.0.0.1:8000/storage/${sanPham.hinh_anh}`}
              alt={sanPham.ten_san_pham}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-7xl">🥬</span>
          )}
        </div>

        {/* Chi tiết nội dung */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {sanPham.don_vi_tinh || 'Nông sản sạch'}
            </span>
            <span className="text-xs font-medium text-gray-500">
              Tồn kho: <strong className="text-gray-700">{tonKho}</strong> {sanPham.don_vi_tinh || 'sản phẩm'}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-800">{sanPham.ten_san_pham}</h1>
          
          <div className="space-y-1">
            <div className="flex items-baseline space-x-3">
              <p className="text-2xl font-extrabold text-emerald-700">
                {dinhDangTienVND(tongTienTamTinh)}
                <span className="text-sm font-normal text-gray-400"> (Tổng tạm tính)</span>
              </p>
              {sanPham.gia_giam > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {dinhDangTienVND(Number(sanPham.gia_ban) * soLuong)}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Đơn giá: {dinhDangTienVND(donGiaHienTai)} / {sanPham.don_vi_tinh || 'kg'}
            </p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {sanPham.mo_ta_ngan || sanPham.chi_tiet || 'Sản phẩm an toàn, chất lượng cao, đảm bảo vệ sinh an toàn thực phẩm cho gia đình.'}
          </p>

          <div className="flex items-center space-x-4 pt-4">
            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
              <button 
                onClick={handleGiamSoLuong}
                className="px-3 py-1.5 font-bold hover:bg-emerald-500 hover:text-white transition-colors rounded-l-lg"
              >
                -
              </button>
              <span className="px-4 font-semibold">{soLuong}</span>
              <button 
                onClick={handleTangSoLuong}
                className="px-3 py-1.5 font-bold hover:bg-emerald-500 hover:text-white transition-colors rounded-r-lg"
              >
                +
              </button>
            </div>

            <button
              onClick={handleThemVaoGio}
              disabled={dangThemVaoGio}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {dangThemVaoGio ? 'Đang thêm...' : '🛒 Thêm Vào Giỏ Hàng'}
            </button>
          </div>
          {loiThemVaoGio && <p className="text-sm text-red-600" role="alert">{loiThemVaoGio}</p>}
        </div>
      </div>

      {/* PHẦN SẢN PHẨM LIÊN QUAN */}
      {sanPhamLienQuan.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-emerald-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🌾</span> Sản Phẩm Liên Quan
            </h2>
            <Link href="/danh-muc" className="text-sm font-semibold text-emerald-700 hover:underline">
              Xem tất cả &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sanPhamLienQuan.map((sp) => (
              <TheSanPham key={sp.id} sp={sp} type="normal" />
            ))}
          </div>
        </section>
      )}

      {/* PHẦN ĐÁNH GIÁ & BÌNH LUẬN (ẢNH / VIDEO / RATING) */}
      <section className="pt-6 border-t border-emerald-100">
        <BinhLuanDanhGia sanPhamId={sanPham.id} />
      </section>
    </div>
  );
}