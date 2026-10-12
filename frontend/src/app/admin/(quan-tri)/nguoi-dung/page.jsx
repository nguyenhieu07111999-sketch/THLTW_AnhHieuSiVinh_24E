'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import * as dichVu from '@/services/dich-vu-nguoi-dung';

const PER_PAGE = 10;
const FORM_RONG = {
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: '',
    mat_khau: '',
    trang_thai: 'hoat_dong',
};

const toMang = (r) => (Array.isArray(r) ? r : r?.data ?? []);

/* ---------- Icon (SVG, không cần cài thư viện) ---------- */
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

const IconKhoa = () => (
    <Icon>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
);

const IconMoKhoa = () => (
    <Icon>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
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

export default function TrangNguoiDung() {
    const [ds, setDs] = useState([]);
    const [dangTai, setDangTai] = useState(false);
    const [tuKhoa, setTuKhoa] = useState('');
    const [locTrangThai, setLocTrangThai] = useState('');
    const [trang, setTrang] = useState(1);
    const [modal, setModal] = useState({ mo: false, nguoiDung: null });
    const [form, setForm] = useState(FORM_RONG);
    const [loi, setLoi] = useState('');

    const taiDuLieu = useCallback(async () => {
        setDangTai(true);
        try {
            const r = await dichVu.layDanhSach({ per_page: 200 });
            setDs(toMang(r));
        } catch (e) {
            alert(e.response?.data?.message || 'Không tải được danh sách người dùng');
        } finally {
            setDangTai(false);
        }
    }, []);

    useEffect(() => {
        taiDuLieu();
    }, [taiDuLieu]);

    const dsLoc = useMemo(() => {
        const k = tuKhoa.trim().toLowerCase();
        return ds.filter((u) => {
            const khop =
                !k ||
                u.ho_ten?.toLowerCase().includes(k) ||
                u.email?.toLowerCase().includes(k) ||
                u.so_dien_thoai?.includes(k);
            const tt = !locTrangThai || u.trang_thai === locTrangThai;
            return khop && tt;
        });
    }, [ds, tuKhoa, locTrangThai]);

    const tongTrang = Math.max(1, Math.ceil(dsLoc.length / PER_PAGE));
    const dsTrang = dsLoc.slice((trang - 1) * PER_PAGE, trang * PER_PAGE);

    const moForm = (u = null) => {
        setLoi('');
        setForm(
            u
                ? {
                    ho_ten: u.ho_ten || '',
                    email: u.email || '',
                    so_dien_thoai: u.so_dien_thoai || '',
                    dia_chi: u.dia_chi || '',
                    mat_khau: '',
                    trang_thai: u.trang_thai || 'hoat_dong',
                }
                : FORM_RONG
        );
        setModal({ mo: true, nguoiDung: u });
    };

    const dongForm = () => setModal({ mo: false, nguoiDung: null });

    const luu = async (e) => {
        e.preventDefault();
        if (!form.ho_ten.trim()) return setLoi('Vui lòng nhập họ tên');
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return setLoi('Email không hợp lệ');
        if (!modal.nguoiDung && form.mat_khau.length < 6)
            return setLoi('Mật khẩu tối thiểu 6 ký tự');
        if (modal.nguoiDung && form.mat_khau && form.mat_khau.length < 6)
            return setLoi('Mật khẩu mới tối thiểu 6 ký tự');

        const payload = { ...form };
        if (!payload.mat_khau) delete payload.mat_khau;

        try {
            if (modal.nguoiDung) await dichVu.capNhat(modal.nguoiDung.id, payload);
            else await dichVu.themMoi(payload);
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

    const dangHoatDong = (u) => u.trang_thai === 'hoat_dong';

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Quản lý người dùng</h1>

            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    value={tuKhoa}
                    onChange={(e) => { setTuKhoa(e.target.value); setTrang(1); }}
                    placeholder="Tìm theo tên, email, số điện thoại..."
                    className="border rounded px-3 py-2 w-72"
                />
                <select
                    value={locTrangThai}
                    onChange={(e) => { setLocTrangThai(e.target.value); setTrang(1); }}
                    className="border rounded px-3 py-2"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="hoat_dong">Hoạt động</option>
                    <option value="khoa">Bị khoá</option>
                </select>
            </div>

            <div className="overflow-x-auto border rounded">
                <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Họ tên</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">SĐT</th>
                            <th className="p-3">Địa chỉ</th>
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
                            dsTrang.map((u) => (
                                <tr key={u.id} className="border-t">
                                    <td className="p-3">{u.id}</td>
                                    <td className="p-3 font-medium">{u.ho_ten}</td>
                                    <td className="p-3">{u.email}</td>
                                    <td className="p-3">{u.so_dien_thoai || '—'}</td>
                                    <td className="p-3">{u.dia_chi || '—'}</td>
                                    <td className="p-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${dangHoatDong(u)
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {dangHoatDong(u) ? 'Hoạt động' : 'Bị khoá'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        {u.ngay_tao ? new Date(u.ngay_tao).toLocaleDateString('vi-VN') : ''}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <NutIcon title="Sửa" mau="text-blue-600" onClick={() => moForm(u)}>
                                                <IconSua />
                                            </NutIcon>

                                            <NutIcon
                                                title={dangHoatDong(u) ? 'Khoá tài khoản' : 'Mở khoá tài khoản'}
                                                mau="text-orange-600"
                                                onClick={() =>
                                                    chayHanhDong(
                                                        () => dichVu.doiTrangThai(u.id),
                                                        dangHoatDong(u)
                                                            ? `Khoá tài khoản "${u.ho_ten}"?`
                                                            : `Mở khoá tài khoản "${u.ho_ten}"?`
                                                    )
                                                }
                                            >
                                                {dangHoatDong(u) ? <IconKhoa /> : <IconMoKhoa />}
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
                <span>Tổng: {dsLoc.length} người dùng</span>
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

            {modal.mo && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <form onSubmit={luu} className="bg-white rounded-lg p-6 w-full max-w-md space-y-3">
                        <h2 className="text-xl font-bold">
                            {modal.nguoiDung ? 'Sửa người dùng' : 'Thêm người dùng'}
                        </h2>

                        {loi && <p className="text-red-600 text-sm">{loi}</p>}

                        <input
                            placeholder="Họ tên"
                            value={form.ho_ten}
                            onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <input
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <input
                            placeholder="Số điện thoại"
                            value={form.so_dien_thoai}
                            onChange={(e) => setForm({ ...form, so_dien_thoai: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <input
                            placeholder="Địa chỉ"
                            value={form.dia_chi}
                            onChange={(e) => setForm({ ...form, dia_chi: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <input
                            placeholder={modal.nguoiDung ? 'Mật khẩu mới (bỏ trống nếu không đổi)' : 'Mật khẩu'}
                            type="password"
                            value={form.mat_khau}
                            onChange={(e) => setForm({ ...form, mat_khau: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        />
                        <select
                            value={form.trang_thai}
                            onChange={(e) => setForm({ ...form, trang_thai: e.target.value })}
                            className="border rounded px-3 py-2 w-full"
                        >
                            <option value="hoat_dong">Hoạt động</option>
                            <option value="khoa">Bị khoá</option>
                        </select>

                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={dongForm} className="px-4 py-2 border rounded">
                                Huỷ
                            </button>
                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                                Lưu
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}