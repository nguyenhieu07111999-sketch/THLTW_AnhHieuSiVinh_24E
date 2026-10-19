'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useXacThuc } from '@/context/xac-thuc-context';
import DanhSachDonHang from '@/components/don-hang/danh-sach-don-hang';
import dichVuTaiKhoan from '@/services/dich-vu-tai-khoan';
import { dinhDangNgay, TRANG_THAI_TAI_KHOAN } from '@/utils/dinh-dang';

function Truong({ nhan, giaTri }) {
  return (
    <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
      <span className="text-xs text-gray-400 block font-medium">{nhan}</span>
      <span className="font-semibold text-gray-800 break-words">{giaTri}</span>
    </div>
  );
}

export default function TrangHoSo() {
  const { user, daSanSang, capNhatUser } = useXacThuc();

  // Trạng thái bật/tắt form chỉnh sửa và gửi dữ liệu
  const [dangChinhSua, setDangChinhSua] = useState(false);
  const [dangLuu, setDangLuu] = useState(false);
  const [thongBao, setThongBao] = useState({ loai: '', noiDung: '' });

  // State form nhập thông tin
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: '',
  });

  // State xử lý ảnh đại diện
  const [fileAnh, setFileAnh] = useState(null);
  const [previewAnh, setPreviewAnh] = useState(null);
  const fileInputRef = useRef(null);

  // Đồng bộ thông tin mới nhất từ API backend
  useEffect(() => {
    if (!daSanSang || !user) return;
    const controller = new AbortController();

    dichVuTaiKhoan
      .layHoSo(controller.signal)
      .then((res) => {
        const duLieu = res.data || res;
        capNhatUser(duLieu);
      })
      .catch(() => {});

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daSanSang, !!user]);

  // Cập nhật formData mỗi khi dữ liệu user trong context thay đổi
  // useEffect(() => {
  //   if (user) {
  //     setFormData({
  //       ho_ten: user.ho_ten || '',
  //       so_dien_thoai: user.so_dien_thoai || '',
  //       dia_chi: user.dia_chi || '',
  //     });
  //     setPreviewAnh(user.anh_dai_dien || null);
  //   }
  // }, [user]);
  const batDauChinhSua = () => {
    setFormData({
      ho_ten: user?.ho_ten || '',
      so_dien_thoai: user?.so_dien_thoai || '',
      dia_chi: user?.dia_chi || '',
    });
    setPreviewAnh(user?.anh_dai_dien || null);
    setFileAnh(null);
    setThongBao({ loai: '', noiDung: '' });
    setDangChinhSua(true);
  };

  // Xử lý khi chọn file ảnh từ máy
  const handleChonAnh = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setThongBao({ loai: 'loi', noiDung: 'Dung lượng ảnh không được vượt quá 2MB!' });
        return;
      }
      setFileAnh(file);
      setPreviewAnh(URL.createObjectURL(file));
      setThongBao({ loai: '', noiDung: '' });
    }
  };

  // Hủy chỉnh sửa, hoàn tác lại ảnh và thông tin ban đầu
  const handleHuy = () => {
    setDangChinhSua(false);
    setFileAnh(null);
    setPreviewAnh(user?.anh_dai_dien || null);
    setFormData({
      ho_ten: user?.ho_ten || '',
      so_dien_thoai: user?.so_dien_thoai || '',
      dia_chi: user?.dia_chi || '',
    });
    setThongBao({ loai: '', noiDung: '' });
  };

  // Gửi cập nhật thông tin và file ảnh
  const handleLuu = async (e) => {
    e.preventDefault();
    setDangLuu(true);
    setThongBao({ loai: '', noiDung: '' });

    try {
      const payload = new FormData();
      payload.append('ho_ten', formData.ho_ten);
      payload.append('so_dien_thoai', formData.so_dien_thoai || '');
      payload.append('dia_chi', formData.dia_chi || '');
      if (fileAnh) {
        payload.append('anh_dai_dien', fileAnh);
      }

      const res = await dichVuTaiKhoan.capNhatHoSo(payload);
      const userMoi = res.data || res;

      capNhatUser(userMoi);
      setFileAnh(null);
      setDangChinhSua(false);
      setThongBao({
        loai: 'thanh_cong',
        noiDung: res.message || 'Cập nhật hồ sơ thành công!',
      });
    } catch (err) {
      const msg =
        err.response?.data?.errors
          ? Object.values(err.response.data.errors)[0]?.[0]
          : err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ!';
      setThongBao({ loai: 'loi', noiDung: msg });
    } finally {
      setDangLuu(false);
    }
  };

  if (!daSanSang) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center text-gray-400">Đang tải...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <p className="text-gray-500">Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.</p>
        <Link
          href="/dang-nhap?redirect=/ho-so"
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <section className="space-y-4">
        <div className="border-b border-emerald-100 pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hồ Sơ Cá Nhân</h1>
            <p className="text-sm text-gray-500">Quản lý thông tin tài khoản và xem lịch sử mua sắm</p>
          </div>
          {!dangChinhSua && (
            <button
              type="button"
              onClick={batDauChinhSua}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              ✏️ Chỉnh sửa hồ sơ
            </button>
          )}
        </div>

        {/* Thông báo kết quả */}
        {thongBao.noiDung && (
          <div
            className={`p-3.5 rounded-xl text-sm font-medium ${
              thongBao.loai === 'thanh_cong'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {thongBao.noiDung}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
          {dangChinhSua ? (
            /* FORM CHỈNH SỬA THÔNG TIN & ĐỔI ẢNH */
            <form onSubmit={handleLuu} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
                <div
                  className="relative group cursor-pointer w-28 h-28 rounded-full overflow-hidden border-2 border-dashed border-emerald-400 bg-emerald-50 flex items-center justify-center shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  title="Nhấn để chọn ảnh mới"
                >
                  {previewAnh ? (
                    <img src={previewAnh} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-emerald-700 text-4xl font-bold">
                      {formData.ho_ten ? formData.ho_ten.charAt(0).toUpperCase() : '👤'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 text-white text-xs font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    Đổi ảnh
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleChonAnh}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                />

                <div className="text-center sm:text-left space-y-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm font-bold text-emerald-700 hover:underline"
                  >
                    Chọn ảnh đại diện mới
                  </button>
                  <p className="text-xs text-gray-400">Hỗ trợ JPG, PNG, WEBP tối đa 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="0987654321"
                    value={formData.so_dien_thoai}
                    onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ giao hàng mặc định</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ nhận hàng..."
                  value={formData.dia_chi}
                  onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                  className="w-full px-4 py-2.5 border rounded-xl border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleHuy}
                  disabled={dangLuu}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={dangLuu}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition disabled:bg-gray-400"
                >
                  {dangLuu ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          ) : (
            /* CHẾ ĐỘ XEM CHI TIẾT */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center space-y-3">
                {user.anh_dai_dien ? (
                  <img
                    src={user.anh_dai_dien}
                    alt={user.ho_ten || 'Avatar'}
                    className="w-28 h-28 rounded-full object-cover border-4 border-emerald-50 shadow-sm"
                  />
                ) : (
                  <div className="w-28 h-28 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-emerald-50 shadow-inner">
                    {user.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : '👤'}
                  </div>
                )}
                <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  {TRANG_THAI_TAI_KHOAN?.[user.trang_thai] ?? 'Hoạt động'}
                </span>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Truong nhan="Họ và tên" giaTri={user.ho_ten || 'Chưa cập nhật'} />
                  <Truong nhan="Địa chỉ Email" giaTri={user.email || 'Chưa cập nhật'} />
                  <Truong nhan="Số điện thoại" giaTri={user.so_dien_thoai || 'Chưa cập nhật'} />
                  <Truong nhan="Ngày tham gia" giaTri={user.ngay_tao ? dinhDangNgay(user.ngay_tao) : 'Gần đây'} />
                </div>
                <Truong nhan="Địa chỉ giao hàng mặc định" giaTri={user.dia_chi || 'Chưa cập nhật địa chỉ'} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">📦 Đơn hàng gần đây</h2>
          <Link href="/don-hang" className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <DanhSachDonHang gioiHan={3} />
      </section>
    </div>
  );
}