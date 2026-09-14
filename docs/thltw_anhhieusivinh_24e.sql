-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2026 at 11:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `thltw_anhhieusivinh_24e`
--

-- --------------------------------------------------------

--
-- Table structure for table `bai_viet`
--

CREATE TABLE `bai_viet` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chu_de_id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `duong_dan_bv` varchar(255) NOT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `tom_tat` text DEFAULT NULL,
  `noi_dung` longtext NOT NULL,
  `luot_xem` int(10) UNSIGNED DEFAULT 0,
  `trang_thai` enum('xuat_ban','nhap') DEFAULT 'xuat_ban',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bai_viet`
--

INSERT INTO `bai_viet` (`id`, `chu_de_id`, `tieu_de`, `duong_dan_bv`, `anh_dai_dien`, `tom_tat`, `noi_dung`, `luot_xem`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, 'Bí quyết chọn rau cải tươi ngon không bị phun thuốc', 'bi-quyet-chon-rau-cai-tuoi-ngon', 'uploads/posts/rau-cai.jpg', 'Mẹo nhỏ giúp bà nội trợ phân biệt rau cải sạch và rau cải còn dư lượng thuốc bảo vệ thực vật.', '<p>Nội dung chi tiết bài viết về các tiêu chí chọn rau cải...</p>', 125, 'xuat_ban', '2026-09-14 09:04:38', '2026-09-14 09:04:38'),
(2, 1, 'Cách bảo quản thực phẩm trong tủ lạnh đúng cách', 'cach-bao-quan-thuc-pham-trong-tu-lanh', 'uploads/posts/bao-quan-tu-lanh.jpg', 'Hướng dẫn phân loại và sắp xếp thực phẩm giúp giữ nguyên dưỡng chất.', '<p>Nội dung chi tiết hướng dẫn sắp xếp ngăn mát và ngăn đông...</p>', 89, 'xuat_ban', '2026-09-14 09:04:38', '2026-09-14 09:04:38'),
(3, 2, 'Top 5 loại trái cây giàu Vitamin C tăng sức đề kháng', 'top-5-loai-trai-cay-giau-vitamin-c', 'uploads/posts/trai-cay-vitamin-c.jpg', 'Bổ sung ngay các loại quả này vào thực đơn hàng ngày để bảo vệ sức khỏe gia đình.', '<p>Nội dung bài viết về ớt chuông, ổi, cam, dâu tây, ki-wi...</p>', 210, 'xuat_ban', '2026-09-14 09:04:38', '2026-09-14 09:04:38');

-- --------------------------------------------------------

--
-- Table structure for table `chu_de_bai_viet`
--

CREATE TABLE `chu_de_bai_viet` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_chu_de` varchar(255) NOT NULL,
  `duong_dan_bv` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chu_de_bai_viet`
--

INSERT INTO `chu_de_bai_viet` (`id`, `ten_chu_de`, `duong_dan_bv`, `mo_ta`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Mẹo Chọn Thực Phẩm', 'meo-chon-thuc-pham', 'Các bí quyết lựa chọn rau củ, thịt cá tươi ngon và an toàn cho bữa ăn gia đình.', '2026-09-14 09:02:12', '2026-09-14 09:02:12'),
(2, 'Dinh Dưỡng & Sức Khỏe', 'dinh-duong-suc-khoe', 'Tổng hợp kiến thức dinh dưỡng, chế độ ăn lành mạnh và lợi ích của thực phẩm organic.', '2026-09-14 09:02:12', '2026-09-14 09:02:12'),
(3, 'Công Thức Nấu Ăn', 'cong-thuc-nau-an', 'Hướng dẫn chế biến các món ăn ngon, bổ dưỡng từ nguồn nguyên liệu sạch.', '2026-09-14 09:02:12', '2026-09-14 09:02:12'),
(4, 'Nông Nghiệp Sạch', 'nong-nghiep-sach', 'Thông tin về quy trình trồng trọt, chăn nuôi theo tiêu chuẩn VietGAP và Organic.', '2026-09-14 09:02:12', '2026-09-14 09:02:12');

-- --------------------------------------------------------

--
-- Table structure for table `danh_muc`
--

CREATE TABLE `danh_muc` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_danh_muc` varchar(255) NOT NULL,
  `duong_dan_dm` varchar(255) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `sp_noi_bat` tinyint(1) DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danh_muc`
--

INSERT INTO `danh_muc` (`id`, `ten_danh_muc`, `duong_dan_dm`, `hinh_anh`, `mo_ta`, `sp_noi_bat`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Rau củ hữu cơ', 'rau-cu-huu-co', NULL, NULL, 0, '2026-09-14 08:46:33', '2026-09-14 08:46:33');

-- --------------------------------------------------------

--
-- Table structure for table `gioi_thieu`
--

CREATE TABLE `gioi_thieu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tieu_de` varchar(255) NOT NULL,
  `duong_dan_gt` varchar(255) NOT NULL,
  `tom_tat` text DEFAULT NULL,
  `noi_dung` longtext NOT NULL,
  `su_manh` text DEFAULT NULL,
  `tam_nhin` text DEFAULT NULL,
  `gia_tri_cot_loi` text DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `trang_thai` enum('hien_thi','an') DEFAULT 'hien_thi',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gioi_thieu`
