/**
 * ==============================================================================
 * WONTRADE - RISE OF KINGDOMS TRADING PLATFORM
 * FILE DỰ PHÒNG DANH SÁCH VẬT PHẨM (Tổng số: 3 vật phẩm)
 * Cập nhật tự động qua WONTRADE Admin CMS & Cloudflare Worker (Edge-SSG)
 * ==============================================================================
 */

var mockProducts = [
  {
    "id": 1109,
    "title": "Spac2",
    "price": 68489000,
    "link": "guide/index.html?id=1109",
    "favorites": 0,
    "isFavorited": false,
    "badges": [
      {
        "text": "VUA VƯƠNG QUỐC ANH",
        "type": "red"
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
        "type": "blue"
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
        "level": 60
      },
      {
        "id": "luutriet",
        "name": "Lưu Triệt",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 2566800
  },
  {
    "id": 1420,
    "title": "Spac2 Tess",
    "price": 49530000,
    "link": "guide/index.html?id=1420",
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
        "type": "blue"
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
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 1105200
  },
  {
    "id": 1555,
    "title": "Acc T5 Chuẩn KVK - Full Công Nghệ Quân Sự 25",
    "price": 23368000,
    "link": "guide/index.html?id=1555",
    "favorites": 5,
    "isFavorited": false,
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
        "type": "orange"
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
        "level": 60,
        "isImg": true
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 910098
  }
];

// CẤU HÌNH THÔNG TIN SITE (Được quản lý tự động qua Admin CMS & Cloudflare Worker)
var siteConfig = {
  "brand": {
    "name": "WONTRADE",
    "gameName": "Rise of Kingdoms",
    "avatar": "assets/rok_avatar.jpg"
  },
  "banner": {
    "desktopHeadline": "WONTRADE TRANSACTION GUIDELINES UPDATE",
    "desktopRibbon": "LOWER FEE & SIMPLIFIED PROCESS!",
    "mobileBadge": "ĐỐI TÁC GIAO DỊCH CHÍNH THỨC",
    "mobileTitle": "NHÀ GIAO DỊCH WONTRADE",
    "mobileSubtitle": "BẢO HIỂM 100% • XÁC MINH DANH TÍNH MINH BẠCH"
  },
  "seo": {
    "title": "WONTRADE - Nền tảng giao dịch Rise of Kingdoms chính thức",
    "description": "Nhà giao dịch WONTRADE - Nền tảng giao dịch đối tác chính thức cho Rise of Kingdoms. Mua bán tài khoản, chỉ huy thức tỉnh, trang bị huyền thoại an toàn và nhanh chóng.",
    "keywords": "wontrade, rise of kingdoms, rok, mua bán acc rok, giao dịch rok",
    "ogImage": "assets/rok_avatar.jpg"
  },
  "contact": {
    "phone": "03729964208",
    "zalo": "03729964208",
    "zaloUrl": "https://zalo.me/0372996420"
  }
};

if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
  if (typeof siteConfig !== "undefined") {
    window.siteConfig = siteConfig;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { mockProducts, ...(typeof siteConfig !== "undefined" ? { siteConfig } : {}) };
}
