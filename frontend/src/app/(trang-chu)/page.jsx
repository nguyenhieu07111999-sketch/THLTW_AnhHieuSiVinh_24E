'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TrangChu() {
  const router = useRouter();

  // 1. Quản lý trạng thái Banner tự chuyển
  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    {
      id: 1,
      tieuDe: 'Nông Sản Tươi Sạch - Giao Trong 2H',
      moTa: 'Cam kết 100% hữu cơ, an toàn tuyệt đối cho sức khỏe gia đình bạn.',
      nutBam: 'Mua Sắm Ngay',
      link: '/danh-muc',
      bgClass: 'bg-emerald-800',
    },
    {
      id: 2,
      tieuDe: 'Ưu Đãi Đặc Biệt - Giảm Đến 30%',
      moTa: 'Sản phẩm hữu cơ trong tuần đang được giảm giá cực shock. Số lượng có hạn!',
      nutBam: 'Xem Khuyến Mãi',
      link: '/danh-muc',
      bgClass: 'bg-teal-800',
    },
    {
      id: 3,
      tieuDe: 'Rau Củ Quả Chuẩn VietGAP',
      moTa: 'Thu hoạch mỗi ngày từ trang trại Đà Lạt, giữ trọn vị tươi ngon thuần khiết.',
      nutBam: 'Khám Phá Ngay',
      link: '/danh-muc',
      bgClass: 'bg-green-800',
    },
  ];

  // Tự động chuyển Banner sau 4 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // 2. Danh sách dữ liệu mẫu
  const sanPhamNoiBat = [
    { id: 1, ten: 'Cà Rốt Hữu Cơ Đà Lạt', gia: '27.000đ', icon: '🥕' },
    { id: 2, ten: 'Cà Chua Cherry Đỏ', gia: '32.000đ', icon: '🍅' },
    { id: 3, ten: 'Rau Cải Thảo VietGAP', gia: '35.000đ', icon: '🥬' },
    { id: 4, ten: 'Bông Cải Xanh Tươi', gia: '45.000đ', icon: '🥦' },
  ];

  const sanPhamKhuyenMai = [
    { id: 5, ten: 'Dâu Tây Đà Lạt Giống Mỹ', gia: '85.000đ', giaGoc: '110.000đ', giamGia: '22%', icon: '🍓' },
    { id: 6, ten: 'Cam Sành Mới Hái', gia: '29.000đ', giaGoc: '40.000đ', giamGia: '27%', icon: '🍊' },
    { id: 7, ten: 'Nấm Đùi Gà Tươi', gia: '38.000đ', giaGoc: '50.000đ', giamGia: '24%', icon: '🍄' },
    { id: 8, ten: 'Bơ Tắm Bò Sáp XL', gia: '62.000đ', giaGoc: '80.000đ', giamGia: '22%', icon: '🥑' },
  ];

  const sanPhamBanChay = [
    { id: 9, ten: 'Chuối Laba Đà Lạt', gia: '30.000đ', daBan: '1.2k', icon: '🍌' },
    { id: 10, ten: 'Táo Mật Envy', gia: '89.000đ', daBan: '980', icon: '🍎' },
    { id: 11, ten: 'Rau Muống Hữu Cơ', gia: '18.000đ', daBan: '2.5k', icon: '🌱' },
    { id: 12, ten: 'Khoai Lang Mật Da Lạt', gia: '35.000đ', daBan: '850', icon: '🍠' },
  ];

  // 3. Danh sách tin tức / bài viết mới nhất
  const tinTucMoitNhat = [
    {
      id: 1,
      tieuDe: 'Mẹo Chọn Rau Củ Tươi Sạch Không Bị Tồn Thuốc Bảy Ngày',
      tomTat: 'Bật mí cách phân biệt rau củ hữu cơ chuẩn VietGAP và rau củ thông thường cực kỳ đơn giản...',
      ngayDang: '28/09/2026',
      danhMuc: 'Mẹo Hay',
      icon: '💡',
    },
    {
      id: 2,
      tieuDe: 'Cách Bảo Quản Dâu Tây Đà Lạt Tươi Lâu Trong Tủ Lạnh',
      tomTat: 'Giữ dâu tây luôn mọng nước, không bị dập hay mốc trong cả tuần với các bước bảo quản chuẩn chuyên gia...',
      ngayDang: '25/09/2026',
      danhMuc: 'Cẩm Nang',
      icon: '🍓',
    },
    {
      id: 3,
      tieuDe: 'Thực Đơn 7 Ngày Detox Cơ Thể Bằng Nước Ép Tươi',
      tomTat: 'Gợi ý các công thức nước ép kết hợp từ táo, bơ, cà rốt giúp thanh lọc cơ thể và đẹp da tự nhiên...',
      ngayDang: '20/09/2026',
      danhMuc: 'Sức Khỏe',
      icon: '🍹',
    },
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* 1. SLIDER BANNER QUẢNG CÁO TỰ ĐỘNG CHUYỂN */}
      <section className="relative overflow-hidden rounded-b-3xl shadow-md">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((item) => (
            <div
              key={item.id}
              className={`w-full flex-shrink-0 ${item.bgClass} text-white py-16 px-4 text-center`}
            >
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{item.tieuDe}</h1>
              <p className="text-emerald-100 max-w-2xl mx-auto mb-6 text-base md:text-lg">
                {item.moTa}
              </p>
              <Link
                href={item.link}
                className="bg-white text-emerald-800 font-bold px-8 py-3 rounded-full hover:bg-emerald-100 transition-colors inline-block shadow-lg"
              >
                {item.nutBam}
              </Link>
            </div>
          ))}
        </div>

        {/* Dots điều hướng Banner */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentBanner === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. SẢN PHẨM KHUYẾN MÃI */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🔥</span> Sản Phẩm Khuyến Mãi
          </h2>
          <Link href="/danh-muc" className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sanPhamKhuyenMai.map((sp) => (
            <div
              key={sp.id}
              onClick={() => router.push(`/danh-muc/${sp.id}`)}
              className="relative bg-white rounded-2xl p-4 border border-rose-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                -{sp.giamGia}
              </span>
              <div className="h-40 bg-rose-50/50 rounded-xl mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {sp.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{sp.ten}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-rose-600 font-bold">{sp.gia}</span>
                <span className="text-xs text-gray-400 line-through">{sp.giaGoc}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/gio-hang');
                }}
                className="w-full mt-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Săn ngay
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SẢN PHẨM NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🌱</span> Sản Phẩm Nổi Bật
          </h2>
          <Link href="/danh-muc" className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sanPhamNoiBat.map((sp) => (
            <div
              key={sp.id}
              onClick={() => router.push(`/danh-muc/${sp.id}`)}
              className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="h-40 bg-emerald-50 rounded-xl mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {sp.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{sp.ten}</h3>
              <p className="text-sm text-emerald-600 font-semibold mt-1">{sp.gia}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/gio-hang');
                }}
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SẢN PHẨM BÁN CHẠY NHẤT */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🏆</span> Bán Chạy Nhất
          </h2>
          <Link href="/danh-muc" className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {sanPhamBanChay.map((sp) => (
            <div
              key={sp.id}
              onClick={() => router.push(`/danh-muc/${sp.id}`)}
              className="bg-white rounded-2xl p-4 border border-amber-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="h-40 bg-amber-50 rounded-xl mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {sp.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{sp.ten}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-emerald-600 font-bold">{sp.gia}</span>
                <span className="text-xs text-gray-500 font-medium">Đã bán: {sp.daBan}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/gio-hang');
                }}
                className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
              >
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TIN TỨC & KINH NGHIỆM NÔNG SẢN */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📰</span> Tin Tức & Kinh Nghiệm
          </h2>
          <Link href="/bai-viet" className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả bài viết &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tinTucMoitNhat.map((baiViet) => (
            <div
              key={baiViet.id}
              onClick={() => router.push(`/bai-viet/${baiViet.id}`)}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 bg-slate-100 rounded-xl mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {baiViet.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {baiViet.danhMuc}
                  </span>
                  <span className="text-xs text-gray-400">{baiViet.ngayDang}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-base mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {baiViet.tieuDe}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-3 mb-4">{baiViet.tomTat}</p>
              </div>

              <span className="text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Đọc tiếp &rarr;
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}