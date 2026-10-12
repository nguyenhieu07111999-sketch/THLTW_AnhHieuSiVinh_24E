"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

const MENU = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/san-pham", label: "Sản phẩm", icon: "🥬" },
    { href: "/admin/danh-muc", label: "Danh mục", icon: "🗂️" },
    { href: "/admin/thuong-hieu", label: "Thương hiệu", icon: "🏷️" },
    { href: "/admin/nguoi-dung", label: "Người dùng", icon: "👥" },
    { href: "/admin/bai-viet", label: "Bài viết", icon: "📝" },
    { href: "/admin/don-hang", label: "Đơn hàng", icon: "📦" },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const isActive = (href) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

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
                            <div className="text-sm font-medium text-gray-900">Quản trị viên</div>
                            <div className="text-xs text-gray-500">Không cần đăng nhập</div>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold">
                            A
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
}