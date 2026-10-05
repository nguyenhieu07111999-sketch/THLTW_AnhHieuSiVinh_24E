"use client";
import AdminForm from "@/components/admin/AdminForm";

// Tạm thời là dữ liệu mẫu. Khi có API: fetch danh sách danh mục/thương hiệu rồi truyền vào options.
const DANH_MUC = [
  { value: 1, label: "Rau củ" },
  { value: 2, label: "Trái cây" },
];
const THUONG_HIEU = [
  { value: 1, label: "Đà Lạt Farm" },
  { value: 2, label: "VinEco" },
];

export default function SanPhamPage() {
  async function handleSubmit(values) {
    // TODO: gọi API, ví dụ:
    // await fetch("http://localhost:8000/api/san-pham", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Accept: "application/json" },
    //   body: JSON.stringify(values),
    // });
    console.log("Dữ liệu sản phẩm:", values);
  }

  return (
    <div className="p-6">
      <h1 className="mb-5 text-2xl font-bold">Thêm sản phẩm</h1>
      <AdminForm
        title="Thông tin sản phẩm"
        submitText="Lưu sản phẩm"
        onSubmit={handleSubmit}
        fields={[
          { name: "ten", label: "Tên sản phẩm", required: true, full: true },
          { name: "gia", label: "Giá (đ)", type: "number", required: true },
          { name: "so_luong", label: "Số lượng", type: "number", required: true },
          { name: "danh_muc_id", label: "Danh mục", type: "select", options: DANH_MUC, required: true },
          { name: "thuong_hieu_id", label: "Thương hiệu", type: "select", options: THUONG_HIEU },
          { name: "hinh_anh", label: "Link hình ảnh", type: "image", full: true, placeholder: "https://..." },
          { name: "mo_ta", label: "Mô tả", type: "textarea", full: true },
          { name: "trang_thai", label: "Trạng thái", type: "toggle", full: true },
        ]}
      />
    </div>
  );
}