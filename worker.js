/**
 * ==============================================================================
 * CLOUDFLARE WORKER - EDGE-SSG CMS MIDDLEWARE (WONTRADE ROK)
 * Kiến trúc Core: Edge-SSG (Tráo Code HTML Trực Tiếp Vào File index.html Qua GitHub API)
 * Chuẩn 100% SEO Google, OpenGraph Zalo & Facebook, Tốc độ tải trang tức thì!
 * ==============================================================================
 *
 * CÁC BIẾN MÔI TRƯỜNG (Environment Variables) CẦN CÀI ĐẶT TRÊN CLOUDFLARE WORKER:
 * (Vào Cloudflare Dashboard -> Workers & Pages -> Worker của bạn -> Settings -> Variables)
 *
 * 1. GITHUB_TOKEN : Personal Access Token (classic hoặc fine-grained) có quyền `repo` hoặc `contents:write`
 * 2. REPO_OWNER   : Tên tài khoản hoặc tổ chức GitHub (ví dụ: "your-username")
 * 3. REPO_NAME    : Tên kho lưu trữ GitHub (ví dụ: "rok-wontrade" hoặc "meo")
 * 4. FILE_PATH    : Đường dẫn file cần tráo đổi (Mặc định: "index.html")
 * 5. BRANCH       : Tên nhánh cần commit (Mặc định: "main" hoặc "master")
 * 6. ADMIN_SECRET : (Tùy chọn) Khóa bí mật bảo vệ Worker, nếu cài thì Admin CMS cần gửi header `X-Admin-Key`
 * ==============================================================================
 */

