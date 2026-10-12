"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/admin");
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-sm text-gray-600">Đang chuyển đến trang quản trị...</p>
        </main>
    );
}
