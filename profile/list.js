/**
 * ==============================================================================
 * WONTRADE - RISE OF KINGDOMS TRADING PLATFORM & PROFILE CMS
 * FILE QUẢN LÝ DANH SÁCH VẬT PHẨM & CẤU HÌNH PROFILE ĐẠI DIỆN
 * Cập nhật tự động qua WONTRADE Admin CMS & Cloudflare Worker
 * ==============================================================================
 */

var mockProducts = [];

// CẤU HÌNH THÔNG TIN PROFILE (Được quản lý tự động qua /profile/admin/index.html & Cloudflare Worker)
var profileConfig = {
  "brand": {
    "name": "Meo Meo Rise",
    "title": "Rise Of KingDoms",
    "slogan": "Trung Gian Giao Dịch & Dịch Vụ ROK Uy Tín",
    "websiteName": "MEOMEORISE.VN",
    "websiteUrl": "https://meomeorise.com",
    "avatar": "icon/icon.jpg",
    "logo": "icon/icon.png",
    "verified": true
  },
  "services": [
    {
      "title": "Trung Gian Giao Dịch",
      "icon": "shield",
      "desc": "Bảo đảm an toàn tuyệt đối mọi giao dịch tài khoản ROK"
    },
    {
      "title": "Phát Triển Cộng Đồng Rok",
      "icon": "users",
      "desc": "Kết nối hàng nghìn game thủ và liên minh trên toàn quốc"
    },
    {
      "title": "Tư Vấn Mọi Chức Năng",
      "icon": "message",
      "desc": "Hỗ trợ định giá acc, build tướng, nhập cư vương quốc"
    }
  ],
  "contact": {
    "phone": "0949257924",
    "phoneDisplay": "0949.257.924",
    "zalo": "0949257924",
    "zaloUrl": "https://zalo.me/84949257924",
    "email": "longnhat712@gmail.com",
    "address": "Biên Hòa, Đồng Nai (Toàn Quốc)",
    "website": "https://meomeorise.vn"
  },
  "socials": [
    {
      "id": "facebook",
      "name": "Facebook",
      "username": "MeoMeoRise",
      "url": "https://www.facebook.com/MeoMeoRise",
      "icon": "facebook",
      "active": true
    },
    {
      "id": "zalo",
      "name": "Zalo",
      "username": "0949257924",
      "url": "https://zalo.me/84949257924",
      "icon": "zalo",
      "active": true
    },
    {
      "id": "telegram",
      "name": "Telegram",
      "username": "@meomeorise",
      "url": "https://t.me/meomeorise",
      "icon": "telegram",
      "active": true
    },
    {
      "id": "tiktok",
      "name": "TikTok",
      "username": "@meomeorise",
      "icon": "tiktok",
      "active": true
    },
    {
      "id": "youtube",
      "name": "YouTube",
      "username": "MeoMeoRise",
      "url": "https://www.youtube.com",
      "icon": "youtube",
      "active": true
    }
  ],
  "socialGroups": {
    "facebookGroups": [
      {
        "id": "fb_jjnno",
        "name": "Spac2 TESS",
        "members": "10.000+ thành viên",
        "url": "https://www.facebook.com/groups/MeoMeoRise",
        "icon": "https://facebook.com/favicon.ico",
        "desc": "ok200"
      }
    ],
    "zaloGroups": []
  },
  "banks": [
    {
      "id": "mb_7924",
      "bankName": "Ngân hàng Quân Đội (MB Bank)",
      "bankCode": "MB",
      "accountNumber": "0949257924",
      "accountHolder": "NGUYEN LONG NHAT",
      "qrUrl": "https://api.vietqr.io/image/970422-0949257924-compact.jpg?accountName=NGUYEN%20LONG%20NHAT",
      "logoType": "mb"
    },
    {
      "id": "mbv_7924",
      "bankName": "Ngân hàng MBV",
      "bankCode": "MBV",
      "accountNumber": "0949257924",
      "accountHolder": "NGUYEN LONG NHAT",
      "qrUrl": "https://api.vietqr.io/image/970422-0949257924-compact.jpg?accountName=NGUYEN%20LONG%20NHAT",
      "logoType": "mbv"
    }
  ],
  "systemChannels": {
    "title": "Hệ Thống Kênh & Cộng Đồng",
    "description": "Các kênh truyền thông chính thức và box cộng đồng Rise of Kingdoms.",
    "channels": [
      {
        "name": "Box Zalo Giao Dịch ROK VIP",
        "badge": "VIP",
        "url": "https://zalo.me/84949257924",
        "buttonText": "Tham gia",
        "desc": "Thảo luận mua bán, trao đổi tài khoản uy tín"
      },
      {
        "name": "Fanpage Facebook Chính Thức",
        "badge": "Official",
        "url": "https://www.facebook.com/MeoMeoRise",
        "buttonText": "Tham gia",
        "desc": "Cập nhật tin tức vương quốc, sự kiện quà tặng"
      },
      {
        "name": "Kênh Telegram Báo Giá Acc",
        "badge": "24/7",
        "url": "https://t.me/meomeorise",
        "buttonText": "Tham gia",
        "desc": "Nhận thông báo tài khoản xả lỗ, giá tốt tức thì"
      }
    ]
  },
  "footer": {
    "sloganTitle": "Rise Of KingDoms - Uy Tín Tạo Nên Thương Hiệu",
    "aboutText": "- Trung Gian Giao Dịch\n- Phát Triển Cộng Đồng Rok\n- Tư Vấn Mọi Chức Năng Game Rok",
    "copyrightYear": 2026,
    "copyrightText": "Rise Of KingDoms Services. All Rights Reserved."
  }
};

// Gán vào window để đảm bảo tương thích mọi ngữ cảnh trình duyệt
if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
  window.profileConfig = profileConfig;
}

// Hỗ trợ môi trường Module/NodeJS nếu cần
if (typeof module !== "undefined" && module.exports) {
  module.exports = { mockProducts, profileConfig };
}
