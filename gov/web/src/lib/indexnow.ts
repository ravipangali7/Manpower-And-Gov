/**
 * IndexNow (Bing / Yandex / etc.) — notify search engines when URLs change.
 *
 * How to wire on publish
 * ----------------------
 * 1. Generate an IndexNow API key and host the key file at:
 *    `https://www.dofe.gov.np/{key}.txt` (also place under `web/public/`).
 * 2. Prefer server-side env `INDEXNOW_KEY` (see `server/core/indexnow.py`).
 *    Optional SPA env: `VITE_INDEXNOW_KEY` — never commit the live key.
 * 3. After a CMS publish (create/update/unpublish of content, pages, jobs):
 *    call Django `notify_content_saved` / `submit_indexnow`, or
 *    `submitIndexNow([absoluteUrl])` from this module as a client-side fallback.
 *
 * Django
 * ------
 * Production pings should use `server/core/indexnow.py` (already wired to fail soft
 * when the key is unset). Do not embed secrets in the SPA bundle for production.
 *
 * This module is a client-safe stub: it no-ops without a key and never invents one.
 */

import { siteSeo } from "@/config/site-seo";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function getIndexNowKey(): string {
  if (typeof import.meta === "undefined") return "";
  return String(import.meta.env?.VITE_INDEXNOW_KEY ?? "").trim();
}

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

/** Build the JSON body for IndexNow. Returns null if key or urls are missing. */
export function buildIndexNowPayload(urls: string[]): IndexNowPayload | null {
  const key = getIndexNowKey();
  if (!key || urls.length === 0) return null;

  const host = new URL(siteSeo.url).host;
  return {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };
}

/**
 * Optional helper: POST changed URLs to IndexNow.
 * Safe to call from admin after publish — skips when key is unset.
 */
export async function submitIndexNow(
  urls: string[],
): Promise<{ ok: boolean; skipped?: boolean; status?: number }> {
  const payload = buildIndexNowPayload(urls);
  if (!payload) {
    return { ok: true, skipped: true };
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return { ok: res.ok, status: res.status };
}
