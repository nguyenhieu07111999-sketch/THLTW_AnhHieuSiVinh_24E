-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2026 at 09:00 AM
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
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_09_21_083124_create_personal_access_tokens_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `san_pham`
--

INSERT INTO `san_pham` (`id`, `danh_muc_id`, `thuong_hieu_id`, `ten_san_pham`, `duong_dan_sp`, `hinh_anh`, `gia_ban`, `gia_giam`, `so_luong_ton_kho`, `don_vi_tinh`, `mo_ta_ngan`, `chi_tiet`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(3, 1, 1, 'Cà Rốt Hữu Cơ DaLat Farm Loại 1 (500g)', 'ca-rot-huu-co-dalat-farm-loai-1-500g-3', 'uploads/products/ca-rot-dalatfarm.jpg', 30000.00, 27000.00, 50, 'Túi', 'Cà rốt trồng theo phương pháp hữu cơ tại DaLat Farm, giòn ngọt tự nhiên.', '<p>Cà rốt hữu cơ DaLat Farm giàu Vitamin A, củ giòn ngọt, không sử dụng thuốc bảo vệ thực vật hay phân bón hóa học.</p>', 'hien_thi', '2026-09-28 06:03:34', '2026-09-27 23:25:06', NULL),
(4, 1, 1, 'Cà Chùa Cherry DaLat Farm (250g)', 'ca-chua-cherry-dalat-farm-250g', 'uploads/products/ca-chua-cherry.jpg', 35000.00, 32000.00, 30, 'Hộp', 'Cà chua cherry mọng nước, vị ngọt thanh tự nhiên.', '<p>Cà chua cherry DaLat Farm chứa nhiều chất chống oxy hóa, thích hợp ăn sống hoặc làm salad.</p>', 'hien_thi', '2026-09-28 06:03:34', '2026-09-28 06:03:34', NULL),
(5, 1, 2, 'Rau Cải Thảo VinEco (1kg)', 'rau-cai-thao-vineco-1kg', 'uploads/products/cai-thao-vineco.jpg', 32000.00, 30000.00, 40, 'Kg', 'Rau cải thảo sạch canh tác công nghệ cao VinEco.', '<p>Cải thảo VinEco được canh tác trong nhà kính hiện đại, đảm bảo an toàn vệ sinh thực phẩm.</p>', 'hien_thi', '2026-09-28 06:03:34', '2026-09-28 06:03:34', NULL),
(6, 1, 2, 'Xà Lách Lô Tô Green VinEco (250g)', 'xa-lach-lo-to-green-vineco-250g', 'uploads/products/xa-lach-vineco.jpg', 22000.00, 19000.00, 25, 'Gói', 'Xà lách tươi xốp, giòn ngọt, chuyên dùng ăn kèm hoặc làm salad.', '<p>Xà lách VinEco sản xuất theo tiêu chuẩn VietGAP, an toàn cho sức khỏe gia đình.</p>', 'hien_thi', '2026-09-28 06:03:34', '2026-09-28 06:03:34', NULL),
(8, 1, 1, 'Cà Cua Bắp Cải Hữu Cơ (1kg)', 'ca-cua-bap-cai-huu-co-1kg-1790576232', NULL, 45000.00, 40000.00, 100, 'Kg', 'Bắp cải sạch tươi ngon', '<p>Bắp cải hữu cơ được trồng theo tiêu chuẩn VietGAP, lá cuộn chặt, giòn ngọt và không chứa tồn dư thuốc bảo vệ thực vật.</p>', 'hien_thi', '2026-09-27 23:17:12', '2026-09-27 23:36:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
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
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ngay_xoa` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`id`, `ten_thuong_hieu`, `duong_dan_th`, `logo`, `mo_ta`, `trang_thai`, `ngay_tao`, `ngay_cap_nhat`, `ngay_xoa`) VALUES
(1, 'DaLat Farm', 'dalat-farm', 'uploads/brands/dalatfarm.png', NULL, 'hien_thi', '2026-09-14 09:17:23', '2026-09-14 09:17:23', NULL),
(2, 'VinEco', 'vineco', 'uploads/brands/vineco.png', NULL, 'hien_thi', '2026-09-14 09:17:23', '2026-09-14 09:17:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

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
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

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
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lien_he`
--
ALTER TABLE `lien_he`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `san_pham`
--
ALTER TABLE `san_pham`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `duong_dan_sp` (`duong_dan_sp`),
  ADD KEY `danh_muc_id` (`danh_muc_id`),
  ADD KEY `thuong_hieu_id` (`thuong_hieu_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

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
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `lien_he`
--
ALTER TABLE `lien_he`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `san_pham`
--
ALTER TABLE `san_pham`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
