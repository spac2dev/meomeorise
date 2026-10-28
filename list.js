/**
 * ==============================================================================
 * MEOMEORISE - PROFILE CONFIGURATION
 * FILE QUẢN LÝ THÔNG TIN PROFILE, LIÊN HỆ, MẠNG XÃ HỘI & NGÂN HÀNG
 * Được quản lý tự động qua /profile/admin/index.html & Cloudflare Worker Profile
 * ==============================================================================
 */

// CẤU HÌNH THÔNG TIN PROFILE
var profileConfig = {
  brand: {
    name: "Meo Meo Rise",
    title: "Info Meo Meo Rise",
    headerTitle: "Rise Of KingDoms",
    slogan: "Nền tảng giao dịch Rise of Kingdoms chính thức",
    pageTitle: "Info Meo Meo Rise - Nền tảng giao dịch Rise of Kingdoms chính thức",
    websiteName: "MEOMEORISE.VN",
    websiteUrl: "https://meomeorise.vn",
    avatar: "icon/icon.jpg",
    logo: "icon/icon.png",
    verified: true
  },
  services: [
    { title: "Trung Gian Giao Dịch", icon: "shield", desc: "Bảo đảm an toàn tuyệt đối mọi giao dịch tài khoản ROK" },
    { title: "Phát Triển Cộng Đồng Rok", icon: "users", desc: "Kết nối hàng nghìn game thủ và liên minh trên toàn quốc" },
    { title: "Tư Vấn Mọi Chức Năng", icon: "message", desc: "Hỗ trợ định giá acc, build tướng, nhập cư vương quốc" }
  ],
  contact: {
    phone: "0949257924",
    phoneDisplay: "0949.257.924",
    zalo: "0949257924",
    zaloUrl: "https://zalo.me/84949257924",
    email: "longnhat712@gmail.com",
    address: "Biên Hòa, Đồng Nai (Toàn Quốc)",
    website: "https://meomeorise.vn"
  },
  socials: [
    { id: "facebook", name: "Facebook", username: "MeoMeoRise", url: "https://www.facebook.com/MeoMeoRise", icon: "facebook", active: true },
    { id: "zalo", name: "Zalo", username: "0949257924", url: "https://zalo.me/84949257924", icon: "zalo", active: true },
    { id: "telegram", name: "Telegram", username: "@meomeorise", url: "https://t.me/meomeorise", icon: "telegram", active: true },
    { id: "tiktok", name: "TikTok", username: "@meomeorise", icon: "tiktok", active: true },
    { id: "youtube", name: "YouTube", username: "MeoMeoRise", url: "https://www.youtube.com", icon: "youtube", active: true }
  ],
  socialGroups: {
    facebookDesc: "Cộng đồng ROK & Chợ mua bán tài khoản",
    zaloDesc: "Box Zalo VIP giao dịch & hỗ trợ 24/7",
    facebookGroups: [
      {
        id: "fb_group_1",
        name: "Cộng Đồng Rise Of Kingdoms Việt Nam",
        desc: "Giao lưu, chia sẻ kinh nghiệm chiến thuật và hỗ trợ tân thủ ROK",
        members: "55.000+ thành viên",
        url: "https://www.facebook.com/groups/MeoMeoRise",
        icon: "https://www.google.com/s2/favicons?domain=facebook.com&sz=128"
      },
      {
        id: "fb_group_2",
        name: "Chợ Mua Bán Acc ROK Uy Tín (Admin Meo Meo)",
        desc: "Đăng tin mua bán acc, định giá tài khoản an toàn 24/7",
        members: "28.000+ thành viên",
        url: "https://www.facebook.com/groups/MeoMeoRise",
        icon: "https://www.google.com/s2/favicons?domain=facebook.com&sz=128"
      }
    ],
    zaloGroups: [
      {
        id: "zl_group_1",
        name: "Box Zalo Giao Dịch ROK VIP 1",
        desc: "Cập nhật tài khoản xả lỗ, giá tốt hằng ngày",
        members: "1.000 thành viên (Đầy)",
        url: "https://zalo.me/84949257924",
        icon: "https://www.google.com/s2/favicons?domain=zalo.me&sz=128"
      },
      {
        id: "zl_group_2",
        name: "Box Zalo Giao Dịch & Hỗ Trợ ROK VIP 2",
        desc: "Hỗ trợ định giá acc, trung gian giao dịch bảo hiểm 100%",
        members: "850 thành viên",
        url: "https://zalo.me/84949257924",
        icon: "https://www.google.com/s2/favicons?domain=zalo.me&sz=128"
      }
    ]
  },
  banks: [
    {
      id: "mbbank",
      bankName: "Ngân hàng Quân Đội (MB Bank)",
      bankCode: "MB",
      accountNumber: "34568888668888",
      accountHolder: "DO LONG NHAT",
      qrUrl: "https://api.vietqr.io/image/970422-34568888668888-compact.jpg?accountName=DO%20LONG%20NHAT",
      logoType: "mb",
      logoImg: "icon/mb.jpg"
    },
    {
      id: "vib",
      bankName: "Ngân hàng Quốc Tế VIB",
      bankCode: "VIB",
      accountNumber: "014473397",
      accountHolder: "ĐỖ LONG NHẬT",
      qrUrl: "https://api.vietqr.io/image/970441-014473397-compact.jpg?accountName=DO%20LONG%20NHAT",
      logoType: "vib",
      logoImg: "icon/vib.webp"
    },
    {
      id: "momo",
      bankName: "Ví Điện Tử MoMo",
      bankCode: "MOMO",
      accountNumber: "0949257924",
      accountHolder: "ĐỖ LONG NHẬT",
      qrUrl: "media/momo.png",
      momoUrl: "https://nhantien.momo.vn/0949257924",
      logoType: "momo",
      logoImg: "icon/momo.webp"
    }
  ],
  systemChannels: {
    title: "Hệ Thống Kênh & Cộng Đồng",
    description: "Các kênh truyền thông chính thức và box cộng đồng Rise of Kingdoms.",
    channels: [
      { name: "Box Zalo Giao Dịch ROK VIP", desc: "Thảo luận mua bán, trao đổi tài khoản uy tín", url: "https://zalo.me/84949257924", badge: "VIP" },
      { name: "Fanpage Facebook Chính Thức", desc: "Cập nhật tin tức vương quốc, sự kiện quà tặng", url: "https://www.facebook.com/MeoMeoRise", badge: "Official" },
      { name: "Kênh Telegram Báo Giá Acc", desc: "Nhận thông báo tài khoản xả lỗ, giá tốt tức thì", url: "https://t.me/meomeorise", badge: "24/7" }
    ]
  },
  footer: {
    sloganTitle: "Rise Of KingDoms - Uy Tín Tạo Nên Thương Hiệu",
    aboutText: "- Trung Gian Giao Dịch\n- Phát Triển Cộng Đồng Rok\n- Tư Vấn Mọi Chức Năng Game Rok",
    copyrightYear: 2026,
    copyrightText: "Rise Of KingDoms Services. All Rights Reserved."
  }
};

// Gán vào window để đảm bảo tương thích mọi ngữ cảnh trình duyệt
if (typeof window !== "undefined") {
  window.profileConfig = profileConfig;
}

// Hỗ trợ môi trường Module/NodeJS nếu cần
if (typeof module !== "undefined" && module.exports) {
  module.exports = { profileConfig };
}
