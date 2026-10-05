"use client";
import AdminForm from "@/components/admin/AdminForm";

export default function DanhMucPage() {
  async function handleSubmit(values) {
    // TODO: POST http://localhost:8000/api/danh-muc
    console.log("Dữ liệu danh mục:", values);
  }

  return (
    <div className="p-6">
      <h1 className="mb-5 text-2xl font-bold">Thêm danh mục</h1>
      <AdminForm
        title="Thông tin danh mục"
        submitText="Lưu danh mục"
        onSubmit={handleSubmit}
        fields={[
          { name: "ten", label: "Tên danh mục", required: true, full: true },
          { name: "mo_ta", label: "Mô tả", type: "textarea", full: true },
          { name: "trang_thai", label: "Trạng thái", type: "toggle", full: true },
        ]}
      />
    </div>
  );
}