'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import * as dichVu from '@/services/dich-vu-bai-viet';

const PER_PAGE = 10;
const FORM_RONG = {
    chu_de_id: '',
    tieu_de: '',
    mo_ta_ngan: '',
    noi_dung: '',
    trang_thai: 'nhap', // 'dang' hoặc 'nhap' khớp với DB
};

const API = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const GOC_BACKEND = API.replace(/\/api\/?$/, '');

// Hàm xử lý link ảnh: nếu lưu trong storage thì nối http://127.0.0.1:8000/storage/...
const anhUrl = (p) => {
    if (!p) return '';
    if (/^(https?:|data:)/.test(p)) return p;
    const cleanPath = p.replace(/^\/+/, '');
    if (cleanPath.startsWith('storage/')) {
        return `${GOC_BACKEND}/${cleanPath}`;
    }
    return `${GOC_BACKEND}/storage/${cleanPath}`;
};

const toMang = (r) => (Array.isArray(r) ? r : r?.data ?? []);

const tenChuDe = (c) =>
    c?.ten_chu_de || c?.ten || c?.ten_chu_de_bai_viet || `Chủ đề #${c?.id}`;

function Icon({ children }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {children}
        </svg>
    );
}

const IconSua = () => (
    <Icon>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Icon>
);

const IconMat = () => (
    <Icon>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </Icon>
);

const IconMatGach = () => (
    <Icon>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </Icon>
);

const IconXoa = () => (
    <Icon>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </Icon>
);

function NutIcon({ title, onClick, mau, children }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            onClick={onClick}
            className={`p-2 rounded-md hover:bg-gray-100 ${mau}`}
        >
            {children}
        </button>
    );
}

