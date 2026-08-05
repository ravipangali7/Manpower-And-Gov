import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";

/**
 * Browser: same-origin `/api` (Vite proxies to Django).
 * SSR: absolute Django URL — relative `/api` has no host in Node fetch.
 */
function resolveApiBase(): string {
  const fromEnv = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window === "undefined") {
    const raw =
      (typeof process !== "undefined" && process.env?.VITE_API_URL) ||
      (typeof process !== "undefined" && process.env?.API_URL) ||
      "";
    const ssr = typeof raw === "string" ? raw.replace(/\/$/, "") : "";
    return ssr || "http://127.0.0.1:8000/api";
  }
  return "/api";
}

const API_BASE = resolveApiBase();

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

async function tryRefresh(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { access: string };
    const currentRefresh = getRefreshToken();
    if (!currentRefresh) return false;
    setTokens(data.access, currentRefresh);
    return true;
  } catch {
    return false;
  }
}

function encodeBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined) return undefined;
  if (body instanceof FormData) {
    headers.delete("Content-Type");
    return body;
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return JSON.stringify(body);
}

export async function api<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);
  const encoded = encodeBody(body, headers);

  if (auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

  let res = await fetch(url, {
    ...rest,
    headers,
    body: encoded,
  });

  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const token = getAccessToken();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      const retryHeaders = new Headers(customHeaders);
      const retryBody = encodeBody(body, retryHeaders);
      if (token) retryHeaders.set("Authorization", `Bearer ${token}`);
      res = await fetch(url, {
        ...rest,
        headers: retryHeaders,
        body: retryBody,
      });
    } else {
      clearTokens();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
        window.location.assign("/admin/login");
      }
      throw new ApiError("Unauthorized", 401);
    }
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : res.statusText || "Request failed";
    throw new ApiError(detail, res.status, data);
  }

  return data as T;
}
