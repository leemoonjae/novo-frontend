// lib/api.ts

// 브라우저에서는 항상 Next.js 프록시(/api/novo)를 통해 백엔드를 호출한다.
// 예: apiFetch("/api/me") → 실제 요청 URL: /api/novo/api/me
const API_BASE = "/api/novo";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("novo_token");
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as any),
  };

  if (token) {
    headers["X-Access-Token"] = token;
  }

  const url = `${API_BASE}${path}`;
  console.log("🔎 apiFetch URL:", url);

  const res = await fetch(url, {
    ...options,
    headers,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
  // 상태코드까지 묶어서 던지기
  throw { status: res.status, ...(data || {}) };
}

  return data as T;
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("novo_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("novo_token");
}

export function getTokenClient() {
  return getToken();
}
