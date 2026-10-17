/**
 * ==============================================================================
 * WONTRADE - RISE OF KINGDOMS TRADING PLATFORM
 * FILE QUẢN LÝ DANH SÁCH VẬT PHẨM (Tổng số: 1 vật phẩm)
 * Cập nhật tự động qua WONTRADE Admin CMS & Cloudflare Worker
 * ==============================================================================
 */

var mockProducts = [
  {
    "id": 1420,
    "title": "Chỉ Huy Thủ Thành & Đồn Trú Vững Chắc Zenobia + YSS",
    "price": 49530000,
    "favorites": 6,
    "isFavorited": false,
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      }
    ],
    "info": "#1420 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 110,400,200 | VIP 17 | Điểm Tiêu Diệt 5,890,100,400",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×32",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×38",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×12",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×6",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×15",
        "type": "orange"
      },
      {
        "text": "Số Dư Xu Lung Linh 4",
        "type": "blue"
      },
      {
        "text": "Trang Hộ Chiếu 78",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 890",
        "type": "blue"
      }
    ],
    "commanders": [
      {
        "id": "bachkhoi",
        "name": "Bạch Khởi",
        "level": 60
      },
      {
        "id": "choiyoung",
        "name": "Choi Young",
        "level": 60
      },
      {
        "id": "tontu",
        "name": "Tôn Tử",
        "level": 60
      },
      {
        "id": "achilles",
        "name": "Achilles",
        "level": 60
      },
      {
        "id": "arthur",
        "name": "Arthur Pendragon",
        "level": 60,
        "isImg": true
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 1103740
  }
];

// Gán vào window để đảm bảo tương thích mọi ngữ cảnh trình duyệt
if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
}

// Hỗ trợ môi trường Module/NodeJS nếu cần
if (typeof module !== "undefined" && module.exports) {
  module.exports = mockProducts;
}
