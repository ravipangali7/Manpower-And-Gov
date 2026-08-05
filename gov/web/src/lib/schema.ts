import { absoluteUrl as siteAbsoluteUrl, siteSeo } from "@/config/site-seo";

type JsonLd = Record<string, unknown>;

const ORG_ID = `${siteSeo.url}/#organization`;
const OFFICE_ID = `${siteSeo.url}/#office`;

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return siteAbsoluteUrl(pathOrUrl);
}

/** Parse display dates like "July 28, 2026, 04:13 PM" into ISO-8601 when possible. */
export function toIsoDateTime(display: string | undefined | null): string | undefined {
  if (!display?.trim()) return undefined;
  const cleaned = display.replace(/^\w+day,\s*/i, "").trim();
  const ms = Date.parse(cleaned);
  if (Number.isNaN(ms)) return undefined;
  return new Date(ms).toISOString();
}

export function governmentOrganization(): JsonLd {
  return {
    "@type": "GovernmentOrganization",
    "@id": ORG_ID,
    name: siteSeo.name,
    alternateName: siteSeo.alternateName,
    legalName: siteSeo.legalName,
    url: siteSeo.url,
    logo: {
      "@type": "ImageObject",
      url: siteSeo.logo,
    },
    image: siteSeo.logo,
    email: siteSeo.email,
    telephone: [siteSeo.telephone, siteSeo.tollFree],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSeo.address.streetAddress,
      addressLocality: siteSeo.address.addressLocality,
      addressRegion: siteSeo.address.addressRegion,
      addressCountry: siteSeo.address.addressCountry,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: siteSeo.telephone,
        email: siteSeo.email,
        areaServed: "NP",
        availableLanguage: ["en", "ne"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: siteSeo.tollFree,
        name: "Toll free",
        areaServed: "NP",
        availableLanguage: ["en", "ne"],
      },
    ],
    sameAs: [...siteSeo.sameAs],
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: siteSeo.parentOrganization.name,
      url: siteSeo.parentOrganization.url,
    },
    description: siteSeo.description,
  };
}

/** GovernmentOffice (LocalBusiness subtype) with NAP + seasonal opening hours from footer. */
export function governmentOffice(): JsonLd {
  return {
    "@type": "GovernmentOffice",
    "@id": OFFICE_ID,
    name: siteSeo.name,
    url: siteSeo.url,
    image: siteSeo.logo,
    email: siteSeo.email,
    telephone: siteSeo.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteSeo.address.streetAddress,
      addressLocality: siteSeo.address.addressLocality,
      addressRegion: siteSeo.address.addressRegion,
      addressCountry: siteSeo.address.addressCountry,
    },
    openingHoursSpecification: siteSeo.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      name: h.name,
      dayOfWeek: [...h.dayOfWeek],
      opens: h.opens,
      closes: h.closes,
    })),
    parentOrganization: { "@id": ORG_ID },
  };
}

/** Organization + GovernmentOffice as a single @graph document for the public shell. */
export function organizationGraph(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [governmentOrganization(), governmentOffice()],
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbList(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPage(faqs: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export type ArticleInput = {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  image?: string;
};

export function article(input: ArticleInput): JsonLd {
  const datePublished = toIsoDateTime(input.datePublished) ?? input.datePublished;
  const dateModified =
    toIsoDateTime(input.dateModified) ?? (input.dateModified ? input.dateModified : datePublished);

  const node: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    datePublished,
    dateModified,
    author: {
      "@type": "GovernmentOrganization",
      name: input.author ?? siteSeo.name,
      url: siteSeo.url,
    },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.url),
    },
    url: absoluteUrl(input.url),
    isPartOf: { "@id": ORG_ID },
  };

  if (input.image) {
    node.image = absoluteUrl(input.image);
  }

  return node;
}

export { absoluteUrl, ORG_ID, OFFICE_ID };
