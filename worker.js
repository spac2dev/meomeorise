/**
 * ==============================================================================
 * CLOUDFLARE WORKER DÀNH CHO PROFILE & SEO ADMIN CMS
 * Tự động cập nhật trực tiếp cấu hình Profile, Thẻ SEO, OpenGraph & Social Cards
 * lên file index.html trên GitHub (Mô hình SSG - Tối ưu 100% SEO & Preview MXH)
 * ==============================================================================
 *
 * CÁC BIẾN MÔI TRƯỜNG (Environment Variables) CẦN CÀI ĐẶT TRÊN WORKER NÀY:
 * (Cloudflare Dashboard -> Workers & Pages -> Worker của bạn -> Settings -> Variables)
 *
 * 1. GITHUB_TOKEN : Personal Access Token (classic hoặc fine-grained) có quyền `repo` hoặc `contents:write`
 * 2. REPO_OWNER   : Tên tài khoản hoặc tổ chức GitHub (ví dụ: "spac2dev")
 * 3. REPO_NAME    : Tên kho lưu trữ GitHub (ví dụ: "infomeomeorise")
 * 4. FILE_PATH    : Đường dẫn tới file trang chủ (mặc định: "index.html")
 * 5. BRANCH       : Tên nhánh cần commit (mặc định: "main")
 * 6. ADMIN_SECRET : (Tùy chọn) Khóa bí mật bảo vệ Worker, CMS cần gửi header `X-Admin-Key`
 *
 * ==============================================================================
 */

// Helper escape an toàn ký tự HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper escape an toàn thuộc tính thẻ HTML
function escapeAttr(str) {
  if (!str) return "";
  return String(str)
    .replace(/"/g, "&quot;")
    .replace(/[\n\r]+/g, " ")
    .trim();
}

// Hàm mã hóa chuỗi UTF-8 (hỗ trợ đầy đủ tiếng Việt có dấu) sang Base64
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Hàm giải mã Base64 sang chuỗi UTF-8
function base64ToUtf8(base64) {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// Headers CORS chuẩn cho mọi response
function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
    "Access-Control-Max-Age": "86400",
  };
}

// Helper trả về JSON có kèm header CORS
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getCorsHeaders(),
    },
  });
}

// Hàm trích xuất cấu hình Profile từ file index.html hoặc list.js
function extractProfileFromContent(contentStr) {
  if (!contentStr) return null;
  try {
    const matchProf = contentStr.match(/var\s+profileConfig\s*=\s*(\{[\s\S]*?\});/);
    if (matchProf) {
      return JSON.parse(matchProf[1]);
    }
  } catch (e) {
    console.error("Lỗi khi parse profileConfig:", e);
  }
  return null;
}

