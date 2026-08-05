import { company } from "@/data/site";
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_BRAND,
  SITE_NAME,
  SITE_URL as CONFIG_SITE_URL,
} from "@/config/seo";

/** Default production origin; override with VITE_SITE_URL when needed. */
export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  CONFIG_SITE_URL ||
  "https://manpower.luckyuser365.com"
).replace(/\/$/, "");

export { SITE_BRAND, SITE_NAME, DEFAULT_OG_IMAGE_PATH };

/** Company NAP (name, address, phones) — shared with site content. */
export { company };
export const companyNap = {
  name: company.name,
  address: company.address,
  phones: company.phones,
  email: company.email,
} as const;

export const seo = {
  name: company.name,
  shortName: company.short,
  url: SITE_URL,
  locale: "en",
  /** Public logo asset (SVG logo is inline in UI; favicon used for link/schema). */
  logoPath: "/favicon.ico",
  /**
   * Default OG/Twitter image — stable public asset.
   * Source: `src/assets/hero-seminar.jpg` → copied to `public/og-default.jpg`.
   */
  defaultOgImage: DEFAULT_OG_IMAGE_PATH,
  companyNap,
} as const;

/**
 * Backlinks (#23): Earn editorial links via NAFEA/IOM/DoFE citations, news,
 * and partner directories — do not buy links or use PBNs.
 *
 * IndexNow (#50): On publish (news/job create or update), POST the changed
 * absolute URLs to https://api.indexnow.org/indexnow with a real key hosted
 * at `/{key}.txt` under public/. Do not commit a fake key — wire when a Bing
 * Webmaster / IndexNow key is provisioned for www.vnvnepal.com.
 */

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path.replace(/\/$/, "") || path;
  let normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.length > 1) normalized = normalized.replace(/\/+$/, "");
  return `${SITE_URL}${normalized === "/" ? "/" : normalized}`;
}

export function absoluteAssetUrl(path: string): string {
  return absoluteUrl(path);
}

/** Truncate a page title and append `| Brand`, targeting ~50–60 chars total. */
export function truncateTitle(
  title: string,
  maxTotal = 58,
  brand = SITE_NAME,
): string {
  const suffix = ` | ${brand}`;
  const budget = Math.max(12, maxTotal - suffix.length);
  let content = title.trim();
  if (content.length > budget) {
    content = `${content.slice(0, budget - 1).trimEnd()}…`;
  }
  return `${content}${suffix}`;
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  /** Optional shorter/social title; defaults to `title`. */
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article";
};

/**
 * TanStack Router / Start `head`-compatible meta + canonical link.
 * Includes Open Graph + Twitter tags with absolute URLs from SITE_URL.
 */
export function buildPageMeta({
  title,
  description,
  path,
  image,
  ogTitle,
  ogDescription,
  type = "website",
}: PageMetaInput) {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image ?? seo.defaultOgImage);
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: socialDescription },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:type", content: type },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: socialDescription },
      { name: "twitter:image", content: imageUrl },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
