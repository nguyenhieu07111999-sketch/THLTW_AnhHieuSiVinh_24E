'use client';

import React, { useState, useEffect } from 'react';
import { dichVuDanhMuc } from '@/services/dich-vu-danh-muc';
import { dichVuSanPham } from '@/services/dich-vu-san-pham';
import TheSanPham from '@/components/san-pham/the-san-pham';
import PhanTrang from '@/components/dieu-huong/phan-trang';

export default function TrangDanhMuc() {
  const [danhMucList, setDanhMucList] = useState([]);
  const [sanPhamList, setSanPhamList] = useState([]);
  const [danhMucChon, setDanhMucChon] = useState('tat-ca');
  const [dangTai, setDangTai] = useState(true);

  // State phân trang
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(1);
  const [tongSoItem, setTongSoItem] = useState(0);
  const soItemMoiTrang = 9; 

  const layIconDanhMuc = (tenDanhMuc) => {
    if (!tenDanhMuc) return '🌱';
    const ten = tenDanhMuc.toLowerCase();
    if (ten.includes('trái cây') || ten.includes('hoa quả')) return '🍎';
    if (ten.includes('tươi sống') || ten.includes('thịt') || ten.includes('hải sản')) return '🥩';
    if (ten.includes('rau') || ten.includes('củ')) return '🥕';
    if (ten.includes('chế biến')) return '🍲';
    if (ten.includes('trứng') || ten.includes('sữa')) return '🥛';
    if (ten.includes('nước') || ten.includes('đồ uống')) return '🧃';
    return '🌿';
  };

  useEffect(() => {
    const taiDanhMuc = async () => {
      try {
        const res = await dichVuDanhMuc.layDanhSach({ per_page: 200 });
        setDanhMucList(res.data.data || res.data);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      }
    };
    taiDanhMuc();
  }, []);

  useEffect(() => {
      const taiSanPham = async () => {
        setDangTai(true);
        try {
          const params = {
            page: trangHienTai,
            per_page: soItemMoiTrang,
            ...(danhMucChon !== 'tat-ca' && { danh_muc_id: danhMucChon }),
          };
          const res = await dichVuSanPham.layDanhSach(params);
          
          const ketQua = res.data;
          
          const danhSach = ketQua.data || [];
          const meta = ketQua.meta || ketQua;

          setSanPhamList(danhSach);
          setTongSoTrang(meta.last_page || 1);
          setTongSoItem(meta.total || danhSach.length);
        } catch (error) {
          console.error('Lỗi tải sản phẩm:', error);
        } finally {
          setDangTai(false);
        }
      };
      taiSanPham();
    }, [danhMucChon, trangHienTai]);

  const handleChonDanhMuc = (id) => {
    setDanhMucChon(id);
    setTrangHienTai(1); 
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <aside className="bg-white p-5 rounded-2xl border border-emerald-100 h-fit space-y-2 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-emerald-950">Danh Mục Thực Phẩm</h3>
        
        <button
          onClick={() => handleChonDanhMuc('tat-ca')}
          className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            danhMucChon === 'tat-ca' 
              ? 'bg-emerald-600 text-white font-bold shadow-md' 
              : 'text-gray-600 hover:bg-emerald-50'
          }`}
        >
          <span className="text-lg">🧺</span>
          <span>Tất cả nông sản</span>
        </button>

        {danhMucList.map((item) => (
          <button
            key={item.id}
            onClick={() => handleChonDanhMuc(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              danhMucChon === item.id 
                ? 'bg-emerald-600 text-white font-bold shadow-md' 
                : 'text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <span className="text-lg">{layIconDanhMuc(item.ten_danh_muc)}</span>
            <span className="text-left line-clamp-1">{item.ten_danh_muc}</span>
          </button>
        ))}
      </aside>

      <main className="md:col-span-3 space-y-6 flex flex-col justify-between">
        <div>
          {dangTai ? (
            <div className="text-center py-16 text-gray-500">Đang tải sản phẩm...</div>
          ) : sanPhamList.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-emerald-100">
              Chưa có sản phẩm nào trong danh mục này.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {sanPhamList.map((sp) => (
                <TheSanPham key={sp.id} sp={sp} type="normal" />
              ))}
            </div>
          )}
        </div>

        {/* Thanh phân trang */}
        {!dangTai && tongSoTrang > 1 && (
          <div className="flex justify-end mt-4"> {/* Dùng justify-end để đẩy sang góc phải giống mẫu, hoặc justify-center nếu muốn nằm giữa */}
            <div className="bg-white rounded-xl overflow-hidden border border-emerald-100 shadow-sm inline-block">
              <PhanTrang
                trangHienTai={trangHienTai}
                tongSoTrang={tongSoTrang}
                setTrangHienTai={setTrangHienTai}
                tongSoItem={tongSoItem}
                soItemMoiTrang={soItemMoiTrang}
                tenLoaiItem="sản phẩm"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}