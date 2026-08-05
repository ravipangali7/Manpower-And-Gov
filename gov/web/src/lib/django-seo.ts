/**
 * Optional Django SEO API helpers.
 * Production IndexNow + dynamic sitemap inventory live on the Django side
 * (`/api/public/sitemap-urls/`, Content post_save IndexNow). Call these when
 * `VITE_API_URL` is set to merge CMS URLs into FE tooling or build steps.
 */

import { getApiBase } from "./api";

export type SitemapUrlRow = { loc: string; lastmod?: string | null };

/** Fetch published URL inventory from Django. Returns [] if API unset/unreachable. */
export async function fetchSitemapUrls(includeStatic = true): Promise<SitemapUrlRow[]> {
  const base = getApiBase();
  if (!base) return [];
  try {
    const qs = includeStatic ? "" : "?include_static=0";
    const res = await fetch(`${base}/public/sitemap-urls/${qs}`);
    if (!res.ok) return [];
    const data = (await res.json()) as { urls?: SitemapUrlRow[] } | SitemapUrlRow[];
    if (Array.isArray(data)) return data;
    return data.urls ?? [];
  } catch {
    return [];
  }
}

/** Map Django public site-data SEO fields onto FE Settings / content shapes. */
export function mapDjangoSettingsSeo(raw: Record<string, unknown>) {
  return {
    siteUrl: String(raw.siteUrl ?? raw.site_url ?? ""),
    ogImageUrl: String(raw.ogImageUrl ?? raw.og_image_url ?? ""),
    facebookUrl: String(raw.facebookUrl ?? raw.facebook_url ?? ""),
    twitterUrl: String(raw.twitterUrl ?? raw.twitter_url ?? ""),
    gscVerification: String(raw.gscVerification ?? raw.gsc_verification ?? ""),
  };
}
