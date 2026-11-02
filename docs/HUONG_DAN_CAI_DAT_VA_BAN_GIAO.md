# TÀI LIỆU HƯỚNG DẪN CÀI ĐẶT, VẬN HÀNH & BÀN GIAO PHẦN MỀM
**Dự án**: Website Thương Mại Điện Tử Nông Sản Tươi  
**Kiến trúc**: Decoupled (Backend Laravel 12 API + Frontend Next.js 16)  
**Dành cho**: Khách hàng / Quản trị viên / Đội ngũ kỹ thuật tiếp nhận bàn giao

---

## MỤC LỤC
1. [Yêu cầu cấu hình máy chủ & môi trường](#1-yêu-cầu-cấu-hình-máy-chủ--môi-trường)
2. [Cấu trúc mã nguồn bàn giao](#2-cấu-trúc-mã-nguồn-bàn-giao)
3. [Hướng dẫn cài đặt Backend (Laravel 12 API)](#3-hướng-dẫn-cài-đặt-backend-laravel-12-api)
4. [Hướng dẫn cài đặt Frontend (Next.js 16)](#4-hướng-dẫn-cài-đặt-frontend-nextjs-16)
5. [HƯỚNG DẪN CÀI ĐẶT CHỨC NĂNG GỬI MÃ OTP VỀ GMAIL (CHI TIẾT)](#5-hướng-dẫn-cài-đặt-chức-năng-gửi-mã-otp-về-gmail)
6. [HƯỚNG DẪN CÀI ĐẶT CỔNG THANH TOÁN VNPAY (CHI TIẾT)](#6-hướng-dẫn-cài-đặt-cổng-thanh-toán-vnpay)
7. [Tài khoản quản trị & Luồng kiểm thử sau cài đặt](#7-tài-khoản-quản-trị--luồng-kiểm-thử-sau-cài-đặt)
8. [Các lưu ý quan trọng khi triển khai lên Hosting/VPS Production](#8-các-lưu-ý-quan-trọng-khi-triển-khai-production)

---
# note: Tài khoản 
# admin: 
   admin@gmail.com
   123
# user:(có thể sửa pwd các tài khoản có sẵn ở DB hoặc dùng tài khoản mật khẩu bên dưới)
   1. nguyenvanc@gmail.com
      123456
   2. nguyenhieu07121999@gmail.com
      123456

## 1. YÊU CẦU CẤU HÌNH MÁY CHỦ & MÔI TRƯỜNG

Để ứng dụng vận hành trơn tru và tương thích 100%, máy chủ (hoặc máy cá nhân Localhost) cần cài đặt sẵn các công cụ sau:

| Công cụ / Phần mềm | Phiên bản tối thiểu | Khuyến nghị | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Hệ điều hành** | Windows 10/11, Ubuntu 20.04+, macOS | Ubuntu 22.04 LTS (VPS) | |
| **PHP** | **>= 8.2** | PHP 8.2 hoặc 8.3 | Bắt buộc bật extensions: `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `gd` |
| **Composer** | >= 2.2 | Composer 2.7+ | Quản lý gói thư viện PHP |
| **Node.js & npm** | **>= 18.18** hoặc **>= 20.9** | Node.js 20 LTS (Active) | Quản lý và build Frontend Next.js |
| **Hệ quản trị CSDL** | MySQL >= 8.0 hoặc MariaDB >= 10.4 | MySQL 8.0 | Bảng mã khuyến nghị `utf8mb4_unicode_ci` |
| **Web Server Local** | Laragon / XAMPP / Docker | Laragon (trên Windows) | Khuyên dùng Laragon vì dễ quản lý PHP 8.2+ và MySQL |

---

## 2. CẤU TRÚC MÃ NGUỒN BÀN GIAO

Gói mã nguồn bàn giao gồm 2 thư mục chính:

```text
THLTW_AnhHieuSiVinh_24E/
├── backend/                  # Thư mục mã nguồn Backend (Laravel 12 RESTful API)
│   ├── app/                  # Controllers, Models, Requests, Resources, Mailables
│   ├── config/               # Cấu hình hệ thống (mail.php, services.php, cors.php)
│   ├── routes/api.php        # Danh sách API Endpoints
│   ├── .env                  # Tệp cấu hình môi trường Backend (DB, Mail, VNPay)
│   └── composer.json         # Danh sách thư viện PHP
├── frontend/                 # Thư mục mã nguồn Frontend (Next.js 16 App Router)
│   ├── src/app/              # Các trang giao diện (Client & Admin)
│   ├── src/components/       # Các khối giao diện dùng chung (Modal, Card, Table)
│   ├── src/services/         # Tầng gọi API Backend (api.js, dich-vu-*.js)
│   ├── .env.local            # Tệp cấu hình biến môi trường Frontend
│   └── package.json          # Danh sách thư viện JavaScript / Next.js
└── database.sql              # Tệp sao lưu CSDL hoàn chỉnh có sẵn dữ liệu mẫu
```

---

## 3. HƯỚNG DẪN CÀI ĐẶT BACKEND (LARAVEL 12 API)

### Bước 3.1: Mở Terminal tại thư mục Backend
Mở Command Prompt / PowerShell / Terminal tại đường dẫn thư mục `backend`:
```bash
cd backend
```

### Bước 3.2: Cài đặt các gói phụ thuộc PHP (Vendor)
Chạy lệnh composer để tải thư viện:
```bash
composer install
```

### Bước 3.3: Thiết lập tệp cấu hình môi trường (.env)
Nếu chưa có tệp `.env`, copy từ tệp `.env.example`:
```bash
cp .env.example .env     # (Linux/macOS)
copy .env.example .env   # (Windows)
```

Tạo khóa bí mật của ứng dụng:
```bash
php artisan key:generate
```

### Bước 3.4: Cấu hình kết nối Cơ sở dữ liệu
Mở tệp `backend/.env` và cập nhật thông số kết nối MySQL của bạn:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=thltw_anhhieusivinh_24e
DB_USERNAME=root
DB_PASSWORD=
```

### Bước 3.5: Nạp dữ liệu vào Database
* **Cách 1 (Khuyên dùng)**: Mở **phpMyAdmin** (hoặc Navicat/DBeaver), tạo một CSDL mới tên `thltw_anhhieusivinh_24e`, sau đó bấm **Import** và chọn tệp `database.sql` đi kèm trong gói bàn giao.
* **Cách 2**: Chạy migration và seed mặc định:
  ```bash
  php artisan migrate --seed
  ```

### Bước 3.6: Tạo liên kết thư mục ảnh (Storage Link)
Chức năng này bắt buộc để xem được hình ảnh sản phẩm, bài viết và avatar:
```bash
php artisan storage:link
```

### Bước 3.7: Khởi động máy chủ Backend
```bash
php artisan serve --port=8000
```
Backend sẽ khởi chạy tại: `http://127.0.0.1:8000`.  
Bạn có thể kiểm tra nhanh bằng cách truy cập: `http://127.0.0.1:8000/api/ping` $\rightarrow$ Trả về `{"message": "API is working!"}` là thành công.

---

## 4. HƯỚNG DẪN CÀI ĐẶT FRONTEND (NEXT.JS 16)

### Bước 4.1: Mở Terminal tại thư mục Frontend
Mở một cửa sổ Terminal mới:
```bash
cd frontend
```

### Bước 4.2: Cài đặt các gói phụ thuộc Node.js
```bash
npm install
```

### Bước 4.3: Cấu hình biến môi trường kết nối Backend
Tạo tệp `.env.local` trong thư mục `frontend/` (nếu chưa có) với nội dung:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```
*(Nếu triển khai máy chủ thật, thay `http://127.0.0.1:8000` thành tên miền/IP của Backend).*

### Bước 4.4: Khởi chạy Frontend
* **Chạy chế độ phát triển (Development)**:
  ```bash
  npm run dev
  ```
  Truy cập website tại: `http://localhost:3000`

* **Chạy chế độ tối ưu Production**:
  ```bash
  npm run build
  npm run start
  ```

---

## 5. HƯỚNG DẪN CÀI ĐẶT CHỨC NĂNG GỬI MÃ OTP VỀ GMAIL

Hệ thống sử dụng giao thức **SMTP của Google** để gửi mã xác thực OTP 6 số tự động về email khách hàng khi thực hiện **Đổi mật khẩu** hoặc các thao tác bảo mật.

> [!IMPORTANT]
> Google **không cho phép** sử dụng mật khẩu đăng nhập Gmail thông thường để gửi mail từ phần mềm. Người mua **bắt buộc phải tạo "Mật khẩu ứng dụng" (App Password)** gồm 16 ký tự.

### Bước 5.1: Các bước tạo Mật khẩu ứng dụng trên tài khoản Google (Gmail)

1. Đăng nhập vào tài khoản Gmail dùng để gửi thư cho cửa hàng.
2. Truy cập vào trang quản lý tài khoản: **[https://myaccount.google.com/security](https://myaccount.google.com/security)** (Tab **Bảo mật** / Security).
3. Tại mục **"Cách bạn đăng nhập vào Google"**, kiểm tra:
   - Tính năng **Xác minh 2 bước (2-Step Verification)** phải được **BẬT**. *(Nếu chưa bật, hãy làm theo hướng dẫn của Google để bật bằng số điện thoại)*.
4. Tìm và nhấp vào mục **Mật khẩu ứng dụng** (App Passwords) hoặc tìm kiếm trực tiếp trên thanh tìm kiếm của Google Account với từ khóa `Mật khẩu ứng dụng`.
5. Đặt tên ứng dụng gợi nhớ (Ví dụ: `NongSanTuoi Mailer`), sau đó nhấn nút **Tạo** (Create).
6. Google sẽ hiển thị một cửa sổ chứa mã gồm **16 chữ cái màu vàng** (Ví dụ: `abcd efgh ijkl mnop`).
7. **Sao chép mã 16 chữ cái này** (Bỏ các khoảng trắng, chỉ lấy chuỗi chữ liền: `abcdefghijklmnop`).

### Bước 5.2: Điền cấu hình vào tệp `backend/.env`
Mở tệp `backend/.env` và cập nhật cụm cấu hình Mail như sau:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=email_cua_ban@gmail.com
MAIL_PASSWORD=abcdefghijklmnop
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="email_cua_ban@gmail.com"
MAIL_FROM_NAME="Nông Sản Tươi"
```

*Giải thích các tham số:*
- `MAIL_MAILER=smtp`: Sử dụng giao thức gửi mail chuẩn SMTP.
- `MAIL_HOST=smtp.gmail.com`: Máy chủ mail của Google.
- `MAIL_PORT=587`: Cổng bảo mật STARTTLS của Google.
- `MAIL_USERNAME`: Địa chỉ Gmail của bạn (tài khoản đã tạo App Password).
- `MAIL_PASSWORD`: **Mã Mật khẩu ứng dụng 16 ký tự** vừa lấy ở Bước 5.1.
- `MAIL_ENCRYPTION=tls`: Mã hóa TLS an toàn.
- `MAIL_FROM_ADDRESS`: Địa chỉ email người gửi hiển thị trong hộp thư đến của khách hàng.
- `MAIL_FROM_NAME`: Tên thương hiệu hiển thị (Ví dụ: "Nông Sản Tươi").

### Bước 5.3: Xóa cache cấu hình Laravel (Bắt buộc)
Mỗi khi sửa tệp `.env`, bạn bắt buộc phải chạy lệnh sau để Laravel nhận cấu hình mới:
```bash
php artisan config:clear
```

### Bước 5.4: Kiểm tra hoạt động thực tế trên giao diện
1. Khởi động cả FE và BE.
2. Đăng nhập một tài khoản khách hàng trên website `http://localhost:3000/dang-nhap`.
3. Vào trang cá nhân $\rightarrow$ Chọn mục **Đổi mật khẩu** (`/tai-khoan/doi-mat-khau`).
4. Nhấn nút **"Gửi mã OTP"**.
5. Mở hộp thư Gmail của tài khoản khách hàng $\rightarrow$ Kiểm tra email có tiêu đề `[Nông Sản Tươi] Mã OTP xác nhận đổi mật khẩu`.
6. Nhập mã OTP 6 số cùng mật khẩu cũ & mới để hoàn tất việc đổi mật khẩu.

### Bước 5.5: Các lỗi thường gặp và cách xử lý
* **Lỗi 535: 5.7.8 Username and Password not accepted**: Do bạn nhập mật khẩu đăng nhập Gmail bình thường, hoặc nhập sai Mật khẩu ứng dụng. Hãy tạo lại App Password mới.
* **Lỗi Connection timeout / Không kết nối được port 587**: Mạng nội bộ hoặc nhà mạng chặn cổng 587. Cách khắc phục: Đổi sang cổng SSL:
  ```env
  MAIL_PORT=465
  MAIL_ENCRYPTION=ssl
  ```
* **Thông báo "Vui lòng chờ 60 giây"**: Đây là tính năng bảo vệ chống spam (Rate-limit) có sẵn trong hệ thống để ngăn người dùng ấn gửi OTP liên tục.

---

## 6. HƯỚNG DẪN CÀI ĐẶT CỔNG THANH TOÁN VNPAY

Hệ thống đã tích hợp sẵn luồng thanh toán VNPay chuẩn quốc gia:
- Tạo URL thanh toán có chữ ký băm bảo mật **HMAC SHA512**.
- Xử lý điều hướng người dùng (Return URL).
- Xử lý Webhook máy chủ sang máy chủ (Instant Payment Notification - **IPN**) tự động xác nhận đơn đã thanh toán.

---

### PHẦN A: CẤU HÌNH MÔI TRƯỜNG THỬ NGHIỆM (SANDBOX TEST)

Để thử nghiệm tính năng thanh toán mà không mất tiền thật:

#### Bước 6.1: Đăng ký tài khoản Sandbox miễn phí
1. Truy cập: **[https://sandbox.vnpayment.vn/devreg/](https://sandbox.vnpayment.vn/devreg/)**
2. Đăng ký thông tin để nhận tài khoản thử nghiệm.
3. VNPay sẽ cung cấp:
   - **Mã định danh website (TMN Code)**.
   - **Khóa bí mật tạo chữ ký (Hash Secret)**.

*(Dự án đã cấu hình sẵn một tài khoản Sandbox để bạn có thể test ngay).*

#### Bước 6.2: Cấu hình trong tệp `backend/.env`
```env
# Cấu hình VNPAY Sandbox
VNPAY_TMN_CODE=CGXZLS0Z
VNPAY_HASH_SECRET=XNBCJFAKAZQSGTARRLGCHVZWCIOIGSHN
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
FRONTEND_URL=http://localhost:3000
```

Chạy lệnh xóa cache:
```bash
php artisan config:clear
```

#### Bước 6.3: Thông tin thẻ ngân hàng thử nghiệm (VNPay Sandbox Card)
Khi tiến hành thanh toán đơn hàng trên website, chọn **"Thanh toán qua VNPAY"**, hệ thống sẽ chuyển hướng bạn sang cổng VNPay. Hãy sử dụng thông tin thẻ test dưới đây:

| Thông tin | Giá trị thẻ test |
| :--- | :--- |
| **Ngân hàng chấp nhận** | **NCB** (hoặc chọn logo Ngân hàng Quốc Dân NCB) |
| **Số thẻ** | `9704198526191432198` |
| **Tên chủ thẻ** | `NGUYEN VAN A` |
| **Ngày phát hành** | `07/15` |
| **Mật khẩu OTP xác nhận** | `123456` |

Sau khi nhập OTP `123456` và nhấn xác nhận:
1. VNPay xử lý giao dịch thành công.
2. Trình duyệt tự động chuyển hướng về: `http://localhost:3000/thanh-toan/ket-qua?thanh_toan=thanh_cong&don_hang=...`
3. Trạng thái thanh toán của đơn hàng trong cơ sở dữ liệu tự động chuyển thành: `da_thanh_toan`.

---

### PHẦN B: CẤU HÌNH KHI ĐƯA VÀO VẬN HÀNH THỰC TẾ (PRODUCTION)

Khi người mua muốn thu tiền thật của khách hàng qua tài khoản ngân hàng doanh nghiệp/hộ kinh doanh:

#### Bước 6.4: Ký hợp đồng với Công ty Cổ phần Giải pháp Thanh toán Việt Nam (VNPAY)
1. Đăng ký mở cổng thanh toán thật tại **[https://vnpay.vn/](https://vnpay.vn/)** hoặc liên hệ hotline VNPAY: `1900 55 55 77`.
2. VNPAY sẽ tiến hành thẩm định website và cấp cho doanh nghiệp:
   - Một mã `VNPAY_TMN_CODE` thật.
   - Một chuỗi `VNPAY_HASH_SECRET` thật.

#### Bước 6.5: Cập nhật biến môi trường Production trong `backend/.env`
```env
# Cấu hình VNPAY Môi trường Thật (Production)
VNPAY_TMN_CODE=<MÃ_DOANH_NGHIỆP_VNPAY_CẤP>
VNPAY_HASH_SECRET=<CHUỖI_BÍ_MẬT_VNPAY_CẤP>
VNPAY_URL=https://pay.vnpay.vn/vpcpay.html
FRONTEND_URL=https://tenmiencuakhach.vn
```

#### Bước 6.6: Đăng ký hai địa chỉ URL với kỹ thuật viên của VNPay
Khi bàn giao cổng thật, nhân viên kỹ thuật của VNPAY sẽ yêu cầu bạn cung cấp 2 đường link:

1. **Return URL (Đường dẫn trả về trình duyệt)**:
   ```text
   https://api.tenmiencuakhach.vn/api/thanh-toan/vnpay/ket-qua
   ```
2. **IPN URL (Webhook Server-to-Server để tự động xác nhận đơn hàng)**:
   ```text
   https://api.tenmiencuakhach.vn/api/thanh-toan/vnpay/ipn
   ```

*Lưu ý quan trọng:*
- Website Production **bắt buộc phải cài chứng chỉ SSL (HTTPS)** thì VNPay mới cấp quyền duyệt thanh toán thật.
- Đường link IPN phải ở trạng thái mở ra ngoài Internet (không bị chặn tường lửa) để máy chủ VNPay có thể gửi tín hiệu xác thực giao dịch về.

---

## 7. TÀI KHOẢN QUẢN TRỊ & LUỒNG KIỂM THỬ SAU CÀI ĐẶT

### 7.1. Cổng quản trị Admin
- **Đường dẫn**: `http://localhost:3000/admin/dang-nhap`
- **Tài khoản mẫu**:
  - Email: `admin@gmail.com`
  - Mật khẩu: `123456`
  - Vai trò: `super_admin`

### 7.2. Các mục quản lý trong trang Admin
1. **Bảng điều khiển (Dashboard)**: Thống kê nhanh.
2. **Quản lý Sản phẩm**: Đăng sản phẩm, chỉnh sửa giá, số lượng tồn kho, đơn vị tính, xem thùng rác, khôi phục.
3. **Quản lý Danh mục**: Thêm/sửa danh mục rau củ, trái cây, bật/tắt hiển thị nổi bật.
4. **Quản lý Thương hiệu**: Quản lý các nhà cung cấp nông sản.
5. **Quản lý Đơn hàng**: Xem chi tiết đơn hàng, cập nhật trạng thái (Chờ xác nhận $\rightarrow$ Đã xác nhận $\rightarrow$ Đang giao $\rightarrow$ Hoàn thành).
6. **Kiểm duyệt Đánh giá**: Bật/tắt hiển thị review của khách, cài đặt bộ lọc từ cấm tự động.
7. **Quản lý Khách hàng**: Tra cứu lịch sử mua sắm của từng khách hàng, khóa/mở khóa tài khoản vi phạm.
8. **Quản lý Menu Đa Cấp**: Kéo thả sắp xếp menu điều hướng Header và Footer.

---

## 8. CÁC LƯU Ý QUAN TRỌNG KHI TRIỂN KHAI PRODUCTION

1. **Chế độ bảo mật Laravel**:
   Trong môi trường chạy thật trên VPS, hãy đổi trong `backend/.env`:
   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```
2. **Cấu hình CORS (`backend/config/cors.php`)**:
   Đảm bảo `allowed_origins` chứa đúng tên miền Frontend của bạn:
   ```php
   'allowed_origins' => ['https://tenmiencuakhach.vn'],
   ```
3. **Quyền ghi thư mục (Permissions trên Linux/Ubuntu)**:
   Nếu triển khai trên máy chủ Linux, cần cấp quyền ghi cho thư mục lưu trữ cache và file upload:
   ```bash
   sudo chown -R www-data:www-data storage bootstrap/cache
   sudo chmod -R 775 storage bootstrap/cache
   ```
4. **Tối ưu hóa tốc độ tải trang**:
   Chạy các lệnh tối ưu hóa của Laravel trước khi bàn giao:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

