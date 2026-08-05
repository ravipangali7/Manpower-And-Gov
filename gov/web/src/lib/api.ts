/**
 * Shared API base helpers. Reads `VITE_API_URL` from `.env`
 * (e.g. https://govapi.luckyuser365.com).
 */

function trimSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/** API origin only — no `/api` suffix. */
export function getApiOrigin(): string {
  const fromVite =
    typeof import.meta !== "undefined"
      ? (import.meta.env?.VITE_API_URL as string | undefined)
      : undefined;
  const fromProcess =
    typeof process !== "undefined"
      ? (process.env?.VITE_API_URL as string | undefined) ||
        (process.env?.API_URL as string | undefined)
      : undefined;
  const raw = (fromVite || fromProcess || "").trim();
  return raw ? trimSlash(raw) : "";
}

/**
 * Base used for REST calls: `{origin}/api`.
 * Empty string when unset (callers should no-op or use relative paths).
 */
export function getApiBase(): string {
  const origin = getApiOrigin();
  if (!origin) return "";
  return origin.endsWith("/api") ? origin : `${origin}/api`;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const base = getApiBase();
  if (!base) {
    throw new Error("VITE_API_URL is not set");
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return fetch(`${base}${p}`, init);
}
