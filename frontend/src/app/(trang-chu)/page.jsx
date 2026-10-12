'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { dichVuTrangChu } from '@/services/dich-vu-trang-chu';
import TheSanPham from '@/components/san-pham/the-san-pham';
import TheTinTuc from '@/components/bai-viet/the-tin-tuc';
import TheBanner from '@/components/dieu-huong/the-banner';

export default function TrangChu() {
  const router = useRouter();

  // 1. Quản lý trạng thái Banner tự chuyển (Giữ nguyên tĩnh)
  const [currentBanner, setCurrentBanner] = useState(0);

  // 2. State lưu trữ dữ liệu thật từ DB
  const [sanPhamKhuyenMai, setSanPhamKhuyenMai] = useState([]);
  const [sanPhamNoiBat, setSanPhamNoiBat] = useState([]);
  const [sanPhamBanChay, setSanPhamBanChay] = useState([]);
  const [tinTucMoiNhat, setTinTucMoiNhat] = useState([]);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const taiDuLieu = async () => {
      setDangTai(true);
      const data = await dichVuTrangChu.layDuLieuTrangChu();
      setSanPhamKhuyenMai(data.khuyenMai);
      setSanPhamNoiBat(data.noiBat);
      setSanPhamBanChay(data.banChay);
      setTinTucMoiNhat(data.tinTuc);
      setDangTai(false);
    };

    taiDuLieu();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* 1. SLIDER BANNER QUẢNG CÁO TỰ ĐỘNG CHUYỂN (GIỮ NGUYÊN) */}
      <TheBanner />

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

        {dangTai ? (
          <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>
        ) : sanPhamKhuyenMai.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Chưa có sản phẩm khuyến mãi nào.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sanPhamKhuyenMai.map((sp) => (
              <TheSanPham key={sp.id} sp={sp} type="promotion" />
            ))}
          </div>
        )}
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

        {sanPhamNoiBat.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Chưa có sản phẩm nổi bật nào.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sanPhamNoiBat.map((sp) => (
              <TheSanPham key={sp.id} sp={sp} type="normal" />
            ))}
          </div>
        )}
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

        {sanPhamBanChay.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Chưa có dữ liệu sản phẩm bán chạy.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sanPhamBanChay.map((sp) => (
              <TheSanPham key={sp.id} sp={sp} type="normal" />
            ))}
          </div>
        )}
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

        {tinTucMoiNhat.length === 0 ? (
          <div className="text-center py-10 text-gray-400">Chưa có bài viết nào.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tinTucMoiNhat.map((baiViet) => (
              <TheTinTuc key={baiViet.id} baiViet={baiViet} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}