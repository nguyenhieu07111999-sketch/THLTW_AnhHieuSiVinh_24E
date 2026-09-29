export default function TrangGioiThieu() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <h1 className="text-3xl font-bold text-emerald-950 mb-4">Về Chúng Tôi - Nông Sản Tươi</h1>
      <p className="text-gray-600 leading-relaxed mb-8">
        Chúng tôi tự hào là đơn vị tiên phong kết nối trực tiếp các trang trại rau củ chuẩn VietGAP/GlobalGAP tới căn bếp gia đình bạn.
      </p>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-3xl">🌿</span>
          <h3 className="font-bold mt-2">100% Hữu Cơ</h3>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-3xl">🚀</span>
          <h3 className="font-bold mt-2">Giao Hàng 2H</h3>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm">
          <span className="text-3xl">🛡️</span>
          <h3 className="font-bold mt-2">Đổi Trả Miễn Phí</h3>
        </div>
      </div>
    </div>
  );
}