export default function TrangBaiViet() {
    const [ds, setDs] = useState([]);
    const [dsChuDe, setDsChuDe] = useState([]);
    const [dangTai, setDangTai] = useState(false);
    const [tuKhoa, setTuKhoa] = useState('');
    const [locTrangThai, setLocTrangThai] = useState('');
    const [trang, setTrang] = useState(1);
    const [modal, setModal] = useState({ mo: false, baiViet: null });
    const [form, setForm] = useState(FORM_RONG);
    const [fileAnh, setFileAnh] = useState(null);
    const [previewAnh, setPreviewAnh] = useState('');
    const [loi, setLoi] = useState('');
    const fileInputRef = useRef(null);
    

    const taiDuLieu = useCallback(async () => {
        setDangTai(true);
        try {
            const [r, cd] = await Promise.all([
                dichVu.layDanhSach({ per_page: 200 }),
                dichVu.layChuDe(),
            ]);
            setDs(toMang(r));
            setDsChuDe(toMang(cd));
        } catch (e) {
            alert(e.response?.data?.message || 'Không tải được danh sách bài viết');
        } finally {
            setDangTai(false);
        }
    }, []);

    useEffect(() => {
        taiDuLieu();
    }, [taiDuLieu]);

    const mapChuDe = useMemo(() => {
        const m = {};
        dsChuDe.forEach((c) => { m[c.id] = tenChuDe(c); });
        return m;
    }, [dsChuDe]);

    const dsLoc = useMemo(() => {
        const k = tuKhoa.trim().toLowerCase();
        return ds.filter((b) => {
            const khop = !k || b.tieu_de?.toLowerCase().includes(k);
            const tt = !locTrangThai || b.trang_thai === locTrangThai;
            return khop && tt;
        });
    }, [ds, tuKhoa, locTrangThai]);

    const tongTrang = Math.max(1, Math.ceil(dsLoc.length / PER_PAGE));
    const dsTrang = dsLoc.slice((trang - 1) * PER_PAGE, trang * PER_PAGE);

    const moForm = (b = null) => {
        setLoi('');
        setFileAnh(null);
        if (b) {
            setForm({
                chu_de_id: b.chu_de_id ?? '',
                tieu_de: b.tieu_de || '',
                mo_ta_ngan: b.mo_ta_ngan || '',
                noi_dung: b.noi_dung || '',
                trang_thai: b.trang_thai === 'dang' ? 'dang' : 'nhap',
            });
            setPreviewAnh(b.anh_bia ? anhUrl(b.anh_bia) : '');
        } else {
            setForm({ ...FORM_RONG, chu_de_id: dsChuDe[0]?.id ?? '' });
            setPreviewAnh('');
        }
        setModal({ mo: true, baiViet: b });
    };

    const dongForm = () => {
        setModal({ mo: false, baiViet: null });
        setFileAnh(null);
        setPreviewAnh('');
    };

    const handleChonFile = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setLoi('Dung lượng ảnh không được vượt quá 2MB!');
                return;
            }
            setFileAnh(file);
            setPreviewAnh(URL.createObjectURL(file));
            setLoi('');
        }
    };

    const luu = async (e) => {
        e.preventDefault();
        if (!form.tieu_de.trim()) return setLoi('Vui lòng nhập tiêu đề');
        if (!form.noi_dung.trim()) return setLoi('Vui lòng nhập nội dung');

        try {
            const formData = new FormData();
            formData.append('tieu_de', form.tieu_de);
            formData.append('noi_dung', form.noi_dung);
            formData.append('tom_tat', form.tom_tat || ''); 
            formData.append('trang_thai', form.trang_thai); 
            if (form.chu_de_id) {
                formData.append('chu_de_id', form.chu_de_id);
            }
            if (fileAnh) {
                formData.append('anh_dai_dien', fileAnh); 
            }

            if (modal.baiViet) {
                await dichVu.capNhat(modal.baiViet.id, formData);
            } else {
                await dichVu.themMoi(formData);
            }

            dongForm();
            taiDuLieu();
        } catch (err) {
            const errors = err.response?.data?.errors;
            setLoi(
                errors
                    ? Object.values(errors).flat().join(' | ')
                    : err.response?.data?.message || 'Lưu thất bại'
            );
        }
    };

    const chayHanhDong = async (hamGoi, xacNhan) => {
        if (xacNhan && !window.confirm(xacNhan)) return;
        try {
            await hamGoi();
            taiDuLieu();
        } catch (err) {
            alert(err.response?.data?.message || 'Thao tác thất bại');
        }
    };

    const daDang = (b) => b.trang_thai === 'dang';

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
                <button
                    onClick={() => moForm()}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    + Thêm bài viết
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    value={tuKhoa}
                    onChange={(e) => { setTuKhoa(e.target.value); setTrang(1); }}
                    placeholder="Tìm theo tiêu đề..."
                    className="border rounded px-3 py-2 w-72"
                />
                <select
                    value={locTrangThai}
                    onChange={(e) => { setLocTrangThai(e.target.value); setTrang(1); }}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="dang">Đã xuất bản</option>
                    <option value="nhap">Bản nháp</option>
                </select>
            </div>

            <div className="overflow-x-auto border rounded">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Ảnh bìa</th>
                            <th className="p-3">Tiêu đề</th>
                            <th className="p-3">Chủ đề</th>
                            <th className="p-3">Lượt xem</th>
                            <th className="p-3">Trạng thái</th>
                            <th className="p-3">Ngày tạo</th>
                            <th className="p-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dangTai ? (
                            <tr><td colSpan={8} className="p-6 text-center">Đang tải...</td></tr>
                        ) : dsTrang.length === 0 ? (
                            <tr><td colSpan={8} className="p-6 text-center">Không có dữ liệu</td></tr>
                        ) : (
                            dsTrang.map((b) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-3">{b.id}</td>
                                    <td className="p-3">
                                        {b.anh_dai_dien ? (
                                            <img
                                                src={anhUrl(b.anh_dai_dien)}
                                                alt={b.tieu_de}
                                                className="w-16 h-12 object-cover rounded border"
                                            />
                                        ) : (
                                            <div className="w-16 h-12 rounded border bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                                                Không ảnh
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 font-medium max-w-xs">
                                        <div className="line-clamp-2">{b.tieu_de}</div>
                                        {b.mo_ta_ngan && (
                                            <div className="text-xs text-gray-500 line-clamp-1 font-normal">
                                                {b.mo_ta_ngan}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3">{mapChuDe[b.chu_de_id] || '—'}</td>
                                    <td className="p-3">{b.luot_xem ?? 0}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${daDang(b)
                                                ? 'bg-green-100 text-green-700 font-semibold'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {daDang(b) ? 'Đã xuất bản' : 'Bản nháp'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {b.ngay_tao ? new Date(b.ngay_tao).toLocaleDateString('vi-VN') : ''}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <NutIcon title="Sửa" mau="text-blue-600" onClick={() => moForm(b)}>
                                                <IconSua />
                                            </NutIcon>

                                            <NutIcon
                                                title={daDang(b) ? 'Gỡ về bản nháp' : 'Xuất bản'}
                                                mau="text-orange-600"
                                                onClick={() =>
                                                    chayHanhDong(
                                                        () => dichVu.doiTrangThai(b.id),
                                                        daDang(b)
                                                            ? `Gỡ bài "${b.tieu_de}" về bản nháp?`
                                                            : `Xuất bản bài "${b.tieu_de}"?`
                                                    )
                                                }
                                            >
                                                {daDang(b) ? <IconMatGach /> : <IconMat />}
                                            </NutIcon>

                                            <NutIcon
                                                title="Xoá"
                                                mau="text-red-600"
                                                onClick={() =>
                                                    chayHanhDong(
                                                        () => dichVu.xoa(b.id),
                                                        `Xoá vĩnh viễn bài viết "${b.tieu_de}"? Không thể hoàn tác.`
                                                    )
                                                }
                                            >
                                                <IconXoa />
                                            </NutIcon>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
                <span>Tổng: {dsLoc.length} bài viết</span>
                <div className="flex items-center gap-2">
                    <button
                        disabled={trang === 1}
                        onClick={() => setTrang(trang - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Trước
                    </button>
                    <span>{trang} / {tongTrang}</span>
                    <button
                        disabled={trang === tongTrang}
                        onClick={() => setTrang(trang + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Sau
                    </button>
                </div>
            </div>

            {/* MODAL THÊM / SỬA BÀI VIẾT */}
            {modal.mo && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <form
                        onSubmit={luu}
                        className="bg-white rounded-lg p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-xl font-bold">
                            {modal.baiViet ? 'Sửa bài viết' : 'Thêm bài viết'}
                        </h2>

                        {loi && <p className="text-red-600 text-sm">{loi}</p>}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Chủ đề bài viết</label>
                            <select
                                value={form.chu_de_id}
                                onChange={(e) => setForm({ ...form, chu_de_id: e.target.value })}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value="">-- Chọn chủ đề --</option>
                                {dsChuDe.map((c) => (
                                    <option key={c.id} value={c.id}>{tenChuDe(c)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tiêu đề bài viết *</label>
                            <input
                                placeholder="Tiêu đề"
                                required
                                value={form.tieu_de}
                                onChange={(e) => setForm({ ...form, tieu_de: e.target.value })}
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>

                        {/* KHU VỰC CHỌN ẢNH BÌA TỪ MÁY TÍNH */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Ảnh bìa bài viết</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleChonFile}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-gray-50 hover:bg-gray-100"
                                >
                                    📁 Chọn file ảnh từ máy
                                </button>
                                <span className="text-xs text-gray-400">Hỗ trợ JPG, PNG, WEBP (tối đa 2MB)</span>
                            </div>

                            {previewAnh && (
                                <div className="mt-2">
                                    <img
                                        src={previewAnh}
                                        alt="Xem trước ảnh"
                                        className="h-32 w-auto rounded border object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Mô tả ngắn</label>
                            <textarea
                                placeholder="Mô tả tóm tắt nội dung bài viết..."
                                rows={2}
                                value={form.mo_ta_ngan}
                                onChange={(e) => setForm({ ...form, mo_ta_ngan: e.target.value })}
                                className="border rounded px-3 py-2 w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Nội dung chi tiết *</label>
                            <textarea
                                placeholder="Nội dung bài viết (văn bản hoặc mã HTML)..."
                                rows={8}
                                required
                                value={form.noi_dung}
                                onChange={(e) => setForm({ ...form, noi_dung: e.target.value })}
                                className="border rounded px-3 py-2 w-full font-mono text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Trạng thái</label>
                            <select
                                value={form.trang_thai}
                                onChange={(e) => setForm({ ...form, trang_thai: e.target.value })}
                                className="border rounded px-3 py-2 w-full"
                            >
                                <option value="nhap">Bản nháp</option>
                                <option value="dang">Xuất bản</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t">
                            <button type="button" onClick={dongForm} className="px-4 py-2 border rounded">
                                Huỷ
                            </button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                Lưu bài viết
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}