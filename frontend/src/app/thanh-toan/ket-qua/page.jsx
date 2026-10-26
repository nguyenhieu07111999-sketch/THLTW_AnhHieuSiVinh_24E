'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function NoiDung() {
  const sp = useSearchParams();
  const kq = sp.get('thanh_toan');
  const don = sp.get('don_hang');
  const thatBai = kq === 'that_bai';

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        {thatBai ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">❌</div>
            <h1 className="mt-4 text-2xl font-bold text-red-600">Thanh toán chưa thành công</h1>
            <p className="mt-2 text-gray-600">
              Đơn hàng {don && <strong>#{don}</strong>} đã được lưu nhưng chưa thanh toán.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✅</div>
            <h1 className="mt-4 text-2xl font-bold text-emerald-700">
              {kq === 'cod' ? 'Đặt hàng thành công' : 'Thanh toán thành công'}
            </h1>
            {don && <p className="mt-2 text-gray-600">Mã đơn hàng: <strong>#{don}</strong></p>}
            <p className="mt-1 text-sm text-gray-500">
              {kq === 'cod'
                ? 'Bạn sẽ thanh toán tiền mặt cho nhân viên giao hàng khi nhận đơn.'
                : 'Cảm ơn bạn đã thanh toán. Cửa hàng sẽ sớm xác nhận đơn hàng.'}
            </p>
          </>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/danh-muc" className="rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700">
            Tiếp tục mua sắm
          </Link>
          <Link href="/" className="rounded-xl border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50">
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrangKetQua() {
  return (
    <Suspense fallback={null}>
      <NoiDung />
    </Suspense>
  );
}