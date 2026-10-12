'use client';
import React from 'react';

export default function ChiTietDonHangModal({ moModal, dongModal, donHang, dangTai }) {
  if (!moModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={dongModal} />
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-white">
             Chi Tiết Đơn Hàng #{donHang?.id}
          </h2>
          <button onClick={dongModal} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
        </div>

        {/* Body Modal */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {dangTai ? (
            <div className="text-center py-12 text-gray-500">Đang tải chi tiết đơn hàng...</div>
          ) : !donHang ? (
            <div className="text-center py-12 text-gray-500">Không tìm thấy thông tin đơn hàng.</div>
          ) : (
            <>
              {/* Thông tin người nhận */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Người nhận</p>
                  <p className="text-sm font-bold text-gray-800">{donHang.ten_nguoi_nhan}</p>
                  <p className="text-sm text-gray-600">SĐT: {donHang.so_dien_thoai_nhan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Địa chỉ giao hàng</p>
                  <p className="text-sm text-gray-700">{donHang.dia_chi_nhan}</p>
                  {donHang.ghi_chu && <p className="text-xs text-amber-600 mt-1">Ghi chú: {donHang.ghi_chu}</p>}
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3">Danh sách sản phẩm</h3>
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b text-xs text-gray-600 uppercase">
                      <tr>
                        <th className="p-3">Sản phẩm</th>
                        <th className="p-3 text-center">Số lượng</th>
                        <th className="p-3 text-right">Đơn giá</th>
                        <th className="p-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {donHang.chi_tiet?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-3 flex items-center gap-3">
                            {item.hinh_anh && (
                              <img src={item.hinh_anh} alt={item.ten_san_pham} className="w-10 h-10 object-cover rounded-lg border" />
                            )}
                            <span className="font-medium text-gray-800">{item.ten_san_pham}</span>
                          </td>
                          <td className="p-3 text-center font-semibold">{item.so_luong}</td>
                          <td className="p-3 text-right text-gray-600">{Number(item.gia_ban).toLocaleString('vi-VN')} đ</td>
                          <td className="p-3 text-right font-bold text-emerald-600">{Number(item.thanh_tien).toLocaleString('vi-VN')} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tổng kết tài chính */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">Phương thức thanh toán: <span className="font-bold">{donHang.phuong_thuc_thanh_toan}</span></p>
                  <p className="text-xs text-gray-600">Trạng thái thanh toán: <span className="font-bold uppercase">{donHang.trang_thai_thanh_toan}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Tổng thanh toán</p>
                  <p className="text-xl font-extrabold text-emerald-700">{Number(donHang.thanh_tien).toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end shrink-0">
          <button type="button" onClick={dongModal} className="px-4 py-2 rounded-lg text-sm border bg-white hover:bg-gray-100">Đóng</button>
        </div>

      </div>
    </div>
  );
}