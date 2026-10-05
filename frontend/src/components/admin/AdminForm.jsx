"use client";
import { useState } from "react";

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600";

export default function AdminForm({
  title,
  fields,
  initialValues = {},
  onSubmit,
  submitText = "Lưu",
}) {
  const empty = Object.fromEntries(
    fields.map((f) => [f.name, f.type === "toggle" ? 1 : ""])
  );
  const [values, setValues] = useState({ ...empty, ...initialValues });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    const errs = {};
    fields.forEach((f) => {
      if (f.required && String(values[f.name] ?? "").trim() === "")
        errs[f.name] = `${f.label} không được để trống`;
    });
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await onSubmit?.(values); // <-- gắn API ở trang gọi form này
      setMessage({ type: "ok", text: "Lưu thành công" });
      setValues({ ...empty });
    } catch (err) {
      // lỗi validate 422 của Laravel: { errors: { field: ["msg"] } }
      const be = {};
      Object.entries(err?.errors || {}).forEach(
        ([k, v]) => (be[k] = Array.isArray(v) ? v[0] : v)
      );
      setErrors(be);
      setMessage({ type: "error", text: err?.message || "Có lỗi xảy ra" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-bold">{title}</h2>

      {message && (
        <p
          className={`mb-4 rounded-lg p-3 text-sm ${
            message.type === "ok"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.full ? "md:col-span-2" : ""}>
            <label className="mb-1 block text-sm font-medium">
              {f.label} {f.required && <span className="text-red-500">*</span>}
            </label>

            {f.type === "select" ? (
              <select
                className={inputCls}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
              >
                <option value="">-- Chọn --</option>
                {(f.options || []).map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea
                rows={4}
                className={inputCls}
                placeholder={f.placeholder}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : f.type === "toggle" ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!Number(values[f.name])}
                  onChange={(e) => set(f.name, e.target.checked ? 1 : 0)}
                />
                {f.toggleText || "Hiển thị"}
              </label>
            ) : (
              <input
                type={f.type === "image" ? "text" : f.type || "text"}
                className={inputCls}
                placeholder={f.placeholder}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}

            {f.type === "image" && values[f.name] && (
              <img
                src={values[f.name]}
                alt="Xem trước"
                className="mt-2 h-24 w-24 rounded-lg border object-cover"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}

            {errors[f.name] && (
              <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setValues({ ...empty });
            setErrors({});
            setMessage(null);
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
        >
          Nhập lại
        </button>
        <button
          disabled={saving}
          className="rounded-lg bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : submitText}
        </button>
      </div>
    </form>
  );
}