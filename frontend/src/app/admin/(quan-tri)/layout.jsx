"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const VAI_TRO_HOP_LE = ["super_admin", "admin"];

const MENU = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/san-pham", label: "Sản phẩm", icon: "🥬" },
    { href: "/admin/danh-muc", label: "Danh mục", icon: "🗂️" },
    { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: "🏷️" },
];

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);
    const [admin, setAdmin] = useState(null);

    function clearAndRedirect() {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.replace("/admin/dang-nhap");
    }

    useEffect(() => {
        const token = localStorage.getItem("admin_token");
        const user = JSON.parse(localStorage.getItem("admin_user") || "null");

        if (!token || !VAI_TRO_HOP_LE.includes(user?.vai_tro)) {
            clearAndRedirect();
            return;
        }

        fetch(`${API}/api/user`, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        })
            .then((res) => {
                if (!res.ok) clearAndRedirect();
                else {
                    setAdmin(user);
                    setReady(true);
                }
            })
            .catch(clearAndRedirect);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function logout() {
        const token = localStorage.getItem("admin_token");
        try {
            await fetch(`${API}/api/dang-xuat`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            });
        } finally {
            clearAndRedirect();
        }
    }

    const isActive = (href) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    if (!ready) return null;

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 shrink-0 bg-green-900 text-white flex flex-col sticky top-0 h-screen">
                <div className="px-6 py-5 border-b border-green-800">
                    <div className="text-xl font-bold">🌱 NôngSảnTươi</div>
                    <div className="text-xs text-green-300 mt-1">Trang quản trị</div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {MENU.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive(item.href)
                                    ? "bg-green-600 text-white"
                                    : "text-green-100 hover:bg-green-800"
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="px-3 py-4 border-t border-green-800">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-green-100 hover:bg-green-800"
                    >
                        <span>🏠</span> Xem cửa hàng
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-green-800"
                    >
                        <span>🚪</span> Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Nội dung */}
            <div className="flex-1 min-w-0 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-800">
                        {MENU.find((m) => isActive(m.href))?.label || "Quản trị"}
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{admin?.ho_ten}</div>
                            <div className="text-xs text-gray-500">{admin?.vai_tro}</div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                            {admin?.ho_ten?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}