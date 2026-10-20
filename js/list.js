/**
 * ==============================================================================
 * WONTRADE - RISE OF KINGDOMS TRADING PLATFORM
 * FILE DỰ PHÒNG DANH SÁCH VẬT PHẨM (Tổng số: 4 vật phẩm)
 * Cập nhật tự động qua WONTRADE Admin CMS & Cloudflare Worker (Edge-SSG)
 * ==============================================================================
 */

var mockProducts = [
  {
    "id": 2322,
    "title": "Chỉ Huy Bộ Binh Chuyên Nghiệp",
    "price": 45695000,
    "link": "guide/index.html?id=2322",
    "favorites": 2,
    "isFavorited": false,
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      }
    ],
    "info": "#2322 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 126,690,958 | VIP 19 | Điểm Tiêu Diệt 2,784,766,573",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×60",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×58",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×13",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×3",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×10",
        "type": "orange"
      },
      {
        "text": "Trang Hộ Chiếu 128",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 981",
        "type": "blue"
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
        "id": "quanvu",
        "name": "Quan Vũ",
        "level": 60
      },
      {
        "id": "choiyoung",
        "name": "Choi Young",
        "level": 60
      },
      {
        "id": "bachkhoi",
        "name": "Bạch Khởi",
        "level": 60
      },
      {
        "id": "tontu",
        "name": "Tôn Tử",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 543520
  },
  {
    "id": 1888,
    "title": "Kỵ Binh Siêu Tốc Nevsky + Joan | Full Đồ Cam Tài Năng",
    "price": 87630000,
    "link": "guide/index.html?id=1888",
    "favorites": 8,
    "isFavorited": false,
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      },
      {
        "text": "CHIẾN THẦN",
        "type": "dark"
      }
    ],
    "info": "#1888 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 135,420,110 | VIP 18 | Điểm Tiêu Diệt 8,920,330,120",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×45",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×52",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×18",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×11",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×22",
        "type": "orange"
      },
      {
        "text": "Số Dư Xu Lung Linh 8",
        "type": "blue"
      },
      {
        "text": "Trang Hộ Chiếu 85",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 1,420",
        "type": "blue"
      }
    ],
    "commanders": [
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
      },
      {
        "id": "scipio",
        "name": "Scipio Africanus",
        "level": 60
      },
      {
        "id": "choiyoung",
        "name": "Choi Young",
        "level": 60
      },
      {
        "id": "alparslan",
        "name": "Alp Arslan",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 965720
  },
  {
    "id": 2790,
    "title": "Spac2 TESS",
    "price": 215900000,
    "link": "guide/index.html?id=2790",
    "favorites": 14,
    "isFavorited": false,
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      },
      {
        "text": "VUA VƯƠNG QUỐC ANH",
        "type": "dark"
      }
    ],
    "info": "#2790 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 185,600,000 | VIP 19 | Điểm Tiêu Diệt 15,200,900,000",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×65",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×70",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×28",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×20",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×35",
        "type": "blue"
      },
      {
        "text": "Số Dư Xu Lung Linh 15",
        "type": "blue"
      },
      {
        "text": "Trang Hộ Chiếu 200",
        "type": "blue"
      },
      {
        "text": "Tượng Chỉ Huy Huyền Thoại 2,500",
        "type": "blue"
      }
    ],
    "commanders": [
      {
        "id": "luutriet",
        "name": "Lưu Triệt",
        "level": 60
      },
      {
        "id": "tanthuyhoang",
        "name": "Tần Thủy Hoàng",
        "level": 60
      },
      {
        "id": "quanvu",
        "name": "Quan Vũ",
        "level": 60
      },
      {
        "id": "scipio",
        "name": "Scipio Africanus",
        "level": 60
      },
      {
        "id": "arthur",
        "name": "Arthur Pendragon",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 1825200
  },
  {
    "id": 2855,
    "title": "Spac2",
    "price": 9652000,
    "link": "guide/index.html?id=2855",
    "favorites": 1,
    "isFavorited": false,
    "badges": [
      {
        "text": "Chơi",
        "type": "red"
      }
    ],
    "info": "#2855 | Có thể nhập cư",
    "stats": "Cấp độ 25 | Sức mạnh 75,300,100 | VIP 15 | Điểm Tiêu Diệt 2,400,000,000",
    "tags": [
      {
        "text": "Chỉ Huy Thức Tỉnh Huyền Thoại ×15",
        "type": "orange"
      },
      {
        "text": "Trang Bị Huyền Thoại ×24",
        "type": "orange"
      },
      {
        "text": "Trang Bị Tài Năng Đặc Biệt Huyền Thoại ×5",
        "type": "orange"
      },
      {
        "text": "Minh Văn Đặc Biệt ×2",
        "type": "orange"
      },
      {
        "text": "Minh Văn Hiếm ×8",
        "type": "blue"
      },
      {
        "text": "Spac2 0",
        "type": "blue"
      }
    ],
    "commanders": [
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
        "id": "alparslan",
        "name": "Alp Arslan",
        "level": 60
      },
      {
        "id": "bachkhoi",
        "name": "Bạch Khởi",
        "level": 60
      },
      {
        "id": "arthur",
        "name": "Arthur Pendragon",
        "level": 60
      }
    ],
    "gemMultiplier": 5,
    "countdownSeconds": 374400
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
