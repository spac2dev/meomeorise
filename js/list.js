/**
 * WONTRADE - Rise of Kingdoms (ROK)
 * Danh sách sản phẩm & Thư viện ảnh mô tả ImgBB (Edge-SSG Independent Data)
 * Tự động đồng bộ qua Cloudflare Worker: 19:51:17 23/10/2026
 */

var mockProducts = [
  {
    "id": 2305,
    "title": "Thử nghiệm",
    "price": 10000000,
    "link": "guide/index.html?id=2305",
    "favorites": 0,
    "isFavorited": false,
    "images": [
      "https://i.ibb.co/gFwCQPF1/1792781568365-7880084465306086323-7880084465306086323-d2160c8ee1bd0d62b71d386fcd0dcc91.jpg",
      "https://i.ibb.co/S4GSDXcH/1792781568386-7880084465306086323-7880084465306086323-eb9fc6bf7c441b3243815dea4e16d605.jpg",
      "https://i.ibb.co/gFwCQPF1/1792781568365-7880084465306086323-7880084465306086323-d2160c8ee1bd0d62b71d386fcd0dcc91.jpg",
      "https://i.ibb.co/S4GSDXcH/1792781568386-7880084465306086323-7880084465306086323-eb9fc6bf7c441b3243815dea4e16d605.jpg",
      "https://i.ibb.co/jkw7NDJn/1792781568428-7880084465306086323-7880084465306086323-02cd9480cb591327966403767a4f4a95.jpg",
      "https://i.ibb.co/gFwCQPF1/1792781568365-7880084465306086323-7880084465306086323-d2160c8ee1bd0d62b71d386fcd0dcc91.jpg",
      "https://i.ibb.co/S4GSDXcH/1792781568386-7880084465306086323-7880084465306086323-eb9fc6bf7c441b3243815dea4e16d605.jpg",
      "https://i.ibb.co/jkw7NDJn/1792781568428-7880084465306086323-7880084465306086323-02cd9480cb591327966403767a4f4a95.jpg",
      "https://i.ibb.co/1tHr0SjS/1792781568449-7880084465306086323-7880084465306086323-849a13792fddb6afe2915e8cfb9276e5.jpg",
      "https://i.ibb.co/2pBQyKF/1792781568470-7880084465306086323-7880084465306086323-5ec43b9282da27b0eeaff8e20c514038.jpg",
      "https://i.ibb.co/wFR0rJSQ/1792781568491-7880084465306086323-7880084465306086323-15ea4693d565ffeafa7cda0b01049dfe.jpg",
      "https://i.ibb.co/hFxGwFJp/1792781568512-7880084465306086323-7880084465306086323-b3e4497481e8b378aacf634ce2f186ba.jpg",
      "https://i.ibb.co/VYzTBCJc/1792781568533-7880084465306086323-7880084465306086323-6d69ca0a6774521c82b8ea13c84e1f43.jpg",
      "https://i.ibb.co/nNf9QQgr/1792781568553-7880084465306086323-7880084465306086323-eaaad96643faeb52eebf5f3ca7ac8b16.jpg",
      "https://i.ibb.co/xKgcJ4xN/1792781568574-7880084465306086323-7880084465306086323-a9e4d56662c08edfd4a578439990c909.jpg",
      "https://i.ibb.co/nNf9QQgr/1792781568553-7880084465306086323-7880084465306086323-eaaad96643faeb52eebf5f3ca7ac8b16.jpg",
      "https://i.ibb.co/xKgcJ4xN/1792781568574-7880084465306086323-7880084465306086323-a9e4d56662c08edfd4a578439990c909.jpg",
      "https://i.ibb.co/fV2qMtMy/1792781569200-7880084465306086323-7880084465306086323-a36a0018b6b07c2583b1ed485dd0a61a.jpg",
      "https://i.ibb.co/Kzz38m4r/1792781569202-7880084465306086323-7880084465306086323-0f73da299cb7b50e3991e1e5cad32487.jpg",
      "https://i.ibb.co/9ksrCjXJ/1792781569411-7880084465306086323-7880084465306086323-6fc77410d7e012c1b1b42f88d7d9d9b7.jpg"
    ],
    "imageCategories": {
      "tuong": [
        "https://i.ibb.co/gFwCQPF1/1792781568365-7880084465306086323-7880084465306086323-d2160c8ee1bd0d62b71d386fcd0dcc91.jpg",
        "https://i.ibb.co/S4GSDXcH/1792781568386-7880084465306086323-7880084465306086323-eb9fc6bf7c441b3243815dea4e16d605.jpg"
      ],
      "trangbi": [
        "https://i.ibb.co/gFwCQPF1/1792781568365-7880084465306086323-7880084465306086323-d2160c8ee1bd0d62b71d386fcd0dcc91.jpg",
        "https://i.ibb.co/S4GSDXcH/1792781568386-7880084465306086323-7880084465306086323-eb9fc6bf7c441b3243815dea4e16d605.jpg",
        "https://i.ibb.co/jkw7NDJn/1792781568428-7880084465306086323-7880084465306086323-02cd9480cb591327966403767a4f4a95.jpg",
        "https://i.ibb.co/gFwCQPF1/1792781568365-7880084465306086323-7880084465306086323-d2160c8ee1bd0d62b71d386fcd0dcc91.jpg",
        "https://i.ibb.co/S4GSDXcH/1792781568386-7880084465306086323-7880084465306086323-eb9fc6bf7c441b3243815dea4e16d605.jpg",
        "https://i.ibb.co/jkw7NDJn/1792781568428-7880084465306086323-7880084465306086323-02cd9480cb591327966403767a4f4a95.jpg",
        "https://i.ibb.co/1tHr0SjS/1792781568449-7880084465306086323-7880084465306086323-849a13792fddb6afe2915e8cfb9276e5.jpg",
        "https://i.ibb.co/2pBQyKF/1792781568470-7880084465306086323-7880084465306086323-5ec43b9282da27b0eeaff8e20c514038.jpg",
        "https://i.ibb.co/wFR0rJSQ/1792781568491-7880084465306086323-7880084465306086323-15ea4693d565ffeafa7cda0b01049dfe.jpg",
        "https://i.ibb.co/hFxGwFJp/1792781568512-7880084465306086323-7880084465306086323-b3e4497481e8b378aacf634ce2f186ba.jpg",
        "https://i.ibb.co/VYzTBCJc/1792781568533-7880084465306086323-7880084465306086323-6d69ca0a6774521c82b8ea13c84e1f43.jpg",
        "https://i.ibb.co/nNf9QQgr/1792781568553-7880084465306086323-7880084465306086323-eaaad96643faeb52eebf5f3ca7ac8b16.jpg",
        "https://i.ibb.co/xKgcJ4xN/1792781568574-7880084465306086323-7880084465306086323-a9e4d56662c08edfd4a578439990c909.jpg"
      ],
      "rss": [
        "https://i.ibb.co/nNf9QQgr/1792781568553-7880084465306086323-7880084465306086323-eaaad96643faeb52eebf5f3ca7ac8b16.jpg",
        "https://i.ibb.co/xKgcJ4xN/1792781568574-7880084465306086323-7880084465306086323-a9e4d56662c08edfd4a578439990c909.jpg"
      ],
      "vebay": [
        "https://i.ibb.co/fV2qMtMy/1792781569200-7880084465306086323-7880084465306086323-a36a0018b6b07c2583b1ed485dd0a61a.jpg",
        "https://i.ibb.co/Kzz38m4r/1792781569202-7880084465306086323-7880084465306086323-0f73da299cb7b50e3991e1e5cad32487.jpg",
        "https://i.ibb.co/9ksrCjXJ/1792781569411-7880084465306086323-7880084465306086323-6fc77410d7e012c1b1b42f88d7d9d9b7.jpg"
      ]
    },
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      }
    ],
    "info": "#2305 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 80,000,000 | VIP 15",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh ×15",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×30",
        "type": "orange"
      }
    ],
    "commanders": [
      {
        "id": "arthur",
        "name": "Arthur Pendragon",
        "level": 60,
        "isImg": true
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
        "id": "scipio",
        "name": "Scipio Africanus",
        "level": 60
      },
      {
        "id": "quanvu",
        "name": "Quan Vũ",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 604800
  },
  {
    "id": 1109,
    "title": "Chỉ Huy Cung Thủ",
    "price": 68489000,
    "link": "guide/index.html?id=1109",
    "favorites": 0,
    "isFavorited": false,
    "images": [],
    "badges": [
      {
        "text": "VUA VƯƠNG QUỐC ANH",
        "type": "dark"
      }
    ],
    "info": "#1109 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 109,665,659 | VIP 17 | Điểm Tiêu Diệt 11,318,883,510",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×36",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×40",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×13",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×7",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×16",
        "type": "orange"
      },
      {
        "text": "Số Dư Xu Lung Linh 5",
        "type": "blue"
      },
      {
        "text": "Trang Hộ Chiếu 109",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 2,295",
        "type": "blue"
      }
    ],
    "commanders": [
      {
        "id": "tanthuyhoang",
        "name": "Tần Thủy Hoàng",
        "level": 60
      },
      {
        "id": "alparslan",
        "name": "Alp Arslan",
        "level": 60
      },
      {
        "id": "giacatluong",
        "name": "Gia Cát Lượng",
        "level": 60
      },
      {
        "id": "arthur",
        "name": "Arthur Pendragon",
        "level": 60,
        "isImg": true
      },
      {
        "id": "luutriet",
        "name": "Lưu Triệt",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 2567212
  },
  {
    "id": 2304,
    "title": "Chỉ Huy Cung Thủ Boudica Prime + Zhuge Liang Max",
    "price": 81280000,
    "link": "guide/index.html?id=2304",
    "favorites": 8,
    "isFavorited": false,
    "images": [],
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      }
    ],
    "info": "#2304 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 122,400,000 | VIP 18 | Điểm Tiêu Diệt 7,920,400,000",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×40",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×46",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×15",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×9",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×19",
        "type": "orange"
      },
      {
        "text": "Số Dư Xu Lung Linh 6",
        "type": "blue"
      },
      {
        "text": "Trang Hộ Chiếu 95",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 1,280",
        "type": "blue"
      }
    ],
    "commanders": [
      {
        "id": "giacatluong",
        "name": "Gia Cát Lượng",
        "level": 60
      },
      {
        "id": "tanthuyhoang",
        "name": "Tần Thủy Hoàng",
        "level": 60
      },
      {
        "id": "achilles",
        "name": "Achilles",
        "level": 60
      },
      {
        "id": "luutriet",
        "name": "Lưu Triệt",
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
    "countdownSeconds": 1488792
  }
];

if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
}