// Hàm mã hóa chuỗi UTF-8 tiếng Việt sang Base64 an toàn (tránh lỗi font btoa)
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Hàm giải mã Base64 sang chuỗi UTF-8 tiếng Việt hoàn chỉnh
function base64ToUtf8(base64) {
  const binary = atob(base64.replace(/\n/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// BỘ CÔNG THỨC TRÁO CODE VÀO FILE INDEX.HTML (EDGE-SSG)
function updateIndexHtmlWithData(html, data) {
  const siteConfig = data.siteConfig || {};
  const products = Array.isArray(data.products) ? data.products : [];
  const seo = siteConfig.seo || {};
  const brand = siteConfig.brand || {};
  const contact = siteConfig.contact || {};
  const banner = siteConfig.banner || {};

  const title = seo.title || "WONTRADE - Nền tảng giao dịch Rise of Kingdoms chính thức";
  const desc = seo.description || "Nhà giao dịch WONTRADE - Nền tảng giao dịch đối tác chính thức cho Rise of Kingdoms. Mua bán tài khoản, chỉ huy thức tỉnh, trang bị huyền thoại an toàn và nhanh chóng.";
  const keywords = seo.keywords || "wontrade, rise of kingdoms, rok, mua bán acc rok, giao dịch rok";
  const avatar = seo.ogImage || brand.avatar || "assets/rok_avatar.jpg";
  const gameName = brand.gameName || "Rise of Kingdoms";
  const zaloPhone = contact.zalo || contact.phone || "0372996420";
  const zaloUrl = contact.zaloUrl || `https://zalo.me/${zaloPhone}`;

  // 1. Tráo Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // 2. Tráo Meta SEO & Social Sharing (Zalo / Facebook / Twitter)
  // Khớp trọn vẹn cả thẻ từ <meta ... cho đến dấu > đóng thẻ để triệt tiêu lỗi thừa dấu >
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description"\n    content="${desc}">`);
  } else {
    html = html.replace(/<\/title>/i, `</title>\n  <meta name="description"\n    content="${desc}">`);
  }

  if (/<meta\s+name=["']keywords["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${keywords}">`);
  } else {
    html = html.replace(/(<meta\s+name=["']description["'][^>]*>)/i, `$1\n  <meta name="keywords" content="${keywords}">`);
  }

  // OpenGraph cho Zalo / Facebook
  if (/<meta\s+property=["']og:title["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}">`);
  } else {
    html = html.replace(/<\/title>/i, `</title>\n  <meta property="og:type" content="website">\n  <meta property="og:title" content="${title}">`);
  }

  if (/<meta\s+property=["']og:description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description"\n    content="${desc}">`);
  }

  if (/<meta\s+property=["']og:image["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${avatar}">`);
  }

  // Twitter Cards
  if (/<meta\s+name=["']twitter:title["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title}">`);
  }
  if (/<meta\s+name=["']twitter:description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description"\n    content="${desc}">`);
  }
  if (/<meta\s+name=["']twitter:image["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${avatar}">`);
  }

  // Tự động dọn sạch mọi ký tự '>' trôi nổi dư thừa nếu có do các lần tráo cũ bị sót
  html = html.replace(/(<meta[^>]*>)\s*>/gi, '$1');

  // 3. Tráo Nội dung tĩnh Banner (SSR)
  if (banner.desktopHeadline) {
    html = html.replace(/<h1\s+class=["']banner-headline["']>[\s\S]*?<\/h1>/i, `<h1 class="banner-headline">${banner.desktopHeadline}</h1>`);
  }
  if (banner.desktopRibbon) {
    html = html.replace(/<div\s+class=["']banner-ribbon["']>[\s\S]*?<\/div>/i, `<div class="banner-ribbon">${banner.desktopRibbon}</div>`);
  }
  if (banner.mobileTitle) {
    html = html.replace(/<div\s+class=["']mobile-banner-title["']>[\s\S]*?<\/div>/i, `<div class="mobile-banner-title">${banner.mobileTitle}</div>`);
  }
  if (banner.mobileSubtitle) {
    html = html.replace(/<div\s+class=["']mobile-banner-subtitle["']>[\s\S]*?<\/div>/i, `<div class="mobile-banner-subtitle">${banner.mobileSubtitle}</div>`);
  }

  // 4. Tráo Game Name & Brand
  if (gameName) {
    html = html.replace(/<span\s+class=["']game-name["']>[\s\S]*?<\/span>/i, `<span class="game-name">${gameName}</span>`);
  }

  // 5. Tráo tất cả link Zalo & Tiêu đề tooltip Zalo
  if (zaloUrl) {
    html = html.replace(/href=["']https?:\/\/zalo\.me\/[^"']*["']/g, `href="${zaloUrl}"`);
    html = html.replace(/title=["']Nhắn tin Zalo:[^"']*["']/g, `title="Nhắn tin Zalo: ${zaloPhone}"`);
  }

  // 6. Tráo số lượng vật phẩm tĩnh (SSR)
  const countStr = String(products.length);
  html = html.replace(/<strong\s+class=["']item-count-val["']>\d+<\/strong>/g, `<strong class="item-count-val">${countStr}</strong>`);

  // 7. Tráo Thẻ Script Chứa Cấu Hình & Mảng Vật Phẩm Hoàn Chỉnh
  const scriptTag = `  <!-- DỮ LIỆU CẤU HÌNH & VẬT PHẨM TỰ ĐỘNG CẬP NHẬT QUA CLOUDFLARE WORKER & GITHUB API (EDGE-SSG) -->
  <script id="siteDataScript">
    var siteConfig = ${JSON.stringify(siteConfig, null, 2)};
    var mockProducts = ${JSON.stringify(products, null, 2)};
    if (typeof window !== "undefined") {
      window.siteConfig = siteConfig;
      window.mockProducts = mockProducts;
    }
  </script>`;

  if (/<script\s+id=["']siteDataScript["']>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+id=["']siteDataScript["']>[\s\S]*?<\/script>/i, scriptTag);
  } else {
    // Chèn trước thẻ nạp script tương tác
    html = html.replace(/<script\s+src=["']js\/index\.js["']><\/script>/i, `${scriptTag}\n  <script src="js/index.js"></script>`);
  }

  // 8. Đảm bảo loại bỏ hoàn toàn popup iframe modal nếu còn sót lại
  html = html.replace(/<!--\s*=+\s*9:16 VERTICAL POPUP IFRAME MODAL[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, '');
  html = html.replace(/<div\s+class=["']iframe-modal-backdrop["'][\s\S]*?id=["']productIframeModal["'][\s\S]*?<\/iframe>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, '');

  return html;
}

// Tạo chuỗi nội dung list.js dự phòng nếu cần đồng bộ song song
function generateListJsContent(products, siteConfig) {
  const jsonProducts = JSON.stringify(products || [], null, 2);
  let configSection = "";
  if (siteConfig && typeof siteConfig === "object") {
    configSection = `\n// CẤU HÌNH THÔNG TIN SITE (Được quản lý tự động qua Admin CMS & Cloudflare Worker)\nvar siteConfig = ${JSON.stringify(siteConfig, null, 2)};\n`;
  }
  return `/**
 * ==============================================================================
 * WONTRADE - RISE OF KINGDOMS TRADING PLATFORM
 * FILE DỰ PHÒNG DANH SÁCH VẬT PHẨM (Tổng số: ${(products || []).length} vật phẩm)
 * Cập nhật tự động qua WONTRADE Admin CMS & Cloudflare Worker (Edge-SSG)
 * ==============================================================================
 */

var mockProducts = ${jsonProducts};
${configSection}
if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
  if (typeof siteConfig !== "undefined") {
    window.siteConfig = siteConfig;
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { mockProducts, ...(typeof siteConfig !== "undefined" ? { siteConfig } : {}) };
}
`;
}

// Headers CORS chuẩn
function getCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Key",
    "Access-Control-Max-Age": "86400",
  };
}

// Helper trả về JSON có CORS
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...getCorsHeaders(),
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(),
      });
    }

    const url = new URL(request.url);

    // 2. Kiểm tra biến môi trường bắt buộc
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
          error: "Thiếu biến môi trường Cloudflare Worker!",
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

    // 3. Kiểm tra bảo mật ADMIN_SECRET nếu có
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

    const githubHeaders = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Edge-SSG-Worker",
    };

    // ========================================================================
    // GET: Kéo cấu hình hiện tại từ file index.html trên GitHub
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
            message: `File ${targetPath} chưa tồn tại trên repo.`,
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

        // Trích xuất siteConfig và mockProducts từ HTML
        let parsedSiteConfig = null;
        let parsedProducts = null;

        // Trích xuất từ siteDataScript
        const matchConfig = contentStr.match(/var\s+siteConfig\s*=\s*(\{[\s\S]*?\});/);
        if (matchConfig) {
          try {
            parsedSiteConfig = JSON.parse(matchConfig[1]);
          } catch (e) {}
        }

        const matchProducts = contentStr.match(/var\s+mockProducts\s*=\s*(\[[\s\S]*?\]);/);
        if (matchProducts) {
          try {
            parsedProducts = JSON.parse(matchProducts[1]);
          } catch (e) {}
        }

        // Nếu file index.html chưa có mockProducts trong script thì thử kéo js/list.js
        if (!parsedProducts && targetPath.endsWith(".html")) {
          try {
            const listApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/js/list.js?ref=${BRANCH}`;
            const listRes = await fetch(listApiUrl, { headers: githubHeaders });
            if (listRes.ok) {
              const listData = await listRes.json();
              const listStr = listData.content ? base64ToUtf8(listData.content) : "";
              const matchL = listStr.match(/var\s+mockProducts\s*=\s*(\[[\s\S]*?\]);/);
              if (matchL) {
                parsedProducts = JSON.parse(matchL[1]);
              }
            }
          } catch (e) {}
        }

        return jsonResponse({
          success: true,
          exists: true,
          sha: data.sha,
          filePath: targetPath,
          repo: `${REPO_OWNER}/${REPO_NAME}`,
          branch: BRANCH,
          siteConfig: parsedSiteConfig,
          products: parsedProducts || [],
          totalProducts: (parsedProducts || []).length,
          content: contentStr,
        });
      } catch (err) {
        return jsonResponse(
          { success: false, error: err.message || "Lỗi khi kết nối GitHub" },
          500
        );
      }
    }

    // ========================================================================
    // POST: Tráo code trực tiếp vào file index.html và commit lên GitHub
    // ========================================================================
    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return jsonResponse({ success: false, error: "Dữ liệu JSON không hợp lệ!" }, 400);
      }

      const targetPath = body.filePath || DEFAULT_FILE_PATH;
      const getApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}?ref=${BRANCH}`;

      try {
        // 1. Kéo file index.html hiện tại từ GitHub để lấy SHA và mã nguồn gốc
        const getRes = await fetch(getApiUrl, { headers: githubHeaders });
        let currentSha = null;
        let oldHtml = "";

        if (getRes.ok) {
          const fileData = await getRes.json();
          currentSha = fileData.sha;
          oldHtml = fileData.content ? base64ToUtf8(fileData.content) : "";
        } else if (getRes.status !== 404) {
          const errData = await getRes.json();
          return jsonResponse(
            {
              success: false,
              error: `Không thể đọc file ${targetPath} từ GitHub (${getRes.status})`,
              details: errData,
            },
            getRes.status
          );
        }

        // 2. Tạo nội dung file mới (nếu gửi content string thì dùng trực tiếp, ngược lại chạy hàm tráo code)
        let newContent = body.content;
        if (!newContent && (body.siteConfig || body.products || body.profile)) {
          const dataToUpdate = {
            siteConfig: body.siteConfig || body.profile || {},
            products: Array.isArray(body.products) ? body.products : [],
          };
          newContent = updateIndexHtmlWithData(oldHtml, dataToUpdate);
        }

        if (typeof newContent !== "string" || !newContent.trim()) {
          return jsonResponse(
            {
              success: false,
              error: "Nội dung cập nhật không hợp lệ! Vui lòng cung cấp 'siteConfig' và 'products'.",
            },
            400
          );
        }

        // 3. Commit ghi đè trực tiếp lên index.html
        const commitMessage =
          body.message ||
          `Admin Edge-SSG: Tráo file ${targetPath} (${new Date().toLocaleString("vi-VN")})`;

        const putPayload = {
          message: commitMessage,
          content: utf8ToBase64(newContent),
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
              error: putData.message || "Không thể commit file lên GitHub",
              details: putData,
            },
            putRes.status
          );
        }

        // 4. (Tùy chọn) Đồng bộ thêm file js/list.js nếu được yêu cầu
        if (body.syncListJs) {
          try {
            const listJsPath = "js/list.js";
            const getListUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${listJsPath}?ref=${BRANCH}`;
            const listRes = await fetch(getListUrl, { headers: githubHeaders });
            let listSha = null;
            if (listRes.ok) {
              const lData = await listRes.json();
              listSha = lData.sha;
            }
            const listContent = generateListJsContent(body.products || [], body.siteConfig || {});
            await fetch(getListUrl.replace(`?ref=${BRANCH}`, ""), {
              method: "PUT",
              headers: { ...githubHeaders, "Content-Type": "application/json" },
              body: JSON.stringify({
                message: `Auto sync js/list.js with index.html`,
                content: utf8ToBase64(listContent),
                sha: listSha,
                branch: BRANCH,
              }),
            });
          } catch (syncErr) {
            console.error("Lỗi đồng bộ js/list.js phụ:", syncErr);
          }
        }

        return jsonResponse({
          success: true,
          message: `Tráo và commit trực tiếp file ${targetPath} lên GitHub thành công!`,
          repo: `${REPO_OWNER}/${REPO_NAME}`,
          branch: BRANCH,
          filePath: targetPath,
          commitSha: putData.commit?.sha,
          commitUrl: putData.commit?.html_url,
          notice:
            "Lưu thành công! Vui lòng đợi 1-3 phút để GitHub Pages / Cloudflare Pages tự động build lại trang public cho người dùng.",
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
