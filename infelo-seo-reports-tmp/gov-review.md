## GOV Infelo SEO Review (R1–R5) — read-only

**Verdict: NEEDS WORK**

Claimed code fixes mostly hold. Two residual FAILs remain: static sitemap still lists noindex `/search`, and seed notices share duplicate `LONG_BODY` (CMS writers). Ops keys are notes, not code FAILs.

### Claimed fixes

| Claim | Result | Evidence |
|--------|--------|----------|
| Homepage single H1 + `HOMEPAGE_DEFINITION` | **PASS** | `gov/web/src/routes/index.tsx` — one `<h1>`; lead uses `HOMEPAGE_DEFINITION` from `site-seo.ts` |
| `SITE_URL` default `www.dofe.gov.np` | **PASS** | `gov/web/src/config/site-seo.ts` — `envUrl \|\| "https://www.dofe.gov.np"` |
| Sitemap page slugs ↔ `SEED_PAGES` | **PASS** | No `our-mission` / `structure-work`; has `aim-and-vision`, `background`, `structure`, `organization-structure`, `major-scope-of-works`, etc. |
| `privacy-policy` + `terms-of-use` | **PASS** | `cms-seed.ts` `SEED_PAGES` + `public/sitemap.xml` |
| JobPosting ItemList on jobs | **PASS** | `jobs.tsx` → `jobPostingsList()`; `schema.ts` `@type: ItemList` + nested `JobPosting` |
| Team photo `alt={m.name}` | **PASS** | `our-team.tsx` — `AvatarImage ... alt={m.name}` |
| `/search` removed from `STATIC_PUBLIC_PATHS` | **PASS** | `gov/server/core/sitemaps.py` — omitted with comment |
| `sitemap-images.xml` + robots | **PASS** | `public/sitemap-images.xml` exists; `robots.txt` lists both sitemaps |
| IndexNow documented | **PASS** | `server/core/indexnow.py` + signals; `.env.example` docs; `web/src/lib/indexnow.ts` |

### Residual FAILs (not ops-only)

1. **`#10` sitemap** — `STATIC_PUBLIC_PATHS` is clean, but `gov/web/public/sitemap.xml` still includes `https://www.dofe.gov.np/search` while `search.tsx` sets `robots: "noindex,follow"`.
2. **`#42` helpful content** — `cms-seed.ts` reuses the same `LONG_BODY` across notices/acts/etc. Needs CMS writers, not more scaffolding.

### Ops residuals (documented; not code FAIL)

- `VITE_GSC_VERIFICATION`, `INDEXNOW_KEY` / key file, analytics IDs unset (slot + docs present → `#39`/`#50` PASS per checklist).

