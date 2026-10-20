/**
 * ==============================================================================
 * CLOUDFLARE WORKER DÀNH RIÊNG CHO PROFILE ADMIN CMS
 * Tự động cập nhật cấu hình thông tin cá nhân & ngân hàng (profileConfig)
 * trên GitHub repo mà không ảnh hưởng đến danh sách tài khoản (mockProducts)
 * ==============================================================================
 *
 * CÁC BIẾN MÔI TRƯỜNG (Environment Variables) CẦN CÀI ĐẶT TRÊN WORKER NÀY:
 * (Cloudflare Dashboard -> Workers & Pages -> Worker của bạn -> Settings -> Variables)
 *
 * 1. GITHUB_TOKEN : Personal Access Token (classic hoặc fine-grained) có quyền `repo` hoặc `contents:write`
 * 2. REPO_OWNER   : Tên tài khoản hoặc tổ chức GitHub (ví dụ: "your-username")
 * 3. REPO_NAME    : Tên kho lưu trữ GitHub (ví dụ: "rok-wontrade" hoặc "meo")
 * 4. FILE_PATH    : Đường dẫn tới file danh sách (mặc định: "js/list.js")
 * 5. BRANCH       : Tên nhánh cần commit (mặc định: "main" hoặc "master")
 * 6. ADMIN_SECRET : (Tùy chọn) Khóa bí mật bảo vệ Worker, CMS cần gửi header `X-Admin-Key`
 *
 * ==============================================================================
 */

