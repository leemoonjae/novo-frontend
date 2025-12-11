// app/api/novo/[...path]/route.ts

const BACKEND_BASE = "https://api.novo.ai.kr";

// 프록시용 공통 핸들러
async function handle(req: Request) {
  // 예: req.url = "http://localhost:3000/api/novo/api/register"
  const url = new URL(req.url);

  // "/api/novo/api/register" 에서 "/api/novo" 부분을 제거 → "/api/register"
  const backendPath = url.pathname.replace(/^\/api\/novo/, "");
  const backendUrl = BACKEND_BASE + backendPath; // "https://api.novo.ai.kr/api/register"

  const method = req.method;

  let body: string | undefined = undefined;
  if (method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    body = await req.text();
  }

  // 헤더 전달
  const headers: Record<string, string> = {};
  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  const token = req.headers.get("x-access-token");
  if (token) {
    headers["X-Access-Token"] = token;
  }

  // 백엔드로 실제 요청
  const backendRes = await fetch(backendUrl, {
    method,
    headers,
    body,
  });

  const text = await backendRes.text();
  const resHeaders: Record<string, string> = {};
  const backendCT = backendRes.headers.get("content-type");
  if (backendCT) {
    resHeaders["Content-Type"] = backendCT;
  }

  return new Response(text, {
    status: backendRes.status,
    headers: resHeaders,
  });
}

// 모든 HTTP 메서드에 같은 핸들러 사용
export { handle as GET };
export { handle as POST };
export { handle as PUT };
export { handle as DELETE };
export { handle as OPTIONS };