```json
{
  "product": "Infelo SEO",
  "phase": "REVIEW",
  "scope": "gov/web + gov/server",
  "generated_at": "2026-08-05T15:25:00+05:45",
  "summary": { "pass": 41, "fail": 2, "na": 5 },
  "verdict": "NEEDS WORK",
  "notes": [
    "Claimed FE/BE SEO fixes verified PASS except static sitemap still lists noindex /search.",
    "Residual content FAIL: duplicate LONG_BODY across SEED_CONTENTS — needs CMS writers.",
    "Ops residual (not FAIL): set VITE_GSC_VERIFICATION, INDEXNOW_KEY + /{key}.txt, analytics IDs; submit sitemaps in GSC.",
    "GOV Lovable footprints cleared vs BEFORE AI1 (package dofe-gov-web; no lovable-error-reporting / AGENTS.md)."
  ],
  "claimed_fixes": [
    { "claim": "homepage H1 + HOMEPAGE_DEFINITION", "status": "PASS", "evidence": "gov/web/src/routes/index.tsx; gov/web/src/config/site-seo.ts HOMEPAGE_DEFINITION" },
    { "claim": "SITE_URL default www.dofe.gov.np", "status": "PASS", "evidence": "gov/web/src/config/site-seo.ts resolveSiteUrl default" },
    { "claim": "sitemap page slugs match SEED_PAGES", "status": "PASS", "evidence": "sitemap.xml pages/* ↔ cms-seed SEED_PAGES; no our-mission/structure-work" },
    { "claim": "privacy-policy + terms-of-use", "status": "PASS", "evidence": "cms-seed.ts page-9/10; sitemap.xml loc entries" },
    { "claim": "JobPosting ItemList", "status": "PASS", "evidence": "jobs.tsx JsonLd; schema.ts jobPostingsList ItemList" },
    { "claim": "team alt={m.name}", "status": "PASS", "evidence": "our-team.tsx AvatarImage alt={m.name}" },
    { "claim": "/search out of STATIC_PUBLIC_PATHS", "status": "PASS", "evidence": "server/core/sitemaps.py" },
    { "claim": "sitemap-images.xml + robots", "status": "PASS", "evidence": "public/sitemap-images.xml; robots.txt Sitemap lines" },
    { "claim": "IndexNow documented", "status": "PASS", "evidence": "server indexnow/signals; web/server .env.example; lib/indexnow.ts" }
  ],
  "items": [
    { "id": "1", "name": "Page purpose / one topic", "status": "PASS", "evidence": "Dedicated gov routes: contact, jobs, services, category/content hubs." },
    { "id": "3", "name": "SEO basics", "status": "PASS", "evidence": "buildPageMeta on public routes; site-seo config." },
    { "id": "4", "name": "AEO answer-first", "status": "PASS", "evidence": "index.tsx HOMEPAGE_DEFINITION + FaqSection on home." },
    { "id": "5", "name": "GEO / citable entities", "status": "PASS", "evidence": "site-seo NAP + ministry + FEIMS/Ujuri facts." },
    { "id": "6", "name": "Crawling / internal discovery", "status": "PASS", "evidence": "Nav/footer + sitemap hubs/pages/content." },
    { "id": "7", "name": "Indexing readiness", "status": "PASS", "evidence": "Admin noindex; search noindex,follow; robots Disallow /admin." },
    { "id": "9", "name": "robots.txt", "status": "PASS", "evidence": "gov/web/public/robots.txt Allow/, Disallow /admin, dual Sitemap." },
    { "id": "10", "name": "sitemap.xml", "status": "FAIL", "evidence": "SEED_PAGES slugs aligned, but public/sitemap.xml still lists /search (noindex). Server STATIC_PUBLIC_PATHS correctly omits /search." },
    { "id": "11", "name": "JSON-LD present", "status": "PASS", "evidence": "JsonLd + schema helpers incl. jobs ItemList." },
    { "id": "12", "name": "Schema.org types", "status": "PASS", "evidence": "Gov org/office, FAQ, Article, BreadcrumbList, JobPosting ItemList." },
    { "id": "13", "name": "Structured data validity", "status": "PASS", "evidence": "Required props from siteSeo / visible jobs/FAQ." },
    { "id": "14", "name": "Rich results honesty", "status": "PASS", "evidence": "JobPosting mirrors visible vacancies; no fabricated Review/Product." },
    { "id": "15", "name": "Breadcrumbs", "status": "PASS", "evidence": "PageBar + BreadcrumbList patterns." },
    { "id": "16", "name": "Canonical URL", "status": "PASS", "evidence": "buildPageMeta + SITE_URL https://www.dofe.gov.np default." },
    { "id": "17", "name": "Meta title", "status": "PASS", "evidence": "Per-route head() titles." },
    { "id": "18", "name": "Meta description", "status": "PASS", "evidence": "Per-route descriptions; StaticPage metaDescription." },
    { "id": "19", "name": "Headings / single H1", "status": "PASS", "evidence": "index.tsx single h1; SectionTitle is h2; header has no h1." },
    { "id": "20", "name": "Keywords natural", "status": "PASS", "evidence": "Foreign employment / labour approval in H1 and intro." },
    { "id": "21", "name": "Internal links", "status": "PASS", "evidence": "Home contextual links + nav/footer privacy/terms." },
    { "id": "22", "name": "External refs", "status": "PASS", "evidence": "FEIMS/Ujuri/ministry citations." },
    { "id": "23", "name": "Backlinks", "status": "N/A", "evidence": "Manual strategy only." },
    { "id": "24", "name": "Page speed", "status": "PASS", "evidence": "Lazy images, Vite code-split." },
    { "id": "25", "name": "Mobile friendly", "status": "PASS", "evidence": "Responsive Tailwind + viewport." },
    { "id": "26", "name": "HTTPS absolute URLs", "status": "PASS", "evidence": "resolveSiteUrl forces https; absoluteUrl helpers." },
    { "id": "27", "name": "CWV hygiene", "status": "PASS", "evidence": "Sized media / aspect patterns; font-display=swap." },
    { "id": "28", "name": "Image filenames", "status": "PASS", "evidence": "nepal-emblem, og-default, gallery-*." },
    { "id": "29", "name": "Alt text", "status": "PASS", "evidence": "our-team alt={m.name}; emblem/gallery alts." },
    { "id": "30", "name": "Open Graph", "status": "PASS", "evidence": "buildPageMeta og:*; public/og-default.png." },
    { "id": "31", "name": "Twitter Card", "status": "PASS", "evidence": "summary_large_image + twitter:*." },
    { "id": "32", "name": "FAQ schema", "status": "PASS", "evidence": "FaqSection on home/contact." },
    { "id": "33", "name": "Organization schema", "status": "PASS", "evidence": "Root GovernmentOrganization graph." },
    { "id": "34", "name": "LocalBusiness", "status": "PASS", "evidence": "GovernmentOffice NAP + hours." },
    { "id": "35", "name": "Product schema", "status": "N/A", "evidence": "Not e-commerce." },
    { "id": "36", "name": "Review schema", "status": "N/A", "evidence": "No review system." },
    { "id": "37", "name": "Article schema", "status": "PASS", "evidence": "content.$id Article JSON-LD." },
    { "id": "38", "name": "Video schema", "status": "N/A", "evidence": "No primary video pages." },
    { "id": "39", "name": "Search Console", "status": "PASS", "evidence": "VITE_GSC_VERIFICATION slot + docs; token unset is ops." },
    { "id": "40", "name": "Analytics", "status": "PASS", "evidence": "Env-gated GA/Plausible component." },
    { "id": "41", "name": "EEAT", "status": "PASS", "evidence": "Contact, team, privacy-policy, terms-of-use in seed + sitemap." },
    { "id": "42", "name": "Helpful content", "status": "FAIL", "evidence": "cms-seed.ts LONG_BODY duplicated across SEED_CONTENTS — thin/doorway risk; CMS writers required." },
    { "id": "43", "name": "Freshness", "status": "PASS", "evidence": "sitemap lastmod + article dates/updatedAt fields." },
    { "id": "44", "name": "Topical authority", "status": "PASS", "evidence": "Category hubs + page pillars." },
    { "id": "45", "name": "Entity SEO", "status": "PASS", "evidence": "Central site-seo; package dofe-gov-web; Lovable provenance removed from GOV web." },
    { "id": "46", "name": "Semantic SEO", "status": "PASS", "evidence": "Labour approval, agencies, grievances coverage." },
    { "id": "47", "name": "Content clusters", "status": "PASS", "evidence": "Hub → category → content linking." },
    { "id": "48", "name": "URL structure", "status": "PASS", "evidence": "Lowercase hyphenated public paths." },
    { "id": "49", "name": "Image/video sitemaps", "status": "PASS", "evidence": "public/sitemap-images.xml + robots Sitemap reference." },
    { "id": "50", "name": "IndexNow", "status": "PASS", "evidence": "Django post_save when INDEXNOW_KEY set; FE stub + .env.example documented." },
    { "id": "AI1", "name": "Remove Lovable / AI footprints", "status": "PASS", "evidence": "No lovable deps/reporting/AGENTS.md in gov/web; README is DoFE-branded." }
  ]
}
```