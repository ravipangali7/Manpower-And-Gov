/**
 * Single source of truth for site identity, NAP, and SEO defaults.
 * Used by head helpers, JSON-LD schema, footer, and social meta.
 */

function resolveSiteUrl(): string {
  const envUrl =
    typeof import.meta !== "undefined"
      ? (import.meta as ImportMeta & { env?: { VITE_SITE_URL?: string } }).env?.VITE_SITE_URL
      : undefined;
  const raw = envUrl || "https://gov.luckyuser365.com";
  return String(raw).replace(/\/$/, "").replace(/^http:\/\//i, "https://");
}

export const SITE_URL = resolveSiteUrl();

/** Join site origin with a path (leading slash optional). */
export function absoluteUrl(path = "/"): string {
  if (!path || path === "/") return `${SITE_URL}/`;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

function envTrim(key: string): string {
  if (typeof import.meta === "undefined") return "";
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return String(env?.[key] ?? "").trim();
}

const LOGO_PATH = "/nepal-emblem.png";
const OG_IMAGE_PATH = "/og-default.png";

/** Optional Google Search Console HTML-tag verification token */
export function gscVerificationMeta(): { name: string; content: string } | null {
  const token = envTrim("VITE_GSC_VERIFICATION") || envTrim("VITE_GSC_TOKEN");
  if (!token) return null;
  return { name: "google-site-verification", content: token };
}

/** Absolute URL for the default Open Graph / Twitter share image. */
export function defaultOgImageUrl(): string {
  return absoluteUrl(OG_IMAGE_PATH);
}

/** Absolute URL for the organization logo (emblem). */
export function logoUrl(): string {
  return absoluteUrl(LOGO_PATH);
}

export const siteSeo = {
  name: "Department of Foreign Employment",
  alternateName: ["DoFE", "वैदेशिक रोजगार विभाग"],
  legalName: "Department of Foreign Employment",
  ministry: "Ministry of Youth, Labour and Employment",
  url: SITE_URL,
  locale: "en-NP",
  logoPath: LOGO_PATH,
  defaultOgImagePath: OG_IMAGE_PATH,
  logo: absoluteUrl(LOGO_PATH),
  email: "info@dofe.gov.np",
  telephone: "01-4792671",
  tollFree: "1140",
  description:
    "Official portal of the Department of Foreign Employment under the Ministry of Youth, Labour and Employment, Government of Nepal. Notices, labour approval (FEIMS), licensed agencies and grievance services.",
  address: {
    streetAddress: "Tahachal",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati",
    addressCountry: "NP",
    formatted: "Tahachal, Kathmandu",
  },
  parentOrganization: {
    name: "Ministry of Youth, Labour and Employment",
    url: "https://moless.gov.np/",
  },
  /** Profiles linked on the public contact page (visible sameAs). */
  sameAs: ["https://www.facebook.com/dofe.np", "https://x.com/baidesik_rojgar"] as string[],
  openingHours: [
    {
      name: "Winter (Kartik 16 – Magh 15)",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "16:00",
    },
    {
      name: "Summer (Magh 16 – Kartik 15)",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  /** Populated when VITE_GSC_VERIFICATION is set at build time */
  get gscVerification() {
    return envTrim("VITE_GSC_VERIFICATION") || "";
  },
  /** Analytics / GA4 measurement ID placeholder (also see VITE_GA_ID). */
  get analyticsId() {
    return envTrim("VITE_GA_ID") || "";
  },
  systems: {
    feims: { label: "FEIMS (Online Labour Approval)", href: "https://feims.dofe.gov.np" },
    ujuri: { label: "Ujuri (Grievance & Case Management)", href: "https://ujuri.dofe.gov.np" },
  },
};

/** Display NAP / entity helpers used in footer and intro copy */
export const SITE_ENTITY = {
  name: siteSeo.name,
  shortName: "DoFE",
  parentMinistry: siteSeo.ministry,
  government: "Government of Nepal",
  address: siteSeo.address.formatted,
  locality: siteSeo.address.addressLocality,
  country: "Nepal",
  phone: siteSeo.telephone,
  tollFree: siteSeo.tollFree,
  email: siteSeo.email,
  defaultOrigin: SITE_URL,
  systems: siteSeo.systems,
  sameAs: siteSeo.sameAs,
};

export function siteOrigin(): string {
  return SITE_URL;
}

/** Answer-first definition for AEO / GEO (homepage intro). */
export const HOMEPAGE_DEFINITION =
  "The Department of Foreign Employment is a government agency under the Ministry of Youth, Labour and Employment, located at Tahachal, Kathmandu. On this portal, citizens can read official notices, use labour-approval and related digital services via FEIMS (https://feims.dofe.gov.np), verify licensed recruitment agencies, and register grievances through Ujuri (https://ujuri.dofe.gov.np).";
