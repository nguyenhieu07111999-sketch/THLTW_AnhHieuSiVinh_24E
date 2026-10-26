'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { layGioHang, taoDonHang } from '@/services/dich-vu-gio-hang';

const dinhDangTien = (soTien) => `${Number(soTien || 0).toLocaleString('vi-VN')}đ`;

export default function TrangThanhToan() {
    const router = useRouter();
    const [gioHang, setGioHang] = useState(null);
    const [dangTai, setDangTai] = useState(true);
    const [dangDat, setDangDat] = useState(false);
    const [loi, setLoi] = useState('');
    const [form, setForm] = useState({
        ten_nguoi_nhan: '',
        so_dien_thoai_nhan: '',
        dia_chi_nhan: '',
        ghi_chu: '',
        phuong_thuc_thanh_toan: 'VNPAY',
    });

    useEffect(() => {
        if (!localStorage.getItem('access_token')) {
            router.replace('/dang-nhap');
            return;
        }

        try {
            const thongTin = JSON.parse(localStorage.getItem('user_info') || '{}');
            setForm((cu) => ({
                ...cu,
                ten_nguoi_nhan: thongTin.ho_ten || '',
                so_dien_thoai_nhan: thongTin.so_dien_thoai || '',
                dia_chi_nhan: thongTin.dia_chi || '',
            }));
        } catch {
            // Không có hồ sơ cục bộ thì để khách tự nhập.
        }

        layGioHang()
            .then(setGioHang)
            .catch((error) => setLoi(error.response?.data?.message || 'Không tải được giỏ hàng.'))
            .finally(() => setDangTai(false));
    }, [router]);

    const capNhatForm = (event) => {
        setForm((cu) => ({ ...cu, [event.target.name]: event.target.value }));
    };

    const datHang = async (event) => {
        event.preventDefault();
        setLoi('');

        if (!form.ten_nguoi_nhan.trim()) return setLoi('Vui lòng nhập tên người nhận.');
        if (!/^0\d{9,10}$/.test(form.so_dien_thoai_nhan.trim())) return setLoi('Số điện thoại không hợp lệ.');
        if (!form.dia_chi_nhan.trim()) return setLoi('Vui lòng nhập địa chỉ nhận hàng.');

        setDangDat(true);
        try {
            const response = await taoDonHang(form);
            const data = response.data || {};

            if (data.url_thanh_toan) {
                window.location.assign(data.url_thanh_toan); // sang cổng VNPAY
                return;
            }
            router.push(`/thanh-toan/ket-qua?thanh_toan=cod&don_hang=${data.don_hang_id || ''}`);
        } catch (error) {
            const errors = error.response?.data?.errors;
            setLoi(
                errors
                    ? Object.values(errors).flat().join(' | ')
                    : error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.'
            );
            setDangDat(false);
        }
    };

    const chiTiet = gioHang?.chi_tiet || [];
    const o = 'mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';

    if (dangTai) {
        return <div className="mx-auto max-w-6xl px-4 py-10">Đang tải...</div>;
    }

    if (chiTiet.length === 0) {
        return (
            <div className="mx-auto max-w-xl px-4 py-16 text-center">
                <div className="rounded-2xl border border-emerald-100 bg-white p-8">
                    <p className="text-5xl">🛒</p>
                    <p className="mt-3 font-semibold">Giỏ hàng đang trống, chưa có gì để thanh toán.</p>
                    {loi && <p className="mt-2 text-sm text-red-600">{loi}</p>}
                    <Link href="/danh-muc" className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700">
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            {/* Các bước */}
            <div className="mb-8 flex items-center justify-center gap-2 text-sm font-semibold sm:gap-4">
                <span className="flex items-center gap-2 text-emerald-700">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">✓</span> Giỏ hàng
                </span>
                <span className="h-px w-8 bg-emerald-300 sm:w-16" />
                <span className="flex items-center gap-2 text-emerald-900">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">2</span> Thanh toán
                </span>
                <span className="h-px w-8 bg-gray-300 sm:w-16" />
                <span className="flex items-center gap-2 text-gray-400">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200">3</span> Hoàn tất
                </span>
            </div>

            <form onSubmit={datHang} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Cột trái */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Thông tin nhận hàng */}
                    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-950">
                            <span>📍</span> Thông tin nhận hàng
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <label className="block text-sm font-medium">Tên người nhận
                                <input name="ten_nguoi_nhan" value={form.ten_nguoi_nhan} onChange={capNhatForm} placeholder="Nguyễn Văn A" className={o} />
                            </label>
                            <label className="block text-sm font-medium">Số điện thoại
                                <input name="so_dien_thoai_nhan" value={form.so_dien_thoai_nhan} onChange={capNhatForm} placeholder="0987654321" className={o} />
                            </label>
                        </div>
                        <label className="mt-4 block text-sm font-medium">Địa chỉ nhận hàng
                            <textarea name="dia_chi_nhan" value={form.dia_chi_nhan} onChange={capNhatForm} rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" className={o} />
                        </label>
                        <label className="mt-4 block text-sm font-medium">Ghi chú (không bắt buộc)
                            <textarea name="ghi_chu" value={form.ghi_chu} onChange={capNhatForm} rows={2} placeholder="Ví dụ: giao giờ hành chính" className={o} />
                        </label>
                    </section>

                    {/* Phương thức thanh toán */}
                    <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-950">
                            <span>💳</span> Phương thức thanh toán
                        </h2>
                        <div className="space-y-3">
                            {[
                                { value: 'VNPAY', icon: '🏦', ten: 'Thanh toán trực tuyến qua VNPAY', moTa: 'Thanh toán an toàn bằng thẻ ATM nội địa, thẻ quốc tế hoặc QR ngân hàng.' },
                                { value: 'COD', icon: '💵', ten: 'Thanh toán tiền mặt khi nhận hàng (COD)', moTa: 'Trả tiền mặt cho nhân viên giao hàng khi nhận được đơn.' },
                            ].map((pt) => {
                                const chon = form.phuong_thuc_thanh_toan === pt.value;
                                return (
                                    <label
                                        key={pt.value}
                                        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition ${chon ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="phuong_thuc_thanh_toan"
                                            value={pt.value}
                                            checked={chon}
                                            onChange={capNhatForm}
                                            className="h-4 w-4 accent-emerald-600"
                                        />
                                        <span className="text-3xl">{pt.icon}</span>
                                        <span className="flex-1">
                                            <strong className="block text-emerald-950">{pt.ten}</strong>
                                            <span className="text-sm text-gray-600">{pt.moTa}</span>
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Cột phải: tóm tắt */}
                <aside className="h-fit space-y-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
                    <h2 className="text-lg font-bold text-emerald-950">Đơn hàng của bạn</h2>

                    <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                        {chiTiet.map((item) => (
                            <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-800">{item.ten_san_pham}</p>
                                    <p className="text-gray-500">{dinhDangTien(item.gia)} × {item.so_luong}</p>
                                </div>
                                <span className="font-bold">{dinhDangTien(item.thanh_tien)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between"><span>Tạm tính</span><span className="font-semibold">{dinhDangTien(gioHang.tong_tien)}</span></div>
                        <div className="flex justify-between text-emerald-700"><span>Phí giao hàng</span><span>Miễn phí</span></div>
                        <div className="flex justify-between border-t pt-3 text-lg font-bold text-emerald-900">
                            <span>Tổng cộng</span><span>{dinhDangTien(gioHang.tong_tien)}</span>
                        </div>
                    </div>

                    {loi && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{loi}</p>}

                    <button
                        type="submit"
                        disabled={dangDat}
                        className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-md shadow-emerald-100 transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                        {dangDat
                            ? 'Đang xử lý...'
                            : form.phuong_thuc_thanh_toan === 'VNPAY'
                                ? 'Đặt hàng và thanh toán VNPAY'
                                : 'Xác nhận đặt hàng'}
                    </button>
                    <Link href="/gio-hang" className="block text-center text-sm font-semibold text-gray-600 hover:text-emerald-700">
                        ← Quay lại giỏ hàng
                    </Link>
                </aside>
            </form>
        </div>
    );
}