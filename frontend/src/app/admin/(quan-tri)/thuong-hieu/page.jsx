"use client";
import AdminForm from "@/components/admin/AdminForm";

export default function ThuongHieuPage() {
    async function handleSubmit(values) {
        // TODO: POST http://localhost:8000/api/thuong-hieu
        console.log("Dữ liệu thương hiệu:", values);
    }

    return (
        <div className="p-6">
            <h1 className="mb-5 text-2xl font-bold">Thêm thương hiệu</h1>
            <AdminForm
                title="Thông tin thương hiệu"
                submitText="Lưu thương hiệu"
                onSubmit={handleSubmit}
                fields={[
                    { name: "ten", label: "Tên thương hiệu", required: true, full: true },
                    { name: "logo", label: "Link logo", type: "image", full: true, placeholder: "https://..." },
                    { name: "mo_ta", label: "Mô tả", type: "textarea", full: true },
                    { name: "trang_thai", label: "Trạng thái", type: "toggle", full: true },
                ]}
            />
        </div>
    );
}