// ==============================================================================
// HÀM CẬP NHẬT TRỰC TIẾP FILE INDEX.HTML VỚI ĐẦY ĐỦ SEO, OPEN GRAPH VÀ EMBED SCRIPT
// ==============================================================================
function updateIndexHtmlWithProfile(html, profile) {
  if (!html || !profile) return html;

  const brandName = profile.brand?.name || "Meo Meo Rise";
  const brandTitle = profile.brand?.title || "Rise Of KingDoms";
  const brandSlogan = profile.brand?.slogan || "Trung Gian Giao Dịch & Dịch Vụ ROK Uy Tín";
  const websiteName = profile.brand?.websiteName || "MEOMEORISE.VN";
  const websiteUrl = profile.brand?.websiteUrl || "https://meomeorise.vn";
  const avatar = profile.brand?.avatar || "icon/icon.jpg";

  const phone = profile.contact?.phone || "0949257924";
  const phoneDisplay = profile.contact?.phoneDisplay || profile.contact?.phone || "0949.257.924";
  const email = profile.contact?.email || "longnhat712@gmail.com";
  const zaloUrl = profile.contact?.zaloUrl || `https://zalo.me/${phone}`;

  const servicesList = Array.isArray(profile.services) && profile.services.length > 0
    ? profile.services.map(s => s.title).join(" - ")
    : "Trung Gian Giao Dịch - Phát Triển Cộng Đồng Rok - Tư Vấn Mọi Chức Năng Game Rok";

  const pageTitle = `${brandTitle} - ${brandSlogan}`;
  const metaDesc = `${brandTitle}: ${servicesList}. SĐT/Zalo: ${phone}. Gmail: ${email}.`;
  const keywords = `${brandTitle}, ROK, ${brandName}, ${servicesList.split(" - ").join(", ")}, ${phone}, ${email}`;

  // 1. Cập nhật thẻ <title>
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);
  }

  // 2. Cập nhật thẻ Meta Description
  if (/<meta\s+name=["']description["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']/i, `<meta name="description" content="${escapeAttr(metaDesc)}"`);
  }

  // 3. Cập nhật thẻ Meta Keywords
  if (/<meta\s+name=["']keywords["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']keywords["']\s+content=["'][^"']*["']/i, `<meta name="keywords" content="${escapeAttr(keywords)}"`);
  }

  // 4. Cập nhật thẻ Meta Author
  if (/<meta\s+name=["']author["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']author["']\s+content=["'][^"']*["']/i, `<meta name="author" content="${escapeAttr(brandTitle + ' Services')}"`);
  }

  // 5. Cập nhật Open Graph (Facebook, Zalo, Telegram...)
  if (/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']/i, `<meta property="og:title" content="${escapeAttr(pageTitle)}"`);
  }
  if (/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']/i, `<meta property="og:description" content="${escapeAttr(metaDesc)}"`);
  }
  if (/<meta\s+property=["']og:image["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:image["']\s+content=["'][^"']*["']/i, `<meta property="og:image" content="${escapeAttr(avatar)}"`);
  } else if (/<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `  <meta property="og:image" content="${escapeAttr(avatar)}">\n</head>`);
  }

  // 6. Cập nhật Twitter Card Meta
  if (/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']/i, `<meta name="twitter:title" content="${escapeAttr(pageTitle)}"`);
  }
  if (/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']/i, `<meta name="twitter:description" content="${escapeAttr(metaDesc)}"`);
  }
  if (/<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:image["']\s+content=["'][^"']*["']/i, `<meta name="twitter:image" content="${escapeAttr(avatar)}"`);
  }

  // 7. Cập nhật giao diện HTML tĩnh ban đầu (Pre-rendered SSR cho crawler bot)
  // Tên thương hiệu trên Header
  const brandTitleRegex = /<span\s+class=["']brand-title["']>([\s\S]*?)<\/span>/i;
  if (brandTitleRegex.test(html)) {
    const verifiedSvg = (profile.brand?.verified !== false) ? `
          <!-- SVG Huy hiệu Verified Vàng -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="color:var(--gold-500);" aria-hidden="true">
            <path d="M12 2l2.4 2.9 3.7-.4 1.3 3.5 3.5 1.4-.4 3.7 2.4 2.9-2.4 2.9.4 3.7-3.5 1.4-1.3 3.5-3.7-.4L12 22l-2.4-2.9-3.7.4-1.3-3.5-3.5-1.4.4-3.7-2.4-2.9 2.4-2.9-.4-3.7 3.5-1.4 1.3-3.5 3.7.4L12 2z"/>
            <path d="M9.5 12.5l2 2 4.5-4.5" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>` : '';
    html = html.replace(brandTitleRegex, `<span class="brand-title">
          ${escapeHtml(brandTitle)}${verifiedSvg}
        </span>`);
  }

  // Tên profile người dùng trên Sidebar
  const profileUserRegex = /<h1\s+class=["']profile-user-name["']>([\s\S]*?)<\/h1>/i;
  if (profileUserRegex.test(html)) {
    const verifiedBadge = (profile.brand?.verified !== false) ? `
            <span class="verified-check-badge" title="Tài khoản đã xác minh chính chủ 100%">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284c7">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.2l-3.5-3.5 1.4-1.4 2.1 2.1 5.3-5.3 1.4 1.4-6.7 6.7z"/>
              </svg>
            </span>` : '';
    html = html.replace(profileUserRegex, `<h1 class="profile-user-name">
            <span>${escapeHtml(brandName)}</span>${verifiedBadge}
          </h1>`);
  }

  // Thẻ liên kết Website
  const profileTagRegex = /<a\s+[^>]*class=["'][^"']*profile-username-tag[^"']*["'][^>]*>([\s\S]*?)<\/a>/i;
  if (profileTagRegex.test(html)) {
    html = html.replace(profileTagRegex, `<a href="${escapeAttr(websiteUrl)}" target="_blank" rel="noopener noreferrer" class="profile-username-tag" title="Truy cập website chính thức: ${escapeAttr(websiteName)}">${escapeHtml(websiteName)}</a>`);
  }

  // Nút liên hệ nhanh trên Header
  const ctaFullRegex = /<span\s+class=["']cta-text-full["']>([\s\S]*?)<\/span>/i;
  if (ctaFullRegex.test(html)) {
    html = html.replace(ctaFullRegex, `<span class="cta-text-full">Zalo: ${escapeHtml(phoneDisplay)}</span>`);
  }
  const ctaBtnRegex = /<a\s+[^>]*class=["'][^"']*header-cta-btn[^"']*["'][^>]*>/i;
  if (ctaBtnRegex.test(html)) {
    html = html.replace(ctaBtnRegex, (match) => {
      return match.replace(/href=["'][^"']*["']/i, `href="${escapeAttr(zaloUrl)}"`);
    });
  }

  // 8. Cập nhật thẻ <script id="profileConfigScript"> chứa profileConfig
  const jsonProfile = JSON.stringify(profile, null, 2);
  const newScriptTag = `  <!-- CẤU HÌNH THÔNG TIN PROFILE (Được quản lý tự động qua Admin CMS & Cloudflare Worker) -->
  <script id="profileConfigScript">
  var profileConfig = ${jsonProfile};

  if (typeof window !== "undefined") {
    window.profileConfig = profileConfig;
  }
  </script>`;

  if (/<script\s+id=["']profileConfigScript["']>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+id=["']profileConfigScript["']>[\s\S]*?<\/script>/i, newScriptTag);
  } else if (/<script>document\.write\(.*list\.js.*\)<\/script>/i.test(html)) {
    html = html.replace(/<script>document\.write\(.*list\.js.*\)<\/script>/i, newScriptTag);
  } else if (/<script\s+src=["']js\/index\.js["']>/i.test(html)) {
    html = html.replace(/<script\s+src=["']js\/index\.js["']>/i, `${newScriptTag}\n\n  <script src="js/index.js">`);
  } else {
    html = html.replace(/<\/body>/i, `${newScriptTag}\n</body>`);
  }

  return html;
}

export default {
  async fetch(request, env, ctx) {
    // 1. Xử lý preflight CORS OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(),
      });
    }

    const url = new URL(request.url);

    // 2. Kiểm tra cấu hình môi trường bắt buộc
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const REPO_OWNER = env.REPO_OWNER;
    const REPO_NAME = env.REPO_NAME;
    const DEFAULT_FILE_PATH = env.FILE_PATH || "index.html";
    const BRANCH = env.BRANCH || "main";
    const ADMIN_SECRET = env.ADMIN_SECRET;

    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return jsonResponse(
        {
          success: false,
          error: "Thiếu biến môi trường Cloudflare Worker Profile!",
          details:
            "Vui lòng vào Settings -> Variables trên Cloudflare Worker để thêm: GITHUB_TOKEN, REPO_OWNER, REPO_NAME.",
          configStatus: {
            hasToken: !!GITHUB_TOKEN,
            hasOwner: !!REPO_OWNER,
            hasRepo: !!REPO_NAME,
            filePath: DEFAULT_FILE_PATH,
            branch: BRANCH,
          },
        },
        500
      );
    }

    // 3. Kiểm tra bảo mật (Nếu có cài ADMIN_SECRET)
    if (ADMIN_SECRET) {
      const clientKey =
        request.headers.get("X-Admin-Key") ||
        request.headers.get("Authorization")?.replace("Bearer ", "");
      if (clientKey !== ADMIN_SECRET) {
        return jsonResponse(
          {
            success: false,
            error: "Không có quyền truy cập (Unauthorized)! Khóa bảo mật Admin không chính xác.",
          },
          401
        );
      }
    }

    // Common GitHub API headers
    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Cloudflare-Worker-Profile-CMS",
    };

    // ========================================================================
    // GET: Kiểm tra kết nối và trích xuất cấu hình Profile từ file index.html trên GitHub
    // ========================================================================
    if (request.method === "GET") {
      const targetPath = url.searchParams.get("path") || DEFAULT_FILE_PATH;
      const getApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}?ref=${BRANCH}`;

      try {
        const ghRes = await fetch(getApiUrl, { headers: githubHeaders });

        if (ghRes.status === 404) {
          return jsonResponse({
            success: true,
            exists: false,
            message: `File ${targetPath} chưa tồn tại trên repo (sẽ được tạo mới khi lưu).`,
            repo: `${REPO_OWNER}/${REPO_NAME}`,
            branch: BRANCH,
          });
        }

        if (!ghRes.ok) {
          const errData = await ghRes.json();
          return jsonResponse(
            {
              success: false,
              error: `Lỗi kết nối GitHub API (${ghRes.status})`,
              details: errData,
            },
            ghRes.status
          );
        }

        const data = await ghRes.json();
        const contentStr = data.content ? base64ToUtf8(data.content) : "";

        // Trích xuất profileConfig
        const parsedProfile = extractProfileFromContent(contentStr);

        const resPayload = {
          success: true,
          exists: true,
          sha: data.sha,
          filePath: targetPath,
          repo: `${REPO_OWNER}/${REPO_NAME}`,
          branch: BRANCH,
          profile: parsedProfile,
        };

        if (url.searchParams.get("includeContent") === "true") {
          resPayload.content = contentStr;
        }

        return jsonResponse(resPayload);
      } catch (err) {
        return jsonResponse(
          { success: false, error: err.message || "Lỗi ngoại lệ khi kết nối GitHub" },
          500
        );
      }
    }

    // ========================================================================
    // POST: Cập nhật trực tiếp Profile & SEO lên file index.html trên GitHub
    // ========================================================================
    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return jsonResponse({ success: false, error: "Dữ liệu JSON không hợp lệ!" }, 400);
      }

      const commitMessage = body.message || `Profile CMS: update SEO & profile in index.html (${body.profile?.brand?.name || 'Meo Meo Rise'})`;
      const targetPath = body.filePath || DEFAULT_FILE_PATH || "index.html";

      try {
        // Bước 1: Lấy nội dung file và mã SHA hiện tại của index.html trên GitHub
        const getApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}?ref=${BRANCH}`;
        const getRes = await fetch(getApiUrl, { headers: githubHeaders });

        let currentSha = null;
        let currentContentStr = "";

        if (getRes.ok) {
          const fileData = await getRes.json();
          currentSha = fileData.sha;
          currentContentStr = fileData.content ? base64ToUtf8(fileData.content) : "";
        }

        // Bước 2: Cập nhật nội dung HTML với Profile & Thẻ SEO
        let finalContent = "";
        if (typeof body.content === "string" && body.content.trim()) {
          finalContent = body.content;
        } else if (body.profile && typeof body.profile === "object") {
          if (!currentContentStr) {
            return jsonResponse(
              {
                success: false,
                error: `Không tìm thấy nội dung file gốc ${targetPath} trên GitHub để cập nhật SEO!`,
              },
              404
            );
          }
          finalContent = updateIndexHtmlWithProfile(currentContentStr, body.profile);
        } else {
          return jsonResponse(
            {
              success: false,
              error: "Dữ liệu gửi lên thiếu 'profile' hoặc 'content' hợp lệ!",
            },
            400
          );
        }

        // Bước 3: Mã hóa Base64 và commit file lên GitHub (Ghi đè index.html với SHA mới)
        const base64Content = utf8ToBase64(finalContent);
        const putPayload = {
          message: commitMessage,
          content: base64Content,
          branch: BRANCH,
        };

        if (currentSha) {
          putPayload.sha = currentSha;
        }

        const putApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}`;
        const putRes = await fetch(putApiUrl, {
          method: "PUT",
          headers: {
            ...githubHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(putPayload),
        });

        const putData = await putRes.json();

        if (!putRes.ok) {
          return jsonResponse(
            {
              success: false,
              status: putRes.status,
              error: putData.message || (putRes.status === 404 ? "Không tìm thấy repository hoặc đường dẫn file" : "Không thể commit file lên GitHub"),
              details: putData,
              repo: `${REPO_OWNER}/${REPO_NAME}`,
              filePath: targetPath,
            },
            putRes.status
          );
        }

        return jsonResponse({
          success: true,
          message: "Cập nhật thành công cấu hình Profile & SEO vào index.html trên GitHub!",
          repo: `${REPO_OWNER}/${REPO_NAME}`,
          branch: BRANCH,
          filePath: targetPath,
          sha: putData.content?.sha,
          commitSha: putData.commit?.sha,
          commitUrl: putData.commit?.html_url,
          notice: "Đã cập nhật file index.html! Bot Google & mạng xã hội (Facebook, Zalo) sẽ nhận dữ liệu SEO và hình ảnh chia sẻ mới sau 1-3 phút.",
        });
      } catch (err) {
        return jsonResponse(
          {
            success: false,
            error: err.message || "Lỗi máy chủ trong quá trình gửi yêu cầu lên GitHub",
          },
          500
        );
      }
    }

    return jsonResponse({ success: false, error: "Method Not Allowed" }, 405);
  },
};
