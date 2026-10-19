'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const GOC_BACKEND = API.replace(/\/api\/?$/, '');

const layUrlAnh = (p) => {
  if (!p) return '/placeholder.png';
  if (/^(https?:|data:)/.test(p)) return p;
  const cleanPath = p.replace(/^\/+/, '');
  if (cleanPath.startsWith('storage/')) return `${GOC_BACKEND}/${cleanPath}`;
  return `${GOC_BACKEND}/storage/${cleanPath}`;
};

export default function TrangChiTietBaiViet() {
  const params = useParams();
  const router = useRouter();
  const [baiViet, setBaiViet] = useState(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    setDangTai(true);
    api
      .get(`/bai-viet/${params.id}`)
      .then((res) => {
        setBaiViet(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error('Không tìm thấy bài viết:', err);
      })
      .finally(() => {
        setDangTai(false);
      });
  }, [params?.id]);

  if (dangTai) {
    return (
      <div className="min-h-screen py-24 text-center">
        <div className="inline-block animate-spin text-3xl mb-2">🌱</div>
        <p className="text-gray-500 text-sm">Đang tải bài viết...</p>
      </div>
    );
  }

  if (!baiViet) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bài viết không tồn tại</h2>
        <p className="text-gray-500 mb-6 text-sm">Bài viết có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
        <Link
          href="/bai-viet"
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition"
        >
          &larr; Quay lại danh sách bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/20 min-h-screen py-10">
      <article className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-emerald-700">Trang chủ</Link>
          <span>/</span>
          <Link href="/bai-viet" className="hover:text-emerald-700">Tin tức</Link>
          <span>/</span>
          <span className="text-gray-800 line-clamp-1">{baiViet.tieu_de}</span>
        </nav>

        {/* Tiêu đề & Thông tin tác giả */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-emerald-100 shadow-sm space-y-6">
          <div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full mb-3 inline-block">
              {baiViet.chu_de?.ten_chu_de || 'Cẩm nang nông sản'}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
              {baiViet.tieu_de}
            </h1>
            <div className="flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-4">
              <span>📅 {baiViet.ngay_tao ? new Date(baiViet.ngay_tao).toLocaleDateString('vi-VN') : ''}</span>
              <span>👁️ {baiViet.luot_xem ?? 0} lượt xem</span>
            </div>
          </div>

          {/* Ảnh bìa */}
          {baiViet.anh_dai_dien && (
            <div className="rounded-2xl overflow-hidden max-h-[420px] w-full bg-gray-100 border">
              <img
                src={layUrlAnh(baiViet.anh_dai_dien)}
                alt={baiViet.tieu_de}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Mô tả ngắn / Tóm tắt */}
          {baiViet.tom_tat && (
            <div className="p-4 bg-emerald-50/60 rounded-xl border-l-4 border-emerald-600 text-emerald-950 font-medium text-sm leading-relaxed">
              {baiViet.tom_tat}
            </div>
          )}

          {/* Nội dung chi tiết (hỗ trợ HTML từ trình soạn thảo) */}
          <div
            className="prose prose-emerald max-w-none text-gray-700 text-sm md:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: baiViet.noi_dung }}
          />

          {/* Chân bài viết */}
          <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              &larr; Quay lại
            </button>
            <Link
              href="/bai-viet"
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              Xem các bài viết khác
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}