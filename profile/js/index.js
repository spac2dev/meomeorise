/**
 * RISE OF KINGDOMS - VIP SERVICES & COMMUNITY
 * Javascript Logic Tối Ưu Cho Cả PC & Mobile
 * Micro-animations Nhẹ Nhàng, Hiện Đại, Hiệu Năng Cao
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Nạp & Render toàn bộ dữ liệu động từ list.js (profileConfig)
  renderProfileFromConfig();

  // 1. Quản lý Theme (Sáng: Vàng Trắng / Tối: Vàng Obsidian) với SVG
  initThemeManager();

  // 2. Chuyển đổi Tabs & Hiệu ứng chuyển động mượt mà
  initTabsManager();

  // 3. Sao chép thông tin (Copy to Clipboard) với Micro-Feedback Checkmark
  initCopyActions();

  // 4. Modal QR Ngân Hàng
  initQrModal();

  // 5. Scroll to top & Header Scroll Thông Minh
  initScrollActions();

  // 6. Cập nhật năm bản quyền tự động
  initDynamicYear();
});

/* ===================================================
   1. QUẢN LÝ THEME (LIGHT / DARK) BẰNG SVG THUẦN
   =================================================== */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const currentTheme = localStorage.getItem('rok_theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('rok_theme', nextTheme);
    updateThemeIcon(nextTheme);
    showToast(`Đã chuyển sang nền ${nextTheme === 'dark' ? 'Hoàng Kim Tối' : 'Vàng Trắng Tinh Khiết'}`);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      // SVG Mặt Trời Hoàng Kim
      themeToggleBtn.innerHTML = `
        <svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Chuyển sang nền Vàng Trắng');
    } else {
      // SVG Mặt Trăng Lưỡi Liềm
      themeToggleBtn.innerHTML = `
        <svg class="svg-icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute('title', 'Chuyển sang nền Hoàng Kim Tối');
    }
  }
}

/* ===================================================
   2. QUẢN LÝ TABS NỘI DUNG VỚI HIỆU ỨNG MƯỢT
   =================================================== */
