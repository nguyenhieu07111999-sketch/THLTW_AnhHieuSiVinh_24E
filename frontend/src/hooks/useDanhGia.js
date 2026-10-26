import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

export function useDanhGia(sanPhamId) {
  const [danhSach, setDanhSach] = useState([]);
  const [tongSo, setTongSo] = useState(0);
  const [diemTrungBinh, setDiemTrungBinh] = useState(5.0);
  const [dangTai, setDangTai] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState('');

  const [soSao, setSoSao] = useState(5);
  const [noiDung, setNoiDung] = useState('');
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [locSao, setLocSao] = useState(null); // null: tất cả

  const taiDanhGia = useCallback(async () => {
    if (!sanPhamId) return;
    setDangTai(true);
    try {
      const params = locSao ? { so_sao: locSao } : {};
      const res = await api.get(`/san-pham/${sanPhamId}/danh-gia`, { params });
      
      setDanhSach(res.data?.data || []);
      setTongSo(res.data?.tong_so || 0);
      setDiemTrungBinh(res.data?.diem_trung_binh || 5.0);
      setLoi('');
    } catch (err) {
      console.error('Lỗi tải đánh giá:', err);
    } finally {
      setDangTai(false);
    }
  }, [sanPhamId, locSao]);

  useEffect(() => {
    taiDanhGia();
  }, [taiDanhGia]);

  const themFile = (danhSachFileMoi) => {
    const tongSoFile = files.length + danhSachFileMoi.length;
    if (tongSoFile > 5) {
      setLoi('Chỉ được tải lên tối đa 5 ảnh hoặc video!');
      return;
    }

    const reviewPreviews = danhSachFileMoi.map((file) => ({
      url: URL.createObjectURL(file),
      isVideo: file.type.startsWith('video/'),
    }));

    setFiles((prev) => [...prev, ...danhSachFileMoi]);
    setPreviews((prev) => [...prev, ...reviewPreviews]);
    setLoi('');
  };

  const xoaFile = (index) => {
    URL.revokeObjectURL(previews[index]?.url);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 3. Gửi đánh giá qua FormData
  const guiDanhGia = async () => {
    if (!noiDung.trim()) {
      setLoi('Vui lòng nhập nội dung đánh giá!');
      return false;
    }

    setDangGui(true);
    setLoi('');

    try {
      const formData = new FormData();
      formData.append('so_sao', soSao);
      formData.append('noi_dung', noiDung);
      files.forEach((file) => {
        formData.append('tep_tin[]', file);
      });

      await api.post(`/san-pham/${sanPhamId}/danh-gia`, formData);

      // Dọn dẹp form sau khi gửi thành công
      setNoiDung('');
      setFiles([]);
      setPreviews([]);
      setSoSao(5);
      await taiDanhGia();
      return true;
    } catch (err) {
      if (err.response?.status === 401) {
        setLoi('Vui lòng đăng nhập để gửi đánh giá.');
      } else {
        const errors = err.response?.data?.errors;
        setLoi(
          errors
            ? Object.values(errors).flat().join(' | ')
            : err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá.'
        );
      }
      return false;
    } finally {
      setDangGui(false);
    }
  };

  return {
    danhSach,
    tongSo,
    diemTrungBinh,
    dangTai,
    dangGui,
    loi,
    soSao,
    setSoSao,
    noiDung,
    setNoiDung,
    previews,
    themFile,
    xoaFile,
    guiDanhGia,
    locSao,
    setLocSao,
    taiDanhGia,
  };
}