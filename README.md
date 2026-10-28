# HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH WORKER CHO PROFILE CMS

Hệ thống quản trị **Profile Admin CMS**
([profile/admin/index.html](file:///d:/website/os/meo/profile/admin/index.html))
sử dụng **Cloudflare Worker riêng biệt**
([profile/worker.js](file:///d:/website/os/meo/profile/worker.js)) độc lập hoàn
toàn với Worker quản lý tài khoản game.

---

## 1. MỤC ĐÍCH & CƠ CHẾ HOẠT ĐỘNG RIÊNG BIỆT

- **Không chia sẻ chung URL Worker**: Worker quản trị Profile hoạt động trên một
  Cloudflare Worker riêng (ví dụ:
  `wontrade-profile.text2developer.workers.dev`), trong khi Worker sản phẩm hoạt
  động trên Worker sản phẩm riêng (`meomeorise.text2developer.workers.dev`).
- **Lưu trữ cấu hình độc lập**: URL và Secret Key của Profile Admin được lưu
  riêng trong trình duyệt với khóa `wontrade_profile_worker_url` và
  `wontrade_profile_worker_secret`, không ghi đè cài đặt của trang quản lý tài
  khoản.
- **Tự động tối ưu SEO & MXH (Mô hình SSG)**: Khi Profile Worker cập nhật, nó
  tự động inject thông tin Profile, Thẻ Title, Meta Description, Thẻ OpenGraph (Facebook/Zalo)
  và nhúng trực tiếp cấu hình `profileConfig` vào `index.html` trên GitHub. Nhờ đó,
  Googlebot và các crawler của MXH đọc được ngay lập tức 100% dữ liệu mà không cần chạy JS.

---

## 2. HƯỚNG DẪN TRIỂN KHAI CLOUDFLARE WORKER CHO PROFILE

### Bước 1: Tạo Worker Mới Trên Cloudflare

1. Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers &
   Pages**.
2. Nhấn **Create application** -> **Create Worker**.
3. Đặt tên Worker (ví dụ: `wontrade-profile-worker`).
4. Nhấn **Deploy**.

### Bước 2: Dán Mã Nguồn

1. Nhấn **Edit code** trên Worker vừa tạo.
2. Sao chép toàn bộ nội dung từ file
   [profile/worker.js](file:///d:/website/os/meo/profile/worker.js) và dán vào
   trình soạn thảo.
3. Nhấn **Save and deploy**.

### Bước 3: Cài Đặt Biến Môi Trường (Settings -> Variables)

Thêm các biến môi trường sau vào Worker:

| Tên biến (Variable) | Giá trị thực tế trên Repo của bạn | Bắt buộc | Ghi chú |
| :------------------ | :-------------------------------- | :------: | :---------------------------------------------------------- |
| `GITHUB_TOKEN`      | `ghp_xxxxxx...`                   |  **Có**  | Personal Access Token có quyền `repo` hoặc `contents:write` |
| `REPO_OWNER`        | `spac2dev`                        |  **Có**  | Tên tài khoản GitHub của bạn |
| `REPO_NAME`         | `infomeomeorise`                  |  **Có**  | Tên repository chứa mã nguồn website |
| `FILE_PATH`         | `index.html`                      |  Không   | Mặc định: `index.html` (nằm ở thư mục gốc repo) |
| `BRANCH`            | `main`                            |  Không   | Nhánh Git cần commit (mặc định: `main`) |
| `ADMIN_SECRET`      | *(Để trống nếu không dùng)*       |  Không   | Khóa bảo mật tùy chọn |

4. Nhấn **Save and Deploy**.

### Bước 4: Kết Nối Trên Giao Diện Profile Admin

1. Mở trang
   [profile/admin/index.html](file:///d:/website/os/meo/profile/admin/index.html).
2. Dán URL của Worker vừa tạo vào ô **Profile Worker URL**.
3. Nhập Secret Key (nếu có đặt `ADMIN_SECRET`).
4. Nhấn **Kiểm tra kết nối** -> Khi thấy thông báo thành công màu xanh là hoàn
   tất!
