"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const VAI_TRO_HOP_LE = ["super_admin", "admin"];

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [matKhau, setMatKhau] = useState("");
    const [hienMatKhau, setHienMatKhau] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const user = JSON.parse(localStorage.getItem("admin_user") || "null");
        if (token && VAI_TRO_HOP_LE.includes(user?.vai_tro)) {
            router.replace("/admin");
        }
    }, [router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API}/api/admin/dang-nhap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, mat_khau: matKhau }),
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 422 && result.errors) {
                    const first = Object.values(result.errors)[0];
                    setError(Array.isArray(first) ? first[0] : "Dữ liệu không hợp lệ");
                } else {
                    setError(result.message || "Đăng nhập thất bại");
                }
                return;
            }

            localStorage.setItem("admin_token", result.access_token);
            localStorage.setItem("admin_user", JSON.stringify(result.data));
            router.push("/admin");
        } catch {
            setError("Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4 py-12">
            {/* Hình tròn trang trí nhẹ */}
            <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/40" />
            <div className="absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-emerald-300/20" />

            <div className="relative w-full max-w-md">
                <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-xl shadow-emerald-900/5 sm:p-10">
                    {/* Logo + tiêu đề */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                            🌱
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Đăng nhập quản trị</h1>
                        <p className="mt-1.5 text-sm text-gray-500">NôngSảnTươi</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                <span>⚠️</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@gmail.com"
                                required
                                autoComplete="username"
                                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="mat_khau" className="mb-1.5 block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="mat_khau"
                                    type={hienMatKhau ? "text" : "password"}
                                    value={matKhau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                    placeholder="Nhập mật khẩu"
                                    required
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-20 text-gray-900 placeholder-gray-400 transition focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setHienMatKhau(!hienMatKhau)}
                                    className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-emerald-700 hover:text-emerald-900"
                                >
                                    {hienMatKhau ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                    Đang đăng nhập...
                                </>
                            ) : (
                                "Đăng nhập"
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm">
                    <Link href="/" className="font-medium text-emerald-700 hover:text-emerald-900 hover:underline">
                        ← Quay về trang cửa hàng
                    </Link>
                </p>
            </div>
        </div>
    );
}