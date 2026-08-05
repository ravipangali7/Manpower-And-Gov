/** Site SEO defaults for Vision & Value Overseas (VNVNEPAL). */

export const SITE_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) ||
  "https://www.vnvnepal.com"
).replace(/\/$/, "");

export const SITE_NAME = "VNVNEPAL";

export const SITE_BRAND = "Vision & Value Overseas (VNVNEPAL)";

/**
 * Default Open Graph / Twitter share image.
 * Stable public asset copied from `src/assets/hero-seminar.jpg`
 * → served at `/og-default.jpg`.
 */
export const DEFAULT_OG_IMAGE_PATH = "/og-default.jpg";

/** Answer-first definition for AEO / GEO (homepage intro). */
export const HOMEPAGE_DEFINITION =
  "Vision & Value Overseas Pvt. Ltd. (VNVNEPAL) is an ethical overseas manpower recruitment agency based in Basundhara, Kathmandu, Nepal. We help employers hire skilled Nepali workers across hospitality, healthcare, construction and related sectors in Asia, the Middle East and Europe, and we guide candidates through transparent, zero-cost-to-worker recruitment practices.";

export const HOMEPAGE_FAQS = [
  {
    question: "What is VNVNEPAL?",
    answer:
      "VNVNEPAL is the trading name of Vision & Value Overseas Pvt. Ltd., a Kathmandu-based overseas recruitment agency that places Nepali workers with international employers under ethical recruitment standards.",
  },
  {
    question: "Where is Vision & Value Overseas located?",
    answer:
      "Our office is at Dhapasi Marg, Basundhara-3, Kathmandu, Nepal. Contact info@vnvnepal.com or call +977-14379749 for employer and candidate enquiries.",
  },
  {
    question: "Does VNVNEPAL charge candidates for recruitment?",
    answer:
      "Vision & Value promotes ethical, zero-cost-to-worker recruitment. Candidates should never pay unauthorized fees; raise concerns through our contact channels if anyone requests improper payments.",
  },
] as const;
