import { company } from "@/data/site";
import { SITE_URL, absoluteUrl, seo } from "@/lib/seo";

export { SITE_URL, absoluteUrl };

const ORG_ID = () => `${SITE_URL}/#organization`;
const LOGO_ID = () => `${SITE_URL}/#logo`;

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ArticleInput = {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  path: string;
  image?: string | null;
};

/** Organization + EmploymentAgency (LocalBusiness) for @graph injection. */
export function buildOrganizationGraph() {
  const logoUrl = absoluteUrl(seo.logoPath);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ImageObject",
        "@id": LOGO_ID(),
        url: logoUrl,
        contentUrl: logoUrl,
        caption: company.name,
      },
      {
        "@type": ["Organization", "EmploymentAgency"],
        "@id": ORG_ID(),
        name: company.name,
        alternateName: company.short,
        url: SITE_URL,
        logo: { "@id": LOGO_ID() },
        image: { "@id": LOGO_ID() },
        email: company.email,
        telephone: company.phones,
        address: {
          "@type": "PostalAddress",
          streetAddress: company.address.replace(/,\s*Kathmandu,\s*Nepal$/i, ""),
          addressLocality: "Kathmandu",
          addressRegion: "Bagmati",
          addressCountry: "NP",
        },
        // Matches contact FAQ "Business Hours" (visible on /contact)
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:30",
          closes: "17:30",
        },
        // Countries listed on vacancies filters + Japan (SSW news) — no sameAs (footer links are #)
        areaServed: [
          { "@type": "Country", name: "Nepal" },
          { "@type": "Country", name: "United Arab Emirates" },
          { "@type": "Country", name: "Qatar" },
          { "@type": "Country", name: "Kuwait" },
          { "@type": "Country", name: "Saudi Arabia" },
          { "@type": "Country", name: "Bahrain" },
          { "@type": "Country", name: "Oman" },
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Country", name: "Malaysia" },
          { "@type": "Country", name: "Maldives" },
          { "@type": "Country", name: "Japan" },
        ],
        description:
          "An ethical and fair overseas recruitment agency in Kathmandu, Nepal — zero-cost, sub-agent free placement for employers and Nepali candidates.",
      },
    ],
  };
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
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

export function buildFaqPage(faqs: FaqItem[]) {
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

export function buildArticle(input: ArticleInput) {
  const url = absoluteUrl(input.path);
  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: {
      "@type": "Person",
      name: input.author,
    },
    publisher: {
      "@id": ORG_ID(),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
  if (input.image) {
    article.image = absoluteUrl(input.image);
  }
  return article;
}

export type VideoObjectInput = {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  embedUrl?: string;
  /** ISO-8601 date; omit when unknown — do not fabricate. */
  uploadDate?: string;
};

/**
 * VideoObject JSON-LD. Returns null when required fields are missing.
 * Does not invent uploadDate.
 */
export function buildVideoObject(input: VideoObjectInput) {
  const name = input.name.trim();
  const description = input.description.trim();
  const thumbnailUrl = input.thumbnailUrl.trim();
  const contentUrl = input.contentUrl.trim();
  if (!name || !description || !thumbnailUrl || !contentUrl) return null;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    contentUrl,
    publisher: {
      "@id": ORG_ID(),
    },
  };

  if (input.embedUrl?.trim()) {
    schema.embedUrl = input.embedUrl.trim();
  }
  if (input.uploadDate?.trim()) {
    schema.uploadDate = input.uploadDate.trim();
  }

  return schema;
}
