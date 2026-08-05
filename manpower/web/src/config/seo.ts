/** Site SEO defaults for Vision & Value Overseas (VNVNEPAL). */

export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://manpower.luckyuser365.com"
).replace(/\/$/, "");

export const SITE_NAME = "VNVNEPAL";

export const SITE_BRAND = "Vision & Value Overseas (VNVNEPAL)";

/**
 * Default Open Graph / Twitter share image.
 * Stable public asset copied from `src/assets/hero-seminar.jpg`
 * → served at `/og-default.jpg`.
 */
export const DEFAULT_OG_IMAGE_PATH = "/og-default.jpg";
