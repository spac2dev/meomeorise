# TÀI LIỆU HỆ THỐNG WONTRADE ADMIN CMS & CLOUDFLARE WORKER

Hệ thống quản trị nội dung (CMS) tự động hóa cho sàn giao dịch tài khoản
**WONTRADE** (Rise of Kingdoms), hoạt động theo mô hình **Git-based Serverless
CMS**: Quản lý dữ liệu trực tiếp trên GitHub Repository thông qua Cloudflare
Worker làm cầu nối trung gian (Middleware) mà không cần hệ thống máy chủ cơ sở
dữ liệu truyền thống (Database-free).

---

## MỤC LỤC

1. [Kiến Trúc Hoạt Động (Architecture)](#1-kiến-trúc-hoạt-động-architecture)
2. [Cơ Chế Hoạt Động Của Cloudflare Worker (`worker.js`)](#2-cơ-chế-hoạt-động-của-cloudflare-worker-workerjs)
3. [Chi Tiết Chức Năng Admin Dashboard (`admin/index.html`)](#3-chi-tiết-chức-năng-admin-dashboard-adminindexhtml)
4. [Cấu Trúc Dữ Liệu Sản Phẩm (Product Schema)](#4-cấu-trúc-dữ-liệu-sản-phẩm-product-schema)
5. [Hướng Dẫn Triển Khai & Cài Đặt (Deployment Guide)](#5-hướng-dẫn-triển-khai--cài-đặt-deployment-guide)
6. [Các Biến Môi Trường Cần Thiết (Environment Variables)](#6-các-biến-môi-trường-cần-thiết-environment-variables)
7. [Khắc Phục Sự Cố Thường Gặp (Troubleshooting)](#7-khắc-phục-sự-cố-thường-gặp-troubleshooting)

---

## 1. KIẾN TRÚC HOẠT ĐỘNG (ARCHITECTURE)

```
┌─────────────────────────┐
│   Admin CMS Dashboard   │  (Giao diện web cục bộ hoặc hosting)
│   (admin/index.html)    │  - Thêm, sửa, xóa, nhân bản tài khoản
└───────────┬─────────────┘  - Xem trước giao diện Iframe dọc 9:16
            │
            │ HTTP POST / GET (JSON Payload + X-Admin-Key)
            ▼
┌─────────────────────────┐
│    Cloudflare Worker    │  (Serverless Edge Middleware - worker.js)
│    (API Gateway/Proxy)  │  - Bảo vệ GitHub PAT (Personal Access Token)
└───────────┬─────────────┘  - Xử lý CORS, kiểm tra bảo mật (Secret Key)
            │                - Chuẩn hóa mã hóa UTF-8 sang Base64
            │ GitHub REST API v3 (PUT /contents/js/list.js)
            ▼
┌─────────────────────────┐
│    GitHub Repository    │  (Kho lưu trữ mã nguồn)
│    (Branch: main)       │  - Tự động Commit & Push cập nhật list.js
└───────────┬─────────────┘
            │
            │ Webhook / Auto Deploy Trigger (1 - 3 phút)
            ▼
┌─────────────────────────┐
│ GitHub / Cloudflare     │  (Production Static Site)
│ Pages Deployment        │  - Người dùng truy cập trang chủ thấy dữ liệu mới
└─────────────────────────┘
```

### Tại sao sử dụng mô hình này?

- **An toàn tuyệt đối**: Token GitHub có quyền ghi vào mã nguồn không bao giờ bị
  lộ ra ngoài trình duyệt của người dùng hay Admin CMS. Toàn bộ Token và thông
  tin nhạy cảm được mã hóa an toàn trên Cloudflare Worker Secret.
- **Tiết kiệm chi phí (100% Free Tier)**: Không cần thuê máy chủ VPS, không cần
  cài MySQL hay MongoDB. Cloudflare Workers miễn phí 100.000 requests/ngày.
- **Lưu vết lịch sử (Version Control)**: Mỗi lần bấm "Lưu lên GitHub", hệ thống
  tạo một Git commit rõ ràng, cho phép hoàn tác (revert) hoặc xem lại lịch sử
  thay đổi bất cứ khi nào.

---

## 2. CƠ CHẾ HOẠT ĐỘNG CỦA CLOUDFLARE WORKER (`worker.js`)

File `worker.js` đảm nhận vai trò API Middleware tiếp nhận yêu cầu từ Admin CMS
và gọi GitHub REST API để cập nhật file danh sách dữ liệu.

### 2.1. Xử lý CORS (Cross-Origin Resource Sharing)

- Cung cấp method `OPTIONS` phản hồi HTTP 204 kèm theo các headers:
  - `Access-Control-Allow-Origin: *`
  - `Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Key`
- Giúp Admin CMS có thể gọi API từ bất kỳ tên miền nào hoặc từ localhost mà
  không bị trình duyệt chặn.

### 2.2. Kiểm tra xác thực (Authentication)

- Nếu cấu hình biến môi trường `ADMIN_SECRET` trên Cloudflare:
  - Worker sẽ kiểm tra header `X-Admin-Key` hoặc
    `Authorization: Bearer <token>`.
  - Nếu sai hoặc thiếu: Trả về mã lỗi `401 Unauthorized`.
  - Nếu đúng: Cho phép tiếp tục xử lý.

### 2.3. Luồng xử lý GET Request (Kiểm tra & Nạp dữ liệu)

- **Mục đích**: Kiểm tra trạng thái kết nối tới GitHub repo, hoặc nạp nội dung
  file `list.js` hiện tại trên nhánh chỉ định.
- **Quy trình**:
  1. Gửi request
     `GET https://api.github.com/repos/:owner/:repo/contents/:path?ref=:branch`.
  2. Nếu file chưa tồn tại (HTTP 404): Trả về thông báo sẵn sàng tạo mới.
  3. Nếu file tồn tại: Đọc nội dung Base64, giải mã UTF-8 qua hàm
     `base64ToUtf8()`.
  4. Hỗ trợ query parameter `?format=json` hoặc `?action=products`: Tự động dùng
     Regex trích xuất mảng `mockProducts` thành JSON để frontend tái sử dụng
     trực tiếp.

### 2.4. Luồng xử lý POST Request (Cập nhật dữ liệu lên GitHub)

- **Mục đích**: Ghi đè hoặc cập nhật file `js/list.js` (và `list.js` dự phòng)
  trên GitHub.
- **Quy trình 5 bước**:
  1. **Tiếp nhận & Chuẩn hóa**: Nhận JSON body chứa chuỗi `content` hoặc mảng
     `products`. Nếu là mảng, hàm `generateListJsContent()` sẽ tự động sinh code
     JavaScript định dạng `var mockProducts = [...]`.
  2. **Lấy SHA file hiện tại**: GitHub API bắt buộc phải cung cấp chuỗi SHA của
     file cũ khi cập nhật. Worker gửi request GET lên GitHub để lấy `sha` mới
     nhất.
  3. **Mã hóa UTF-8 sang Base64**: Sử dụng `TextEncoder` và `btoa()` tùy biến để
     hỗ trợ 100% tiếng Việt có dấu, không bị lỗi font hay mất ký tự Unicode.
  4. **Commit lên GitHub**: Gửi request
     `PUT https://api.github.com/repos/:owner/:repo/contents/:path` kèm message,
     content dạng Base64, SHA cũ và nhánh mục tiêu.
  5. **Hỗ trợ cập nhật đồng bộ 2 vị trí (`updateBoth: true`)**: Tự động commit
     cả `js/list.js` và `list.js` ở thư mục gốc để đảm bảo dữ liệu đồng nhất.

---

## 3. CHI TIẾT CHỨC NĂNG ADMIN DASHBOARD (`admin/index.html`)

Giao diện Admin CMS được thiết kế hiện đại, tinh gọn với phong cách tối giản,
tối ưu trải nghiệm người dùng cả trên máy tính để bàn (Desktop) và điện thoại di
động (Mobile).

### 3.1. Thanh công cụ & Cấu hình Worker

- **Worker URL**: Nhập URL Cloudflare Worker của bạn (ví dụ:
  `https://meomeorise.text2developer.workers.dev`). Cấu hình được tự động lưu
  trong `localStorage`.
- **Secret Key**: Khóa bảo vệ tùy chọn để xác thực người quản trị.
- **Kiểm tra kết nối**: Nhấn để test tức thì đường truyền giữa Admin CMS ->
  Worker -> GitHub Repo.

### 3.2. Bảng thống kê dữ liệu (Dashboard Stats)

- **Tổng số vật phẩm**: Số tài khoản hiện có trong danh sách.
- **Giá cao nhất**: Tự động tìm tài khoản có giá trị cao nhất và định dạng VNĐ
  chuẩn (`₫`).
- **Tổng lượt yêu thích**: Tổng hợp số lượt thả tim của khách hàng.
- **Danh mục game**: Mặc định Rise of Kingdoms.

### 3.3. Quản lý danh sách tài khoản

- **Tìm kiếm thông minh**: Tìm kiếm tức thì theo mã ID, tiêu đề, thông tin vương
  quốc hoặc đường dẫn link.
- **Bộ lọc & Sắp xếp**: Sắp xếp theo ID (mới nhất / cũ nhất), Giá bán (cao nhất
  / thấp nhất), Lượt thích nhiều nhất.
- **Thao tác nhanh**:
  - **Thêm mới**: Mở form nhập liệu với các trường được gợi ý tự động (ID tiếp
    theo, link mặc định, danh sách tướng mẫu).
  - **Chỉnh sửa**: Cập nhật toàn bộ thông số của tài khoản.
  - **Nhân bản (Duplicate)**: Sao chép nhanh một tài khoản có sẵn thành ID mới
    để tạo tài khoản tương tự mà không cần nhập lại từ đầu.
  - **Xóa**: Xóa tài khoản khỏi danh sách với hộp thoại xác nhận an toàn.

### 3.4. Trình xem trước Iframe tỉ lệ 9:16 (Vertical Popup Preview)

- Tích hợp khung xem thử mô phỏng màn hình dọc 9:16 trên điện thoại di động.
- Cho phép Admin kiểm tra trực tiếp giao diện hiển thị của trang nạp / thông tin
  chi tiết (`guide/index.html?id=...`) trước khi lưu.
- Hỗ trợ nút thao tác nhanh "Mua ngay" và nút đóng tiện lợi.

### 3.5. Cơ chế lưu trữ & Xuất dự phòng (Backup & Publish)

- **LƯU LÊN GITHUB**: Gửi toàn bộ dữ liệu mới nhất lên Cloudflare Worker để
  commit tự động lên repo. Sau khi lưu thành công, hiển thị Banner thông báo đếm
  lùi thời gian build 1-3 phút.
- **Tải list.js (Offline Backup)**: Xuất file `list.js` tải trực tiếp về máy
  tính dưới dạng file JS để lưu trữ dự phòng.
- **Xem Code**: Mở modal xem trước toàn bộ mã nguồn JavaScript sẽ được xuất ra
  kèm nút sao chép nhanh vào clipboard.

### 3.6. Chi tiết chức năng Profile Admin CMS (`profile/admin/index.html`)

Bảng điều khiển chuyên biệt dành cho thông tin trang cá nhân và thông tin thanh
toán:

- **Thương hiệu & Nhận diện**: Tên Admin, Tiêu đề thương hiệu, Khẩu hiệu, Tên
  miền hiển thị, Ảnh đại diện Avatar, Logo, Bật/tắt Tích xanh Verified.
- **Dịch vụ & Badges**: Quản lý danh sách dịch vụ với Icon khiên, cộng đồng, tư
  vấn, sao vàng hiển thị trên sidebar.
- **Thông tin liên hệ**: Số hotline (gọi điện thoại), định dạng hiển thị, link
  chat Zalo, Email, Địa chỉ trụ sở, Website.
- **Mạng xã hội**: Danh sách các kênh Facebook, Zalo, Telegram, TikTok, YouTube
  (thêm/sửa/xóa/đổi link).
- **Tài khoản ngân hàng & VietQR**: Quản lý nhiều STK ngân hàng (MB, MBV,
  Vietcombank, Techcombank...). Tự động sinh mã QR chuyển khoản VietQR chuẩn,
  tích hợp nút xem trước mã QR tức thì.
- **Hệ thống kênh & Box cộng đồng**: Quản lý các Box Zalo VIP, Fanpage, Channel
  Telegram với badge và nút tham gia.
- **Chân trang & Bản quyền**: Cập nhật slogan footer, đoạn giới thiệu ngắn và
  năm bản quyền.
- **Đồng bộ dữ liệu an toàn**: Khi lưu Profile, Worker và CMS tự động bảo toàn
  danh sách vật phẩm `mockProducts`, không bao giờ bị mất hoặc đè dữ liệu.

---

## 4. CẤU TRÚC DỮ LIỆU SẢN PHẨM & PROFILE SCHEMA

### 4.1. Cấu trúc vật phẩm (Product Schema)

Mỗi tài khoản / vật phẩm trong `mockProducts` tuân theo cấu trúc sau:

```javascript
{
  id: 2654,                                      // Số nguyên duy nhất định danh tài khoản
  title: "Mùa Chinh Phạt - Full T5 3 Đạo",       // Tiêu đề hiển thị chính
  price: 11800000,                               // Giá bán thực tế (VNĐ)
  link: "guide/index.html?id=2654",              // Link mở trong popup iframe 9:16
  favorites: 125,                                // Số lượt thích ban đầu
  isFavorited: false,                            // Trạng thái đã thích của người dùng
  badges: [                                      // Huy hiệu phân loại
    { text: "Chơi", type: "red" },
    { text: "BẢN ANH HÙNG CA", type: "dark" }
  ],
  info: "#2654 | Có thể nhập cư",               // Thông tin vương quốc & di chuyển
  stats: "Cấp độ 25 | Sức mạnh 91,652,733 | VIP 16 | Điểm Tiêu Diệt 7,527,939,303",
  tags: [                                        // Thẻ đặc điểm tài khoản
    { text: "Chỉ Huy Thức Tỉnh Huyền Thoại ×19", type: "orange" },
    { text: "Trang Bị Huyền Thoại ×43", type: "orange" },
    { text: "Số Dư Xu Lung Linh 5", type: "blue" },
    { text: "Trang Hộ Chiếu 20", type: "blue" }
  ],
  commanders: [                                  // Tối đa 5 tướng tiêu biểu hiển thị avatar
    { id: "arthur", name: "Arthur Pendragon", level: 60, isImg: true },
    { id: "tontu", name: "Tôn Tử", level: 60 },
    { id: "achilles", name: "Achilles", level: 60 },
    { id: "tanthuyhoang", name: "Tần Thủy Hoàng", level: 60 },
    { id: "scipio", name: "Scipio Africanus", level: 60 }
  ],
  gemMultiplier: 5,                              // Hệ số ngọc / sao
  countdownSeconds: 604800                       // Thời gian đếm ngược (giây)
}
```

### 4.2. Cấu trúc cấu hình Profile (Profile Schema)

Cấu hình Profile trong `profileConfig` bao gồm:

```javascript
{
  brand: {
    name: "Meo Meo Rise",                         // Tên Admin hiển thị
    title: "Rise Of KingDoms",                    // Tiêu đề website / thương hiệu
    slogan: "Trung Gian Giao Dịch & Dịch Vụ ROK", // Khẩu hiệu
    websiteName: "MEOMEORISE.VN",                 // Nhãn tên miền
    websiteUrl: "https://meomeorise.vn",          // Đường dẫn website
    avatar: "icon/icon.jpg",                      // Ảnh đại diện
    logo: "icon/icon.png",                        // Logo header
    verified: true                                // Tích xanh chính chủ
  },
  services: [                                     // Các dịch vụ hiển thị ở sidebar
    { title: "Trung Gian Giao Dịch", icon: "shield", desc: "Bảo đảm an toàn giao dịch" },
    { title: "Phát Triển Cộng Đồng Rok", icon: "users", desc: "Kết nối game thủ" },
    { title: "Tư Vấn Mọi Chức Năng", icon: "message", desc: "Hỗ trợ định giá acc" }
  ],
  contact: {
    phone: "0949257924",                          // Hotline gọi điện
    phoneDisplay: "0949.257.924",                 // Định dạng hiển thị
    zalo: "0949257924",                           // Số Zalo
    zaloUrl: "https://zalo.me/84949257924",       // Link chat Zalo
    email: "longnhat712@gmail.com",
    address: "Biên Hòa, Đồng Nai (Toàn Quốc)",
    website: "https://meomeorise.vn"
  },
  socials: [                                      // Mạng xã hội tại Tab 1
    { id: "facebook", name: "Facebook", username: "MeoMeoRise", url: "https://www.facebook.com/MeoMeoRise", icon: "facebook", active: true },
    { id: "zalo", name: "Zalo", username: "0949257924", url: "https://zalo.me/84949257924", icon: "zalo", active: true },
    { id: "telegram", name: "Telegram", username: "@meomeorise", url: "https://t.me/meomeorise", icon: "telegram", active: true },
    { id: "tiktok", name: "TikTok", username: "@meomeorise", url: "https://www.tiktok.com", icon: "tiktok", active: true },
    { id: "youtube", name: "YouTube", username: "MeoMeoRise", url: "https://www.youtube.com", icon: "youtube", active: true }
  ],
  banks: [                                        // Danh sách STK & QR ngân hàng tại Tab 2
    {
      id: "mbbank",
      bankName: "Ngân hàng Quân Đội (MB Bank)",
      bankCode: "MB",
      accountNumber: "0949257924",
      accountHolder: "NGUYEN LONG NHAT",
      qrUrl: "https://api.vietqr.io/image/970422-0949257924-compact.jpg?accountName=NGUYEN%20LONG%20NHAT",
      logoType: "mb"
    }
  ],
  systemChannels: {                               // Hệ thống kênh & box cộng đồng tại Tab 3
    title: "Hệ Thống Kênh & Cộng Đồng",
    description: "Các kênh truyền thông chính thức và box cộng đồng Rise of Kingdoms.",
    channels: [
      { name: "Box Zalo Giao Dịch ROK VIP", desc: "Thảo luận mua bán, trao đổi uy tín", url: "https://zalo.me/...", badge: "VIP", buttonText: "Vào Box Zalo" }
    ]
  },
  footer: {
    sloganTitle: "Rise Of KingDoms - Uy Tín Tạo Nên Thương Hiệu",
    aboutText: "- Trung Gian Giao Dịch\n- Phát Triển Cộng Đồng Rok\n- Tư Vấn Mọi Chức Năng Game Rok",
    copyrightYear: 2026,
    copyrightText: "Rise Of KingDoms Services. All Rights Reserved."
  }
}
```

---

## 5. HƯỚNG DẪN TRIỂN KHAI & CÀI ĐẶT (DEPLOYMENT GUIDE)

### Bước 1: Tạo GitHub Personal Access Token (PAT)

1. Đăng nhập vào GitHub, truy cập: **Settings** -> **Developer settings** ->
   **Personal access tokens** -> **Tokens (classic)** (hoặc Fine-grained).
2. Nhấn **Generate new token (classic)**.
3. Đặt tên (Note), ví dụ: `WonTrade-Worker-Token`.
4. Tích chọn quyền: **`repo`** (Full control of private and public
   repositories).
5. Nhấn **Generate token** và **sao chép mã token** này (chỉ hiển thị 1 lần duy
   nhất).

### Bước 2: Tạo và Cấu hình Cloudflare Worker

1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn menu **Workers & Pages** -> Nhấn **Create Application** -> **Create
   Worker**.
3. Đặt tên cho Worker (ví dụ: `wontrade-cms-worker`) -> Nhấn **Deploy**.
4. Nhấn **Edit code**, dán toàn bộ mã nguồn từ file
   [worker.js](file:///d:/website/os/meo/worker.js) vào trình soạn thảo và nhấn
   **Save and deploy**.

### Bước 3: Cấu hình Biến Môi Trường trên Cloudflare

Trong trang quản lý Worker vừa tạo trên Cloudflare:

1. Vào tab **Settings** -> mục **Variables and Secrets**.
2. Nhấn **Add** để thêm các biến môi trường sau:

| Tên biến (Variable Name) | Giá trị mẫu       | Bắt buộc | Mô tả                                                                 |
| :----------------------- | :---------------- | :------: | :-------------------------------------------------------------------- |
| `GITHUB_TOKEN`           | `ghp_xxxxxx...`   |  **Có**  | Personal Access Token lấy từ Bước 1 (Khuyên dùng dạng Secret/Encrypt) |
| `REPO_OWNER`             | `your-username`   |  **Có**  | Tên tài khoản GitHub sở hữu repository                                |
| `REPO_NAME`              | `rok-wontrade`    |  **Có**  | Tên repository chứa mã nguồn website                                  |
| `FILE_PATH`              | `js/list.js`      |  Không   | Đường dẫn file danh sách (Mặc định: `js/list.js`)                     |
| `BRANCH`                 | `main`            |  Không   | Nhánh cần commit (Mặc định: `main` hoặc `master`)                     |
| `ADMIN_SECRET`           | `MySecretKey123@` |  Không   | Khóa bảo vệ API chống người lạ gọi Worker                             |

3. Nhấn **Save and Deploy**.

### Bước 4: Kết nối Admin CMS với Worker

1. Mở trang quản trị
   [admin/index.html](file:///d:/website/os/meo/admin/index.html) trên trình
   duyệt.
2. Tại thanh **Worker URL**, dán URL Worker của bạn (ví dụ:
   `https://wontrade-cms-worker.yourname.workers.dev`).
3. Nếu ở Bước 3 bạn có đặt `ADMIN_SECRET`, hãy nhập đúng mật khẩu đó vào ô
   **Secret Key**.
4. Bấm **Kiểm tra kết nối**. Nếu xuất hiện thông báo màu xanh
   `Kết nối Worker & GitHub thành công!`, hệ thống đã sẵn sàng 100%!

---

## 6. CÁC BIẾN MÔI TRƯỜNG CẦN THIẾT (ENVIRONMENT VARIABLES)

Chi tiết cách hoạt động của từng biến:

- `GITHUB_TOKEN`: Được Worker đính kèm vào header `Authorization: Bearer ...`
  khi gửi request sang `https://api.github.com`.
- `REPO_OWNER` & `REPO_NAME`: Định vị chính xác repo cần cập nhật theo định dạng
  URL của GitHub REST API.
- `FILE_PATH`: Định vị đường dẫn file trong repo. Khi Admin bấm Lưu với cờ
  `updateBoth: true`, Worker sẽ tự động cập nhật cả file này lẫn `list.js` ở thư
  mục gốc.
- `ADMIN_SECRET`: Ngăn chặn việc ai đó tìm ra URL Worker của bạn rồi gửi request
  phá hoại hoặc spam commit vào GitHub.

---

## 7. KHẮC PHỤC SỰ CỐ THƯỜNG GẶP (TROUBLESHOOTING)

| Hiện tượng / Báo lỗi                                 | Nguyên nhân                                      | Cách xử lý                                                                                                                                                                                               |
| :--------------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Worker phản hồi: "Hello World!"**                  | Worker mới tạo chưa được cập nhật code           | Mở Cloudflare Worker -> Edit code -> Dán toàn bộ nội dung file `worker.js` và bấm **Save and deploy**.                                                                                                   |
| **Lỗi 401 Unauthorized**                             | Sai khóa bảo mật `ADMIN_SECRET`                  | Kiểm tra lại ô **Secret Key** trên giao diện Admin có khớp với biến `ADMIN_SECRET` trong Settings của Worker hay không.                                                                                  |
| **Lỗi 404 Not Found từ GitHub**                      | Sai `REPO_OWNER`, `REPO_NAME` hoặc Token sai     | Kiểm tra chính xác tên tài khoản GitHub và tên kho lưu trữ. Đảm bảo Token có quyền `repo`.                                                                                                               |
| **Lỗi 409 Conflict (SHA Mismatch)**                  | Có người khác vừa commit đè lên file trên GitHub | Worker đã có cơ chế tự động lấy SHA mới nhất trước mỗi lượt commit. Nếu vẫn gặp, hãy tải lại trang Admin để làm mới dữ liệu.                                                                             |
| **Lưu thành công nhưng vào web chính chưa thấy đổi** | Hệ thống hosting cần thời gian build             | GitHub Pages hoặc Cloudflare Pages cần từ **1 đến 3 phút** để chạy pipeline build và cập nhật bộ nhớ đệm (Cache). Hãy thử tải lại trang web chính bằng tổ hợp phím `Ctrl + F5` (hoặc `Cmd + Shift + R`). |
| **Lỗi hiển thị tiếng Việt có dấu**                   | Mã hóa Base64 không chuẩn UTF-8                  | Worker và CMS đều đã tích hợp sẵn bộ mã hóa `TextEncoder` và `TextDecoder` chuẩn RFC, đảm bảo hiển thị 100% tiếng Việt không bị lỗi font.                                                                |

---

_Tài liệu được biên soạn và chuẩn hóa phục vụ vận hành hệ thống WONTRADE._