function initTabsManager() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(targetId) {
    if (!targetId) return;
    const cleanId = targetId.replace('#', '');
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${cleanId}"]`);
    const targetPane = document.getElementById(cleanId);

    if (targetBtn && targetPane) {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach(p => p.classList.remove('active'));

      targetBtn.classList.add('active');
      targetBtn.setAttribute('aria-selected', 'true');
      
      // Kích hoạt lại animation để tab luôn có hiệu ứng êm ái
      targetPane.classList.add('active');
      targetPane.style.animation = 'none';
      targetPane.offsetHeight; // force reflow
      targetPane.style.animation = '';
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      switchTab(targetId);

      // Nếu người dùng đang cuộn dở trên mobile, cuộn nhẹ về đầu phần nội dung tab
      if (window.innerWidth <= 768) {
        const tabsNav = document.querySelector('.nav-tabs');
        if (tabsNav) {
          const rect = tabsNav.getBoundingClientRect();
          if (rect.top < 60) {
            window.scrollTo({
              top: window.scrollY + rect.top - 70,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });

  // Hỗ trợ click từ các liên kết có hash (như footer)
  document.querySelectorAll('a[href^="#tab-"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (hash) {
        e.preventDefault();
        switchTab(hash);
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs) {
          navTabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ===================================================
   3. SAO CHÉP THÔNG TIN VỚI MICRO-FEEDBACK TỨC THÌ
   =================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  // Icon SVG Checkmark xanh lục bảo ngọc sắc nét
  toast.innerHTML = `
    <svg class="svg-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function initCopyActions() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    // Lưu lại icon SVG gốc
    btn.dataset.originalSvg = btn.innerHTML;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const content = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'thông tin';

      if (!content) return;

      const triggerSuccessFeedback = () => {
        showToast(`Đã sao chép ${label}: ${content}`);

        // Micro-feedback checkmark ngay trên nút bấm
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        clearTimeout(btn._resetTimer);
        btn._resetTimer = setTimeout(() => {
          btn.innerHTML = btn.dataset.originalSvg;
          btn.classList.remove('copied');
        }, 1400);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(content)
          .then(triggerSuccessFeedback)
          .catch(() => fallbackCopy(content, label, triggerSuccessFeedback));
      } else {
        fallbackCopy(content, label, triggerSuccessFeedback);
      }
    });
  });

  function fallbackCopy(text, label, callback) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.left = '-9999px';
    tempInput.style.top = '-9999px';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
      document.execCommand('copy');
      if (typeof callback === 'function') {
        callback();
      } else {
        showToast(`Đã sao chép ${label}: ${text}`);
      }
    } catch (err) {
      showToast('Không thể tự động sao chép!');
    }
    document.body.removeChild(tempInput);
  }
}

/* ===================================================
   4. MODAL XEM MÃ QR THANH TOÁN
   =================================================== */
function initQrModal() {
  const modal = document.getElementById('qrModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBankTitle = document.getElementById('modalBankTitle');
  const modalQrImg = document.getElementById('modalQrImg');

  if (!modal) return;

  document.querySelectorAll('[data-qr-open]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const qrUrl = btn.getAttribute('data-qr-img');
      const bankName = btn.getAttribute('data-bank-name') || 'Mã QR Ngân Hàng';

      if (modalBankTitle) modalBankTitle.textContent = bankName;
      if (modalQrImg && qrUrl) modalQrImg.src = qrUrl;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================
   5. NÚT CUỘN LÊN ĐẦU TRANG & HEADER SCROLL THÔNG MINH
   =================================================== */
function initScrollActions() {
  const scrollBtn = document.getElementById('scrollToTopBtn');
  const header = document.querySelector('.site-header');

  let lastScrollY = window.scrollY;
  let stopScrollTimer = null;
  let isTicking = false;

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  function handleScroll() {
    const currentScrollY = window.scrollY;

    // 1. Quản lý nút Scroll To Top
    if (scrollBtn) {
      if (currentScrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    }

    // 2. Quản lý Header ẩn/hiện thông minh
    if (!header) return;

    if (currentScrollY <= 30) {
      // Đang ở sát đỉnh trang: luôn hiện trạng thái nguyên bản
      header.classList.remove('header-hidden');
      header.classList.remove('header-scrolled');
    } else {
      header.classList.add('header-scrolled');

      // Cuộn xuống -> Ẩn header để tối đa không gian đọc
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        header.classList.add('header-hidden');
      } 
      // Cuộn ngược lên -> Hiện header ngay lập tức
      else if (currentScrollY < lastScrollY) {
        header.classList.remove('header-hidden');
      }
    }

    lastScrollY = currentScrollY;

    // 3. Khi dừng cuộn: nhẹ nhàng hiện lại header
    clearTimeout(stopScrollTimer);
    stopScrollTimer = setTimeout(() => {
      if (header) {
        header.classList.remove('header-hidden');
      }
    }, 700);
  }

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ===================================================
   6. CẬP NHẬT NĂM BẢN QUYỀN TỰ ĐỘNG
   =================================================== */
function initDynamicYear() {
  const footerYear = document.getElementById('footerYear');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
}

/* ===================================================
   7. RENDER TOÀN BỘ DỮ LIỆU ĐỘNG TỪ list.js (profileConfig)
   =================================================== */
function renderProfileFromConfig() {
  // Lấy dữ liệu profileConfig từ window (đã được import từ list.js)
  const cfg = (typeof window !== "undefined" && window.profileConfig) ? window.profileConfig : null;
  if (!cfg) return;

  // 1. Tiêu đề trang & Meta Title
  if (cfg.brand) {
    if (cfg.brand.title) {
      document.title = `${cfg.brand.title} - ${cfg.brand.slogan || "Trung Gian Giao Dịch & Dịch Vụ ROK Uy Tín"}`;
    }

    // Logo & Tên thương hiệu trên Header
    const brandTitleEl = document.querySelector('.brand-title');
    if (brandTitleEl && cfg.brand.title) {
      brandTitleEl.innerHTML = `
        ${escapeHtml(cfg.brand.title)}
        ${cfg.brand.verified ? `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color:var(--gold-500);" aria-hidden="true">
            <path d="M12 2l2.4 2.9 3.7-.4 1.3 3.5 3.5 1.4-.4 3.7 2.4 2.9-2.4 2.9.4 3.7-3.5 1.4-1.3 3.5-3.7-.4L12 22l-2.4-2.9-3.7.4-1.3-3.5-3.5-1.4.4-3.7-2.4-2.9 2.4-2.9-.4-3.7 3.5-1.4 1.3-3.5 3.7.4L12 2z"/>
            <path d="M9.5 12.5l2 2 4.5-4.5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        ` : ''}
      `;
    }

    // Logo trên Header
    const brandLogoImg = document.querySelector('.brand-logo-img');
    if (brandLogoImg && cfg.brand.logo) {
      brandLogoImg.src = cfg.brand.logo;
    }

    // Sidebar: Avatar
    const sidebarAvatarImg = document.querySelector('.sidebar-avatar-img');
    if (sidebarAvatarImg && cfg.brand.avatar) {
      sidebarAvatarImg.src = cfg.brand.avatar;
    }

    // Sidebar: Tên người dùng & Tích xanh
    const profileUserNameEl = document.querySelector('.profile-user-name');
    if (profileUserNameEl && cfg.brand.name) {
      profileUserNameEl.innerHTML = `
        <span>${escapeHtml(cfg.brand.name)}</span>
        ${cfg.brand.verified ? `
          <span class="verified-check-badge" title="Tài khoản đã xác minh chính chủ 100%">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284c7">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z"/>
            </svg>
          </span>
        ` : ''}
      `;
    }

    // Sidebar: Website tag
    const profileTagEl = document.querySelector('.profile-username-tag');
    if (profileTagEl) {
      profileTagEl.textContent = cfg.brand.websiteName || "MEOMEORISE.VN";
      if (cfg.brand.websiteUrl) profileTagEl.href = cfg.brand.websiteUrl;
    }
  }

  // 2. Sidebar: Lĩnh vực / Dịch vụ (Tech Badges)
  if (Array.isArray(cfg.services) && cfg.services.length > 0) {
    const badgesContainer = document.querySelector('.sidebar-tech-badges');
    if (badgesContainer) {
      badgesContainer.innerHTML = cfg.services.map(s => `
        <div class="tech-badge-item" title="${escapeHtml(s.desc || s.title)}">
          <span class="badge-icon">
            ${getServiceSvgIcon(s.icon)}
          </span>
          <span class="badge-text">${escapeHtml(s.title)}</span>
        </div>
      `).join('');
    }
  }

  // 3. Header CTA & Floating Buttons
  if (cfg.contact) {
    const zaloLink = cfg.contact.zaloUrl || `https://zalo.me/${cfg.contact.zalo || '84949257924'}`;
    const phoneDisplay = cfg.contact.phoneDisplay || cfg.contact.phone || '0949.257.924';
    const phoneRaw = cfg.contact.phone || '0949257924';

    // Header CTA
    const headerCta = document.querySelector('.header-cta-btn');
    if (headerCta) {
      headerCta.href = zaloLink;
      const fullText = headerCta.querySelector('.cta-text-full');
      if (fullText) fullText.textContent = `Zalo: ${phoneDisplay}`;
    }

    // Floating Zalo & Hotline
    const floatZalo = document.querySelector('.float-zalo');
    if (floatZalo) floatZalo.href = zaloLink;

    const floatPhone = document.querySelector('.float-phone');
    if (floatPhone) floatPhone.href = `tel:${phoneRaw}`;
  }

  // 4. Sidebar: Kênh liên hệ nhanh (Quick Socials)
  if (Array.isArray(cfg.socials)) {
    const quickSocialsEl = document.querySelector('.sidebar-quick-socials');
    if (quickSocialsEl) {
      const activeSocials = cfg.socials.filter(s => s.active !== false);
      quickSocialsEl.innerHTML = activeSocials.slice(0, 4).map(s => `
        <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" class="sidebar-social-btn" title="${escapeHtml(s.name)}: ${escapeHtml(s.username || '')}">
          ${getSocialSvgIcon(s.icon || s.id)}
        </a>
      `).join('');
    }
  }

  // 5. TAB 1: THÔNG TIN LIÊN HỆ
  if (cfg.contact) {
    const contactListEl = document.querySelector('.clean-contact-list');
    if (contactListEl) {
      const pRaw = cfg.contact.phone || '0949257924';
      const pDisp = cfg.contact.phoneDisplay || pRaw;
      const email = cfg.contact.email || 'longnhat712@gmail.com';
      const address = cfg.contact.address || 'Biên Hòa, Đồng Nai (Toàn Quốc)';
      const website = cfg.contact.website || 'https://meomeorise.vn';
      const webDisplay = website.replace(/^https?:\/\//i, '').replace(/\/$/, '');

      contactListEl.innerHTML = `
        <!-- Số điện thoại -->
        <div class="clean-pill-row">
          <a href="tel:${escapeHtml(pRaw)}" class="pill-row-left" title="Bấm để gọi: ${escapeHtml(pDisp)}">
            <span class="pill-icon pill-phone">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </span>
            <span class="pill-text">${escapeHtml(pDisp)}</span>
          </a>
          <button type="button" class="clean-copy-btn" data-copy="${escapeHtml(pRaw)}" data-label="Số điện thoại" title="Sao chép số">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <!-- Email -->
        <div class="clean-pill-row">
          <a href="mailto:${escapeHtml(email)}" class="pill-row-left" title="Gửi email: ${escapeHtml(email)}">
            <span class="pill-icon pill-mail">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </span>
            <span class="pill-text">${escapeHtml(email)}</span>
          </a>
          <button type="button" class="clean-copy-btn" data-copy="${escapeHtml(email)}" data-label="Email" title="Sao chép email">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>

        <!-- Địa chỉ -->
        <div class="clean-pill-row">
          <div class="pill-row-left">
            <span class="pill-icon pill-loc">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </span>
            <span class="pill-text">${escapeHtml(address)}</span>
          </div>
        </div>

        <!-- Website -->
        <div class="clean-pill-row">
          <a href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer" class="pill-row-left" title="Website chính thức">
            <span class="pill-icon pill-web">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </span>
            <span class="pill-text">${escapeHtml(webDisplay)}</span>
          </a>
          <button type="button" class="clean-copy-btn" data-copy="${escapeHtml(website)}" data-label="Link Website" title="Sao chép link web">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      `;
    }
  }

  // 6. TAB 1: MẠNG XÃ HỘI (PHÂN THÀNH 2 MỤC: NHÓM FACEBOOK & NHÓM ZALO)
  const fbGroups = (cfg.socialGroups && Array.isArray(cfg.socialGroups.facebookGroups)) ? cfg.socialGroups.facebookGroups : [];
  const fbContainer = document.getElementById('facebookGroupsContainer');
  if (fbContainer) {
    if (fbGroups.length > 0) {
      fbContainer.innerHTML = fbGroups.map(g => {
        const iconUrl = g.icon || 'https://www.google.com/s2/favicons?domain=facebook.com&sz=128';
        return `
        <div class="transfer-item-row" style="background: #ffffff; border-color: rgba(24, 119, 242, 0.2); box-shadow: 0 4px 14px rgba(24, 119, 242, 0.06); transition: all 0.25s ease;">
          <div class="transfer-bank-logo" style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #f0f6ff, #e5edff); border: 1.5px solid rgba(24, 119, 242, 0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(24, 119, 242, 0.12);">
            <img src="${escapeHtml(iconUrl)}" alt="Facebook Group" style="width: 32px; height: 32px; border-radius: 8px; object-fit: contain;" onerror="this.onerror=null;this.src='https://www.facebook.com/favicon.ico'">
          </div>
          <div class="transfer-item-content">
            <span class="transfer-holder-name" style="font-size: 0.95rem; text-transform: none; color: var(--text-main); font-weight: 800;">${escapeHtml(g.name)}</span>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap;">
              <span class="transfer-bank-label" style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(g.desc || '')}</span>
              ${g.members ? `<span style="font-size: 0.72rem; font-weight: 700; color: #1877f2; background: rgba(24, 119, 242, 0.1); padding: 2px 8px; border-radius: 9999px;">${escapeHtml(g.members)}</span>` : ''}
            </div>
          </div>
          <div class="transfer-item-actions">
            <a href="${escapeHtml(g.url)}" target="_blank" rel="noopener noreferrer" class="btn-updating-contact" style="padding: 8px 18px; font-size: 0.84rem; font-weight: 700; background: #1877f2; color: #fff; text-decoration: none; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 3px 10px rgba(24, 119, 242, 0.3); transition: transform 0.2s, box-shadow 0.2s;">
              <span>Tham gia</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        </div>
      `;
      }).join('');
    } else {
      fbContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 14px;">Chưa có nhóm Facebook nào được thêm.</div>`;
    }
  }

  const zlGroups = (cfg.socialGroups && Array.isArray(cfg.socialGroups.zaloGroups)) ? cfg.socialGroups.zaloGroups : [];
  const zlContainer = document.getElementById('zaloGroupsContainer');
  if (zlContainer) {
    if (zlGroups.length > 0) {
      zlContainer.innerHTML = zlGroups.map(g => {
        const iconUrl = g.icon || 'https://www.google.com/s2/favicons?domain=zalo.me&sz=128';
        return `
        <div class="transfer-item-row" style="background: #ffffff; border-color: rgba(0, 104, 255, 0.2); box-shadow: 0 4px 14px rgba(0, 104, 255, 0.06); transition: all 0.25s ease;">
          <div class="transfer-bank-logo" style="width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #f0f7ff, #e5f1ff); border: 1.5px solid rgba(0, 104, 255, 0.2); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0, 104, 255, 0.12);">
            <img src="${escapeHtml(iconUrl)}" alt="Zalo Group" style="width: 32px; height: 32px; border-radius: 8px; object-fit: contain;" onerror="this.onerror=null;this.src='https://zalo.me/favicon.ico'">
          </div>
          <div class="transfer-item-content">
            <span class="transfer-holder-name" style="font-size: 0.95rem; text-transform: none; color: var(--text-main); font-weight: 800;">${escapeHtml(g.name)}</span>
            <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px; flex-wrap: wrap;">
              <span class="transfer-bank-label" style="font-size: 0.82rem; color: var(--text-muted);">${escapeHtml(g.desc || '')}</span>
              ${g.members ? `<span style="font-size: 0.72rem; font-weight: 700; color: #0068ff; background: rgba(0, 104, 255, 0.1); padding: 2px 8px; border-radius: 9999px;">${escapeHtml(g.members)}</span>` : ''}
            </div>
          </div>
          <div class="transfer-item-actions">
            <a href="${escapeHtml(g.url)}" target="_blank" rel="noopener noreferrer" class="btn-updating-contact" style="padding: 8px 18px; font-size: 0.84rem; font-weight: 700; background: #0068ff; color: #fff; text-decoration: none; border-radius: 9999px; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 3px 10px rgba(0, 104, 255, 0.3); transition: transform 0.2s, box-shadow 0.2s;">
              <span>Vào box</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </a>
          </div>
        </div>
      `;
      }).join('');
    } else {
      zlContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 14px;">Chưa có nhóm Zalo nào được thêm.</div>`;
    }
  }

  // 7. TAB 2: THÔNG TIN CHUYỂN KHOẢN (NGÂN HÀNG & QR CODE)
  if (Array.isArray(cfg.banks) && cfg.banks.length > 0) {
    const transferListEl = document.getElementById('bankingAccountsContainer') || document.querySelector('#tab-banking .transfer-accounts-list');
    if (transferListEl) {
      transferListEl.innerHTML = cfg.banks.map(b => {
        const qrUrl = b.qrUrl || `https://api.vietqr.io/image/${b.bankCode || '970422'}-${b.accountNumber}-compact.jpg?accountName=${encodeURIComponent(b.accountHolder || '')}`;
        return `
          <div class="transfer-item-row">
            <div class="transfer-bank-logo">
              ${getBankLogoSvg(b.logoType || b.bankCode, b.bankName)}
            </div>

            <div class="transfer-item-content">
              <span class="transfer-holder-name">${escapeHtml(b.accountHolder || '')}</span>
              <span class="transfer-account-num">${escapeHtml(b.accountNumber || '')}</span>
              <span class="transfer-bank-label">${escapeHtml(b.bankName || '')}</span>
            </div>

            <div class="transfer-item-actions">
              <button type="button" 
                      class="transfer-action-btn qr-btn" 
                      data-qr-open 
                      data-bank-name="${escapeHtml(b.bankName || '')} - ${escapeHtml(b.accountHolder || '')}" 
                      data-qr-img="${escapeHtml(qrUrl)}"
                      title="Xem Mã QR Chuyển Khoản"
                      aria-label="Mở mã QR ngân hàng ${escapeHtml(b.bankName || '')}">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.5" y="2.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                  <rect x="4.75" y="4.75" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
                  <rect x="14.5" y="2.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                  <rect x="16.75" y="4.75" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
                  <rect x="2.5" y="14.5" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="2"/>
                  <rect x="4.75" y="16.75" width="2.5" height="2.5" rx="0.5" fill="currentColor"/>
                  <rect x="14.5" y="14.5" width="2.5" height="2.5" rx="0.4" fill="currentColor"/>
                  <rect x="19" y="14.5" width="2.5" height="2.5" rx="0.4" fill="currentColor"/>
                  <rect x="14.5" y="19" width="2.5" height="2.5" rx="0.4" fill="currentColor"/>
                  <rect x="19" y="19" width="2.5" height="2.5" rx="0.4" fill="currentColor"/>
                  <rect x="11" y="4" width="1.5" height="4" rx="0.4" fill="currentColor"/>
                  <rect x="4" y="11" width="4" height="1.5" rx="0.4" fill="currentColor"/>
                  <rect x="10.5" y="10.5" width="3" height="3" rx="0.5" fill="currentColor"/>
                </svg>
              </button>

              <button type="button" 
                      class="transfer-action-btn" 
                      data-copy="${escapeHtml(b.accountNumber || '')}" 
                      data-label="STK ${escapeHtml(b.bankCode || b.bankName || '')}" 
                      title="Sao chép số tài khoản">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 8. TAB 3: HỆ THỐNG / CỘNG ĐỒNG
  const tabSocialPane = document.getElementById('tab-social');
  if (tabSocialPane && cfg.systemChannels) {
    const channels = cfg.systemChannels.channels || [];
    if (channels.length > 0) {
      tabSocialPane.innerHTML = `
        <div class="clean-banking-container">
          <div class="clean-box-header" style="margin-bottom: 20px;">
            <span class="clean-header-icon" style="background:#0284c7; color:#fff;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </span>
            <h3>${escapeHtml(cfg.systemChannels.title || "Hệ Thống Kênh & Cộng Đồng")}</h3>
          </div>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom: 16px;">${escapeHtml(cfg.systemChannels.description || '')}</p>

          <div class="transfer-accounts-list">
            ${channels.map(c => `
              <div class="transfer-item-row">
                <div class="transfer-bank-logo">
                  <div style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #0284c7, #0369a1); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px;">
                    ${escapeHtml(c.badge || 'VIP')}
                  </div>
                </div>

                <div class="transfer-item-content">
                  <span class="transfer-holder-name">${escapeHtml(c.name)}</span>
                  <span class="transfer-bank-label" style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(c.desc || '')}</span>
                </div>

                <div class="transfer-item-actions">
                  <a href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer" class="btn-updating-contact" style="padding: 8px 18px; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                    <span>${escapeHtml(c.buttonText || 'Tham gia')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // 9. FOOTER
  if (cfg.footer) {
    const footerBrandH4 = document.querySelector('.footer-brand h4');
    if (footerBrandH4 && cfg.footer.sloganTitle) footerBrandH4.textContent = cfg.footer.sloganTitle;

    const footerBrandP = document.querySelector('.footer-brand p');
    if (footerBrandP && cfg.footer.aboutText) footerBrandP.textContent = cfg.footer.aboutText;
  }

  if (cfg.contact) {
    const footerContact = document.querySelector('.footer-contact');
    if (footerContact) {
      footerContact.innerHTML = `
        <h5>Liên Hệ Nhanh</h5>
        <p>
          <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Hotline: ${escapeHtml(cfg.contact.phoneDisplay || cfg.contact.phone || '0949.257.924')}
        </p>
        <p>
          <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          ${escapeHtml(cfg.contact.email || 'longnhat712@gmail.com')}
        </p>
        <p>
          <svg class="svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Zalo: ${escapeHtml(cfg.contact.zalo || '0949257924')}
        </p>
      `;
    }
  }

  // Cập nhật Modal QR title
  const modalBankTitle = document.getElementById('modalBankTitle');
  if (modalBankTitle && cfg.banks && cfg.banks.length > 0) {
    const firstBank = cfg.banks[0];
    const qrHolder = document.querySelector('#qrModal [style*="font-weight:700"]');
    if (qrHolder && firstBank.accountHolder) {
      qrHolder.textContent = `Chủ tài khoản: ${firstBank.accountHolder}`;
    }
  }
}

// Helpers render icon SVG
function getServiceSvgIcon(iconType) {
  const t = (iconType || '').toLowerCase();
  if (t === 'users' || t.includes('cộng đồng')) {
    return `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    `;
  }
  if (t === 'message' || t.includes('tư vấn')) {
    return `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
        <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
      </svg>
    `;
  }
  if (t === 'star' || t.includes('sao')) {
    return `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;
  }
  // Mặc định: Shield / Trung gian
  return `
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  `;
}

function getSocialSvgIcon(id) {
  const s = (id || '').toLowerCase();
  if (s.includes('facebook') || s === 'fb') {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877f2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    `;
  }
  if (s.includes('zalo')) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#0068ff">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    `;
  }
  if (s.includes('telegram')) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#229ed9">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
      </svg>
    `;
  }
  if (s.includes('tiktok')) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.12V9.38a6.34 6.34 0 0 0-.84-.06A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 9.18 5.61v-7.14a8.27 8.27 0 0 0 5.17 1.83v-3.47a4.84 4.84 0 0 1 2.24-.8v-5z"/>
      </svg>
    `;
  }
  if (s.includes('youtube')) {
    return `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    `;
  }
  // Mặc định: icon liên kết
  return `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  `;
}

function getBankLogoSvg(logoType, bankName) {
  const t = (logoType || bankName || '').toLowerCase();
  if (t.includes('mbv')) {
    return `
      <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#b91c1c"/>
        <text x="18" y="62" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff">MBV</text>
        <polygon points="80,40 83,48 91,48 85,53 87,61 80,56 73,61 75,53 69,48 77,48" fill="#facc15"/>
      </svg>
    `;
  }
  if (t.includes('mb') || t.includes('quân đội')) {
    return `
      <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#002d72"/>
        <path d="M50 18L54.5 32H69L57.5 40.5L61.8 54.5L50 46L38.2 54.5L42.5 40.5L31 32H45.5L50 18Z" fill="#e30613"/>
        <path d="M26 68L36 68L44 80L52 68L62 68L47 88L41 88L26 68Z" fill="#ffffff"/>
      </svg>
    `;
  }
  if (t.includes('vcb') || t.includes('vietcombank')) {
    return `
      <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#005a3c"/>
        <text x="16" y="62" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#78be20">VCB</text>
      </svg>
    `;
  }
  if (t.includes('techcombank') || t.includes('tcb')) {
    return `
      <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#e31837"/>
        <text x="18" y="62" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#ffffff">TCB</text>
      </svg>
    `;
  }
  // Mặc định: Bank icon thẻ thanh toán màu xanh biển
  return `
    <svg width="52" height="52" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="#0284c7"/>
      <rect x="20" y="30" width="60" height="40" rx="8" stroke="#ffffff" stroke-width="5"/>
      <line x1="20" y1="44" x2="80" y2="44" stroke="#ffffff" stroke-width="5"/>
      <rect x="30" y="54" width="16" height="8" rx="2" fill="#ffffff"/>
    </svg>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

