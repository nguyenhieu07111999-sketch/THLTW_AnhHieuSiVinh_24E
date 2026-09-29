import './globals.css';
import ThanhDieuHuong from '@/components/dieu-huong/thanh-dieu-huong';
import ChanTrang from '@/components/dieu-huong/chan-trang';

export const metadata = {
  title: 'Cửa Hàng Thực Phẩm Tươi Sạch',
  description: 'Chuyên cung cấp rau củ quả, thực phẩm sạch hữu cơ đạt chuẩn',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-emerald-50/20 text-gray-800 flex flex-col min-h-screen">
        <ThanhDieuHuong />
        <main className="flex-grow">{children}</main>
        <ChanTrang />
      </body>
    </html>
  );
}