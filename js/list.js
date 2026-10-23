/**
 * WONTRADE - Rise of Kingdoms (ROK)
 * Danh sách sản phẩm & Thư viện ảnh mô tả ImgBB (Edge-SSG Independent Data)
 * Tự động đồng bộ qua Cloudflare Worker: 17:36:56 23/10/2026
 */

var mockProducts = [
  {
    "id": 1420,
    "title": "Chỉ Huy Thủ Thành & Đồn Trú Vững Chắc Zenobia + YSS",
    "price": 49530000,
    "link": "guide/index.html?id=1420",
    "favorites": 6,
    "isFavorited": false,
    "images": [],
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
  },
  {
    "id": 1555,
    "title": "Acc T5 Chuẩn KVK - Full Công Nghệ Quân Sự 25",
    "price": 23368000,
    "link": "guide/index.html?id=1555",
    "favorites": 5,
    "isFavorited": false,
    "images": [
      "https://i.ibb.co/Kj9tM1jh/nh-ch-p-m-n-h-nh-2026-10-24-002148.png"
    ],
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      },
      {
        "text": "BẢN ANH HÙNG CA",
        "type": "dark"
      }
    ],
    "info": "#1555 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 94,100,500 | VIP 16 | Điểm Tiêu Diệt 4,120,800,000",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×24",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×32",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×8",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×5",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×11",
        "type": "blue"
      },
      {
        "text": "Trang Hộ Chiếu 52",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 480",
        "type": "blue"
      }
    ],
    "commanders": [
      {
        "id": "scipio",
        "name": "Scipio Africanus",
        "level": 60
      },
      {
        "id": "quanvu",
        "name": "Quan Vũ",
        "level": 60
      },
      {
        "id": "tontu",
        "name": "Tôn Tử",
        "level": 60
      },
      {
        "id": "choiyoung",
        "name": "Choi Young",
        "level": 60
      },
      {
        "id": "arthur",
        "name": "Arthur Pendragon",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 910800
  }
];

if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
}
