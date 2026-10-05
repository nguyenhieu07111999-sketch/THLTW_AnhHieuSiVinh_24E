<?php

namespace Database\Seeders;

use App\Models\DanhMuc;
use App\Models\SanPham;
use App\Models\ThuongHieu;
use Illuminate\Database\Seeder;
use RuntimeException;

class SanPhamDemoSeeder extends Seeder
{
    public function run(): void
    {
        $danhMucTheoSlug = DanhMuc::query()
            ->whereNotNull('duong_dan_dm')
            ->get()
            ->keyBy('duong_dan_dm');
        $thuongHieuIds = ThuongHieu::query()->pluck('id')->all();

        $sanPhams = [
            ['trai-cay-noi-dia', 'Chuối cau chín tự nhiên (1kg)', 'chuoi-cau-chin-tu-nhien-1kg', 28000, 0, 80, 'Kg', 'Chuối cau ngọt thơm, chín tự nhiên, thích hợp dùng hằng ngày.', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600', 1],
            ['trai-cay-noi-dia', 'Xoài cát Hòa Lộc (1kg)', 'xoai-cat-hoa-loc-1kg', 69000, 62000, 35, 'Kg', 'Xoài cát Hòa Lộc chín vàng, thơm ngọt và ít xơ.', 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600', 1],
            ['trai-cay-noi-dia', 'Thanh long ruột đỏ (1kg)', 'thanh-long-ruot-do-1kg', 42000, 0, 42, 'Kg', 'Thanh long ruột đỏ tươi ngon, vị ngọt thanh.', 'https://images.unsplash.com/photo-1527325678964-54921661f888?w=600', 2],
            ['trai-cay-nhap-khau', 'Táo Fuji nhập khẩu (1kg)', 'tao-fuji-nhap-khau-1kg', 89000, 79000, 28, 'Kg', 'Táo Fuji giòn ngọt, được tuyển chọn và bảo quản lạnh.', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600', 2],
            ['trai-cay-nhap-khau', 'Nho đen không hạt (500g)', 'nho-den-khong-hat-500g', 105000, 0, 20, 'Hộp', 'Nho đen không hạt mọng nước, tiện dùng làm món ăn nhẹ.', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600', 1],
            ['trai-cay-say-kho', 'Mít sấy giòn (250g)', 'mit-say-gion-250g', 58000, 52000, 25, 'Gói', 'Mít sấy giòn thơm, đóng gói tiện lợi.', 'https://images.unsplash.com/photo-1605027990121-3b9b9a5d7e8a?w=600', 1],
            ['rau-cu-huu-co2', 'Cà rốt hữu cơ (500g)', 'ca-rot-huu-co-500g', 24000, 0, 50, 'Túi', 'Cà rốt hữu cơ tươi, phù hợp nấu canh và ép nước.', 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=600', 2],
            ['rau-cu-huu-co2', 'Bông cải xanh hữu cơ (500g)', 'bong-cai-xanh-huu-co-500g', 39000, 35000, 32, 'Bông', 'Bông cải xanh giòn ngọt, giàu chất xơ.', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600', 1],
            ['rau-cu-huu-co2', 'Cải bó xôi tươi (300g)', 'cai-bo-xoi-tuoi-300g', 26000, 0, 30, 'Gói', 'Cải bó xôi tươi xanh, thích hợp nấu canh hoặc xào.', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600', 2],
            ['rau-cu-huu-co2', 'Khoai lang mật (1kg)', 'khoai-lang-mat-1kg', 32000, 0, 45, 'Kg', 'Khoai lang mật dẻo ngọt, ngon khi hấp hoặc nướng.', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600', 1],
            ['thit-heo-tuoi-sach', 'Thịt ba chỉ heo sạch (500g)', 'thit-ba-chi-heo-sach-500g', 89000, 0, 18, 'Khay', 'Thịt ba chỉ tươi, có tỷ lệ nạc mỡ hài hòa.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600', 1],
            ['thit-heo-tuoi-sach', 'Sườn non heo (500g)', 'suon-non-heo-500g', 98000, 92000, 16, 'Khay', 'Sườn non tươi, phù hợp nấu canh và rim.', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 2],
            ['thit-bo-nhap-khau', 'Thăn bò Úc (500g)', 'than-bo-uc-500g', 185000, 169000, 12, 'Khay', 'Thăn bò mềm, thích hợp áp chảo hoặc nướng.', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600', 1],
            ['thit-bo-nhap-khau', 'Bò viên sạch (300g)', 'bo-vien-sach-300g', 72000, 0, 20, 'Gói', 'Bò viên dai ngon, tiện chế biến món nước.', 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600', 2],
            ['ga-gia-cam', 'Ức gà phi lê (500g)', 'uc-ga-phi-le-500g', 65000, 59000, 24, 'Khay', 'Ức gà phi lê tươi, phù hợp chế độ ăn lành mạnh.', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600', 1],
            ['ga-gia-cam', 'Trứng gà ta (10 quả)', 'trung-ga-ta-10-qua', 38000, 0, 40, 'Hộp', 'Trứng gà ta tuyển chọn, đóng hộp 10 quả.', 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600', 2],
            ['hai-san-tuoi-song', 'Tôm thẻ tươi (500g)', 'tom-the-tuoi-500g', 135000, 125000, 14, 'Khay', 'Tôm thẻ tươi được sơ chế và đóng khay.', 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600', 1],
            ['hai-san-tuoi-song', 'Cá hồi phi lê (300g)', 'ca-hoi-phi-le-300g', 168000, 0, 10, 'Khay', 'Cá hồi phi lê tươi, thích hợp áp chảo hoặc làm sashimi.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600', 2],
            ['do-hop-dong-goi', 'Bắp ngọt đóng hộp (340g)', 'bap-ngot-dong-hop-340g', 29000, 0, 30, 'Hộp', 'Bắp ngọt đóng hộp tiện lợi cho các món salad và súp.', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600', 1],
            ['do-uong-nuoc-ep', 'Nước ép cam nguyên chất (1L)', 'nuoc-ep-cam-nguyen-chat-1l', 52000, 48000, 22, 'Chai', 'Nước ép cam vị tươi mát, dùng ngon khi bảo quản lạnh.', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600', 2],
        ];

        foreach ($sanPhams as [$slugDanhMuc, $ten, $slug, $gia, $giaGiam, $tonKho, $donVi, $moTa, $hinhAnh, $thuongHieuIndex]) {
            $danhMuc = $danhMucTheoSlug->get($slugDanhMuc);
            if (!$danhMuc) {
                throw new RuntimeException("Không tìm thấy danh mục có slug '{$slugDanhMuc}' để nhập sản phẩm.");
            }

            $thuongHieuId = $thuongHieuIds[$thuongHieuIndex - 1] ?? null;

            SanPham::firstOrCreate(
                ['duong_dan_sp' => $slug],
                [
                    'danh_muc_id' => $danhMuc->id,
                    'thuong_hieu_id' => $thuongHieuId,
                    'ten_san_pham' => $ten,
                    'hinh_anh' => $hinhAnh,
                    'gia_ban' => $gia,
                    'gia_giam' => $giaGiam,
                    'so_luong_ton_kho' => $tonKho,
                    'don_vi_tinh' => $donVi,
                    'mo_ta_ngan' => $moTa,
                    'chi_tiet' => $moTa,
                    'trang_thai' => 'hien_thi',
                ]
            );
        }
    }
}
