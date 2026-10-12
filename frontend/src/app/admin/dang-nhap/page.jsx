'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [loi, setLoi] = useState('');
    const [dangGui, setDangGui] = useState(false);

    const dangNhap = async (e) => {
        e.preventDefault();
        setLoi('');
        setDangGui(true);
        try {
            const res = await api.post('/admin/dang-nhap', { email, mat_khau: matKhau });
            localStorage.setItem('admin_token', res.data.access_token);
            localStorage.setItem('admin_info', JSON.stringify(res.data.data));
            router.replace('/admin/nguoi-dung');
        } catch (err) {
            const errors = err.response?.data?.errors;
            setLoi(
                errors
                    ? Object.values(errors).flat().join(' | ')
                    : err.response?.data?.message || 'Đăng nhập thất bại'
            );
        } finally {
            setDangGui(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={dangNhap} className="bg-white border rounded-lg p-8 w-full max-w-sm space-y-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-800">🌱 NôngSảnTươi</div>
                    <div className="text-sm text-gray-500">Đăng nhập quản trị</div>
                </div>

                {loi && <p className="text-red-600 text-sm">{loi}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={matKhau}
                    onChange={(e) => setMatKhau(e.target.value)}
                    className="border rounded px-3 py-2 w-full"
                    required
                />
                <button
                    type="submit"
                    disabled={dangGui}
                    className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {dangGui ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </main>
    );
}