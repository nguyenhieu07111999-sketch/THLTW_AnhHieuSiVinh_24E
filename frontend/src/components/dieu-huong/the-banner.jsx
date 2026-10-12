'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TheBanner() {
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

  return (
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
  );
}