--

INSERT INTO `gioi_thieu` (`id`, `tieu_de`, `duong_dan_gt`, `tom_tat`, `noi_dung`, `su_manh`, `tam_nhin`, `gia_tri_cot_loi`, `anh_dai_dien`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Về Chúng Tôi - Clean Food Shop', 'gioi-thieu', 'Clean Food Shop là hệ thống cung cấp thực phẩm sạch, đạt chuẩn VietGAP & Organic, mang đến bữa ăn an toàn cho gia đình Việt.', '<p>Được thành lập với mục tiêu mang nông sản sạch từ trang trại tới tận tay người tiêu dùng, Clean Food Shop cam kết chỉ cung cấp các sản phẩm có nguồn gốc xuất xứ rõ ràng.</p><p>Hệ thống bảo quản lạnh tiên tiến giúp giữ trọn vẹn dưỡng chất tươi ngon của từng sản phẩm khi giao đến tay khách hàng.</p>', 'Cung cấp nguồn thực phẩm an toàn, chất lượng cao, góp phần bảo vệ sức khỏe cộng đồng.', 'Trở thành thương hiệu bán lẻ thực phẩm sạch uy tín và được tin tưởng hàng đầu.', 'Tận tâm - Chất lượng - Minh bạch - Uy tín', 'uploads/about/gioi-thieu-cua-hang.jpg', 'hien_thi', '2026-09-14 09:09:42', '2026-09-14 09:09:42');

-- --------------------------------------------------------

--
-- Table structure for table `gio_hang`
--

CREATE TABLE `gio_hang` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nguoi_dung_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gio_hang`
--

INSERT INTO `gio_hang` (`id`, `nguoi_dung_id`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 1, '2026-09-14 08:59:28', '2026-09-14 08:59:28'),
(2, 2, '2026-09-14 08:59:28', '2026-09-14 08:59:28');

-- --------------------------------------------------------

--
-- Table structure for table `lien_he`
--

CREATE TABLE `lien_he` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `tieu_de` varchar(255) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `trang_thai` enum('chua_xuly','da_xuly') DEFAULT 'chua_xuly',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lien_he`
--

INSERT INTO `lien_he` (`id`, `ho_ten`, `email`, `so_dien_thoai`, `tieu_de`, `noi_dung`, `trang_thai`, `ngay_tao`) VALUES
(1, 'Trần Văn An', 'an.tran@gmail.com', '0912345678', 'Tư vấn mua thịt bò hữu cơ', 'Cho mình hỏi thịt bò nhập khẩu bên shop có giấy chứng nhận VietGAP hay Organic không ạ?', 'chua_xuly', '2026-09-14 09:06:55'),
(2, 'Lê Thị Mai', 'mai.le90@gmail.com', '0987654321', 'Thắc mắc thời gian giao hàng', 'Tôi vừa đặt đơn hàng rau củ lúc 9h sáng, khoảng mấy giờ thì giao đến Thủ Đức vậy shop?', 'da_xuly', '2026-09-14 09:06:55'),
(3, 'Phạm Quốc Cường', 'cuong.pham@yahoo.com', '0903112233', 'Góp ý chất lượng đóng gói', 'Hôm qua mình nhận được dưa lưới rất ngon, nhưng thùng carton bị móp nhẹ, shop chú ý khâu vận chuyển nhé.', 'da_xuly', '2026-09-14 09:06:55');

-- --------------------------------------------------------

--
-- Table structure for table `san_pham`
--

CREATE TABLE `san_pham` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `danh_muc_id` bigint(20) UNSIGNED NOT NULL,
  `thuong_hieu_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ten_san_pham` varchar(255) NOT NULL,
  `duong_dan_sp` varchar(255) NOT NULL,
  `hinh_anh` varchar(255) DEFAULT NULL,
  `gia_ban` decimal(12,2) NOT NULL,
  `gia_giam` decimal(12,2) DEFAULT 0.00,
  `so_luong_ton_kho` int(11) NOT NULL DEFAULT 0,
  `don_vi_tinh` varchar(50) DEFAULT 'Kg',
  `mo_ta_ngan` text DEFAULT NULL,
  `chi_tiet` longtext DEFAULT NULL,
  `trang_thai` enum('hien_thi','an') DEFAULT 'hien_thi',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan_nguoi_dung`
--

CREATE TABLE `tai_khoan_nguoi_dung` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `anh_dai_dien` varchar(255) DEFAULT NULL,
  `trang_thai` enum('hoat_dong','khoa') DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tai_khoan_nguoi_dung`
--

INSERT INTO `tai_khoan_nguoi_dung` (`id`, `ho_ten`, `email`, `mat_khau`, `so_dien_thoai`, `dia_chi`, `anh_dai_dien`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Nguyễn Anh Hiếu', 'hieu.nguyen@example.com', '$2y$10$e8T72xX3S...', '0901234567', 'TP. Thủ Đức, TP.HCM', NULL, 'hoat_dong', '2026-09-14 08:56:05', '2026-09-14 08:56:05'),
(2, 'Dương Sĩ Vinh', 'vinh.duong@example.com', '$2y$10$e8T72xX3S...', '0908765432', 'Quận 9, TP.HCM', NULL, 'hoat_dong', '2026-09-14 08:56:05', '2026-09-14 08:56:05');

-- --------------------------------------------------------

--
-- Table structure for table `tai_khoan_quan_tri`
--

CREATE TABLE `tai_khoan_quan_tri` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mat_khau` varchar(255) NOT NULL,
  `vai_tro` enum('super_admin','admin','bien_tap_vien') DEFAULT 'admin',
  `trang_thai` enum('hoat_dong','khoa') DEFAULT 'hoat_dong',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tai_khoan_quan_tri`
--

INSERT INTO `tai_khoan_quan_tri` (`id`, `ho_ten`, `email`, `mat_khau`, `vai_tro`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'Quản trị viên hệ thống', 'admin@cleanfood.com', '$2y$10$e8T72xX3S...', 'super_admin', 'hoat_dong', '2026-09-14 09:12:00', '2026-09-14 09:12:00');

-- --------------------------------------------------------

--
-- Table structure for table `thuong_hieu`
--

CREATE TABLE `thuong_hieu` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ten_thuong_hieu` varchar(255) NOT NULL,
  `duong_dan_th` varchar(255) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `mo_ta` text DEFAULT NULL,
  `trang_thai` enum('hien_thi','an') DEFAULT 'hien_thi',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`id`, `ten_thuong_hieu`, `duong_dan_th`, `logo`, `mo_ta`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'DaLat Farm', 'dalat-farm', 'uploads/brands/dalatfarm.png', NULL, 'hien_thi', '2026-09-14 09:17:23', '2026-09-14 09:17:23'),
(2, 'VinEco', 'vineco', 'uploads/brands/vineco.png', NULL, 'hien_thi', '2026-09-14 09:17:23', '2026-09-14 09:17:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_bv` (`duong_dan_bv`),
  ADD KEY `chu_de_id` (`chu_de_id`);

--
-- Indexes for table `chu_de_bai_viet`
--
ALTER TABLE `chu_de_bai_viet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_bv` (`duong_dan_bv`);

--
-- Indexes for table `danh_muc`
--
ALTER TABLE `danh_muc`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_dm` (`duong_dan_dm`);

--
-- Indexes for table `gioi_thieu`
--
ALTER TABLE `gioi_thieu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_gt` (`duong_dan_gt`);

--
-- Indexes for table `gio_hang`
--
ALTER TABLE `gio_hang`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_sp` (`duong_dan_sp`),
  ADD KEY `danh_muc_id` (`danh_muc_id`),
  ADD KEY `thuong_hieu_id` (`thuong_hieu_id`);

--
-- Indexes for table `tai_khoan_nguoi_dung`
--
ALTER TABLE `tai_khoan_nguoi_dung`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tai_khoan_quan_tri`
--
ALTER TABLE `tai_khoan_quan_tri`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_th` (`duong_dan_th`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bai_viet`
--
ALTER TABLE `bai_viet`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chu_de_bai_viet`
--
ALTER TABLE `chu_de_bai_viet`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `danh_muc`
--
ALTER TABLE `danh_muc`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `gioi_thieu`
--
ALTER TABLE `gioi_thieu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `gio_hang`
--
ALTER TABLE `gio_hang`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tai_khoan_nguoi_dung`
--
ALTER TABLE `tai_khoan_nguoi_dung`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tai_khoan_quan_tri`
--
ALTER TABLE `tai_khoan_quan_tri`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `thuong_hieu`
--
ALTER TABLE `thuong_hieu`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bai_viet`
--
ALTER TABLE `bai_viet`
  ADD CONSTRAINT `bai_viet_ibfk_1` FOREIGN KEY (`chu_de_id`) REFERENCES `chu_de_bai_viet` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`danh_muc_id`) REFERENCES `danh_muc` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `san_pham_ibfk_2` FOREIGN KEY (`thuong_hieu_id`) REFERENCES `thuong_hieu` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
