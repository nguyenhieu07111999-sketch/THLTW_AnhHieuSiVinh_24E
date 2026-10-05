<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DanhMuc;
use Illuminate\Support\Facades\DB;

class DanhMucSeeder extends Seeder
{
    public function run(): void
    {
        // Xoá dữ liệu cũ nếu muốn hoặc bổ sung 20 danh mục mẫu
        $categories = [
            // CẤP 1: RAU CỦ TƯƠI SẠCH
            [
                'ten_danh_muc' => 'Rau Củ Tươi Sạch',
                'duong_dan_dm' => 'rau-cu-tuoi-sach',
                'hinh_anh'     => 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
                'mo_ta'        => 'Các loại rau củ tươi sạch canh tác chuẩn VietGAP',
                'sp_noi_bat'    => true,
                'parent_id'    => null,
                'children'     => [
                    [
                        'ten_danh_muc' => 'Rau Ăn Lá',
                        'duong_dan_dm' => 'rau-an-la',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
                        'mo_ta'        => 'Xà lách, cải thạch, rau muống, mồng tơi...',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Củ Quả Tươi',
                        'duong_dan_dm' => 'cu-qua-tuoi',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?w=400',
                        'mo_ta'        => 'Cà rốt, khoai tây, cà chua, củ cải...',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Nấm Tươi Sạch',
                        'duong_dan_dm' => 'nam-tuoi-sach',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
                        'mo_ta'        => 'Nấm kim針, nấm đùi gà, nấm rơm...',
                        'sp_noi_bat'    => false,
                    ],
                    [
                        'ten_danh_muc' => 'Rau Gia Vị',
                        'duong_dan_dm' => 'rau-gia-vi',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400',
                        'mo_ta'        => 'Hành, tỏi, ớt, rau thơm các loại',
                        'sp_noi_bat'    => false,
                    ]
                ]
            ],

            // CẤP 1: TRÁI CÂY TƯƠI NGON
            [
                'ten_danh_muc' => 'Trái Cây Tươi Ngon',
                'duong_dan_dm' => 'trai-cay-tuoi-ngon',
                'hinh_anh'     => 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
                'mo_ta'        => 'Trái cây ngọt mát nội địa và nhập khẩu',
                'sp_noi_bat'    => true,
                'parent_id'    => null,
                'children'     => [
                    [
                        'ten_danh_muc' => 'Trái Cây Nội Địa',
                        'duong_dan_dm' => 'trai-cay-noi-dia',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400',
                        'mo_ta'        => 'Cam, xoài, thanh long, vú sữa, sầu riêng',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Trái Cây Nhập Khẩu',
                        'duong_dan_dm' => 'trai-cay-nhap-khau',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1560155016-bd4879ae8f21?w=400',
                        'mo_ta'        => 'Táo Envy, Nho mẫu đơn, Kiwi, Cherry...',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Trái Cây Sấy Khô',
                        'duong_dan_dm' => 'trai-cay-say-kho',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?w=400',
                        'mo_ta'        => 'Mít sấy, chuối sấy, nho khô...',
                        'sp_noi_bat'    => false,
                    ]
                ]
            ],

            // CẤP 1: THỰC PHẨM TƯƠI SỐNG
            [
                'ten_danh_muc' => 'Thực Phẩm Tươi Sống',
                'duong_dan_dm' => 'thuc-pham-tuoi-song',
                'hinh_anh'     => 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
                'mo_ta'        => 'Thịt heo, thịt bò, gia cầm và hải sản tươi sống',
                'sp_noi_bat'    => true,
                'parent_id'    => null,
                'children'     => [
                    [
                        'ten_danh_muc' => 'Thịt Heo Tươi Sạch',
                        'duong_dan_dm' => 'thit-heo-tuoi-sach',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
                        'mo_ta'        => 'Ba rọi, sườn non, thịt nạc vai heo sạch',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Thịt Bò Nhập Khẩu',
                        'duong_dan_dm' => 'thit-bo-nhap-khau',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1588347818036-558601350947?w=400',
                        'mo_ta'        => 'Ba chỉ bò Mỹ, thăn bò Úc, bắp bò...',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Gà & Gia Cầm',
                        'duong_dan_dm' => 'ga-gia-cam',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400',
                        'mo_ta'        => 'Gà ta thả vườn, cánh gà, đùi gà...',
                        'sp_noi_bat'    => false,
                    ],
                    [
                        'ten_danh_muc' => 'Hải Sản Tươi Sống',
                        'duong_dan_dm' => 'hai-san-tuoi-song',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
                        'mo_ta'        => 'Tôm sú, cá hồi, mực lá, cua biển...',
                        'sp_noi_bat'    => true,
                    ]
                ]
            ],

            // CẤP 1: THỰC PHẨM CHẾ BIẾN
            [
                'ten_danh_muc' => 'Thực Phẩm Chế Biến',
                'duong_dan_dm' => 'thuc-pham-che-bien',
                'hinh_anh'     => 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
                'mo_ta'        => 'Đồ ăn chế biến sẵn tiện lợi an toàn',
                'sp_noi_bat'    => false,
                'parent_id'    => null,
                'children'     => [
                    [
                        'ten_danh_muc' => 'Giò Chả & Dăm Bông',
                        'duong_dan_dm' => 'gio-cha-dam-bong',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
                        'mo_ta'        => 'Giò lụa, chả bò, dăm bông cao cấp',
                        'sp_noi_bat'    => false,
                    ],
                    [
                        'ten_danh_muc' => 'Đồ Hộp & Đóng Gói',
                        'duong_dan_dm' => 'do-hop-dong-goi',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400',
                        'mo_ta'        => 'Cá hộp, pate, xúc xích ăn liền',
                        'sp_noi_bat'    => false,
                    ]
                ]
            ],

            // CẤP 1: TRỨNG & SỮA TƯƠI
            [
                'ten_danh_muc' => 'Trứng & Sữa Tươi',
                'duong_dan_dm' => 'trung-va-sua-tuoi',
                'hinh_anh'     => 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
                'mo_ta'        => 'Trứng sạch, sữa tươi tiệt trùng và phô mai',
                'sp_noi_bat'    => true,
                'parent_id'    => null,
                'children'     => [
                    [
                        'ten_danh_muc' => 'Trứng Gà & Trứng Vịt',
                        'duong_dan_dm' => 'trung-ga-trung-vit',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
                        'mo_ta'        => 'Trứng gà omega 3, trứng vịt lộn, trứng cút',
                        'sp_noi_bat'    => true,
                    ],
                    [
                        'ten_danh_muc' => 'Sữa Tươi & Phô Mai',
                        'duong_dan_dm' => 'sua-tuoi-pho-mai',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400',
                        'mo_ta'        => 'Sữa tươi thanh trùng, phô mai lát, bơ',
                        'sp_noi_bat'    => false,
                    ]
                ]
            ],

            // CẤP 1: ĐỒ UỐNG & NƯỚC ÉP
            [
                'ten_danh_muc' => 'Đồ Uống & Nước Ép',
                'duong_dan_dm' => 'do-uong-nuoc-ep',
                'hinh_anh'     => 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
                'mo_ta'        => 'Nước ép trái cây tươi, trà giải nhiệt',
                'sp_noi_bat'    => false,
                'parent_id'    => null,
                'children'     => [
                    [
                        'ten_danh_muc' => 'Nước Ép Trái Cây',
                        'duong_dan_dm' => 'nuoc-ep-trai-cay',
                        'hinh_anh'     => 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
                        'mo_ta'        => 'Nước cam, nước ép táo, sinh tố nguyên chất',
                        'sp_noi_bat'    => true,
                    ]
                ]
            ],
        ];

        foreach ($categories as $parentData) {
            $children = $parentData['children'] ?? [];
            unset($parentData['children']);

            // Kiểm tra trùng theo duong_dan_dm
            $parent = DanhMuc::updateOrCreate(
                ['duong_dan_dm' => $parentData['duong_dan_dm']],
                $parentData
            );

            foreach ($children as $childData) {
                $childData['parent_id'] = $parent->id;
                DanhMuc::updateOrCreate(
                    ['duong_dan_dm' => $childData['duong_dan_dm']],
                    $childData
                );
            }
        }

        echo "Đã thêm thành công 20 danh mục mẫu!\n";
    }
}