// Hàm tạo chuỗi nội dung list.js hoàn chỉnh kết hợp mockProducts hiện tại và profileConfig mới
function generateListJsContent(products, profile) {
  const jsonProducts = JSON.stringify(products || [], null, 2);
  const jsonProfile = JSON.stringify(profile || {}, null, 2);

  return `/**
 * ==============================================================================
 * WONTRADE - RISE OF KINGDOMS TRADING PLATFORM & PROFILE CMS
 * FILE QUẢN LÝ DANH SÁCH VẬT PHẨM & CẤU HÌNH PROFILE ĐẠI DIỆN
 * Cập nhật tự động qua WONTRADE Admin CMS & Cloudflare Worker
 * ==============================================================================
 */

var mockProducts = ${jsonProducts};

// CẤU HÌNH THÔNG TIN PROFILE (Được quản lý tự động qua /profile/admin/index.html & Cloudflare Worker)
var profileConfig = ${jsonProfile};

// Gán vào window để đảm bảo tương thích mọi ngữ cảnh trình duyệt
if (typeof window !== "undefined") {
  window.mockProducts = mockProducts;
  window.profileConfig = profileConfig;
}

// Hỗ trợ môi trường Module/NodeJS nếu cần
if (typeof module !== "undefined" && module.exports) {
  module.exports = { mockProducts, profileConfig };
}
`;
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
    const DEFAULT_FILE_PATH = env.FILE_PATH || "list.js";
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
    // GET: Kiểm tra kết nối và trích xuất cấu hình Profile từ file list.js trên GitHub
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

        // Trích xuất profileConfig và mockProducts
        let parsedProfile = null;
        let parsedProducts = null;
        try {
          const matchProf = contentStr.match(/var\s+profileConfig\s*=\s*(\{[\s\S]*?\});/);
          if (matchProf) parsedProfile = JSON.parse(matchProf[1]);
        } catch (e) {}

        try {
          const matchP = contentStr.match(/var\s+mockProducts\s*=\s*(\[[\s\S]*?\]);/);
          if (matchP) parsedProducts = JSON.parse(matchP[1]);
        } catch (e) {}

        const resPayload = {
          success: true,
          exists: true,
          sha: data.sha,
          filePath: targetPath,
          repo: `${REPO_OWNER}/${REPO_NAME}`,
          branch: BRANCH,
          profile: parsedProfile,
          totalProducts: parsedProducts ? parsedProducts.length : 0,
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
    // POST: Cập nhật thông tin Profile lên file list.js trên GitHub
    // ========================================================================
    if (request.method === "POST") {
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return jsonResponse({ success: false, error: "Dữ liệu JSON không hợp lệ!" }, 400);
      }

      const commitMessage = body.message || "Profile CMS: update profile config";
      const targetPaths = body.targetPaths || [body.filePath || DEFAULT_FILE_PATH || "list.js"];

      const results = [];

      try {
        for (const targetPath of targetPaths) {
          // Bước 1: Lấy nội dung file và mã SHA hiện tại trên GitHub
          const getApiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${targetPath}?ref=${BRANCH}`;
          const getRes = await fetch(getApiUrl, { headers: githubHeaders });

          let currentSha = null;
          let currentContentStr = "";
          let currentProducts = [];

          if (getRes.ok) {
            const fileData = await getRes.json();
            currentSha = fileData.sha;
            currentContentStr = fileData.content ? base64ToUtf8(fileData.content) : "";

            // Trích xuất mockProducts hiện có để đảm bảo KHÔNG làm mất danh sách tài khoản
            try {
              const matchP = currentContentStr.match(/var\s+mockProducts\s*=\s*(\[[\s\S]*?\]);/);
              if (matchP) currentProducts = JSON.parse(matchP[1]);
            } catch (e) {}
          }

          // Bước 2: Xác định nội dung mới
          let finalContent = "";
          if (typeof body.content === "string" && body.content.trim()) {
            finalContent = body.content;
          } else if (body.profile && typeof body.profile === "object") {
            // Tự động kết hợp mockProducts hiện tại và profileConfig mới
            const productsToKeep = (Array.isArray(body.products) && body.products.length > 0)
              ? body.products
              : currentProducts;
            finalContent = generateListJsContent(productsToKeep, body.profile);
          } else {
            return jsonResponse(
              {
                success: false,
                error: "Dữ liệu gửi lên thiếu 'content' hoặc 'profile' hợp lệ!",
              },
              400
            );
          }

          // Bước 3: Mã hóa Base64 và commit file lên GitHub (Ghi đè file cũ nếu có sha)
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
            results.push({
              filePath: targetPath,
              success: false,
              status: putRes.status,
              error: putData.message || (putRes.status === 404 ? "Không tìm thấy repository hoặc đường dẫn file" : "Không thể commit file lên GitHub"),
              details: putData,
            });
          } else {
            results.push({
              filePath: targetPath,
              success: true,
              sha: putData.content?.sha,
              commitSha: putData.commit?.sha,
              commitUrl: putData.commit?.html_url,
            });
          }
        }

        const allSuccess = results.every((r) => r.success);
        const failedItem = results.find((r) => !r.success);

        let errorSummary = undefined;
        if (!allSuccess && failedItem) {
          if (failedItem.status === 404) {
            errorSummary = `GitHub báo 404 Not Found! Repo "${REPO_OWNER}/${REPO_NAME}" không tìm thấy hoặc Token không có quyền truy cập repo này. Vui lòng kiểm tra REPO_OWNER=spac2dev và REPO_NAME=infomeomeorise trong Cloudflare Worker.`;
          } else if (failedItem.status === 401 || failedItem.status === 403) {
            errorSummary = `GitHub báo lỗi xác thực (${failedItem.status}): ${failedItem.error}. Vui lòng kiểm tra lại GITHUB_TOKEN xem đã cấp quyền 'repo'/'contents:write' chưa.`;
          } else {
            errorSummary = `GitHub Error (${failedItem.status}): ${failedItem.error}`;
          }
        }

        return jsonResponse(
          {
            success: allSuccess,
            message: allSuccess
              ? "Cập nhật cấu hình Profile lên GitHub thành công!"
              : (errorSummary || "Có lỗi xảy ra trong quá trình cập nhật Profile lên GitHub."),
            error: errorSummary,
            repo: `${REPO_OWNER}/${REPO_NAME}`,
            branch: BRANCH,
            results,
            notice: allSuccess
              ? "Lưu thành công! Vui lòng đợi 1-3 phút để GitHub / Cloudflare Pages tự động cập nhật lại trang cá nhân."
              : undefined,
          },
          allSuccess ? 200 : 502
        );
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
