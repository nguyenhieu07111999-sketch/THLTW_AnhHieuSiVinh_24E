'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useXacThuc } from '@/context/xac-thuc-context';
import DanhSachDonHang from '@/components/don-hang/danh-sach-don-hang';
import { TRANG_THAI_DON_HANG } from '@/utils/dinh-dang';

const TABS = [
  { khoa: '', nhan: 'Tất cả' },
  ...Object.entries(TRANG_THAI_DON_HANG).map(([khoa, v]) => ({ khoa, nhan: v.nhan })),
];

export default function TrangDanhSachDonHang() {
  const { user, daSanSang } = useXacThuc();
  const [trangThai, setTrangThai] = useState('');

  if (!daSanSang) return <div className="py-24 text-center text-gray-400">Đang tải...</div>;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-gray-500">Vui lòng đăng nhập để xem đơn hàng.</p>
        <Link
          href="/dang-nhap?redirect=/don-hang"
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Đơn Hàng Của Tôi</h1>
          <p className="text-sm text-gray-500">Theo dõi trạng thái và lịch sử các đơn hàng đã đặt</p>
        </div>
        <Link
          href="/danh-muc"
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors"
        >
          + Tiếp tục mua sắm
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.khoa}
            onClick={() => setTrangThai(t.khoa)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
              trangThai === t.khoa
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'
            }`}
          >
            {t.nhan}
          </button>
        ))}
      </div>

      {/* key={trangThai}: đổi tab thì component làm lại từ trang 1 */}
      <DanhSachDonHang key={trangThai} trangThai={trangThai || undefined} phanTrang />
    </div>
  );
}