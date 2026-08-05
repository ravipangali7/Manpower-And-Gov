/**
 * Shared head/meta helpers for TanStack Router `head()` functions.
 *
 * Admin routes: set `robots: "noindex,nofollow"` via `buildPageMeta` options
 * or a dedicated meta entry in the admin layout (`admin.tsx`). Public pages
 * must not send noindex.
 */

import { absoluteUrl, defaultOgImageUrl, siteSeo } from "@/config/site-seo";

export { absoluteUrl } from "@/config/site-seo";

export type PageMetaInput = {
  title: string;
  description: string;
  /** Path beginning with `/`, e.g. `/contact-us`. */
  path: string;
  type?: "website" | "article";
  /** Absolute or site-relative image URL; defaults to site OG image. */
  image?: string;
  /** Override robots (e.g. `noindex,nofollow` for admin). */
  robots?: string;
};

export type HeadMeta =
  | { title: string }
  | { charSet: string }
  | { name: string; content: string }
  | { property: string; content: string };

export type HeadLink = { rel: string; href: string };

function resolveImage(image?: string): string {
  if (!image) return defaultOgImageUrl();
  if (/^https?:\/\//i.test(image)) return image;
  return absoluteUrl(image.startsWith("/") ? image : `/${image}`);
}

/**
 * Build TanStack `head()` meta + link entries: title, description, canonical,
 * Open Graph, and Twitter Card tags.
 */
export function buildPageMeta(input: PageMetaInput): {
  meta: HeadMeta[];
  links: HeadLink[];
} {
  const url = absoluteUrl(input.path);
  const image = resolveImage(input.image);
  const type = input.type ?? "website";

  const meta: HeadMeta[] = [
    { title: input.title },
    { name: "description", content: input.description },
    { property: "og:title", content: input.title },
    { property: "og:description", content: input.description },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:type", content: type },
    { property: "og:site_name", content: siteSeo.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: input.title },
    { name: "twitter:description", content: input.description },
    { name: "twitter:image", content: image },
  ];

  if (input.robots) {
    meta.push({ name: "robots", content: input.robots });
  }

  const gsc = siteSeo.gscVerification;
  if (gsc) {
    meta.push({ name: "google-site-verification", content: gsc });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
