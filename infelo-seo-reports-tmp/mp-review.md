## Manpower Infelo SEO Review (R1–R5, read-only)

**Verdict: NEEDS WORK**

Verified checklist items mostly pass. Residual gaps (SPA crawl risk, IndexNow key ops, Article JSON-LD `image`, one decorative `alt` without `aria-hidden`) block a clean READY.

```json
{
  "product": "Infelo SEO",
  "phase": "REVIEW",
  "site": "manpower",
  "generated_at": "2026-08-05",
  "verdict": "NEEDS WORK",
  "summary": { "pass": 7, "fail": 4, "na": 1 },
  "checklist": [
    {
      "id": "R1-SITE_URL",
      "item": "SITE_URL default www.vnvnepal.com",
      "status": "PASS",
      "evidence": "web/src/config/seo.ts + web/src/lib/seo.ts default https://www.vnvnepal.com; server settings FRONTEND_URL/SITE_URL same"
    },
    {
      "id": "R1-SITEMAP",
      "item": "sitemap includes methodology, ethical-recruitment, gallery, careers, demands without duplicates",
      "status": "PASS",
      "evidence": "public/sitemap.xml: 28 locs, 28 unique; all five paths present once"
    },
    {
      "id": "R2-FAQ",
      "item": "FAQPage only when faqs.length > 0 (contact.tsx)",
      "status": "PASS",
      "evidence": "contact.tsx gates JsonLd buildFaqPage behind faqs.length > 0"
    },
    {
      "id": "R3-INDEXNOW",
      "item": "IndexNow FE + Django signals exist",
      "status": "PASS",
      "evidence": "web/src/lib/indexnow.ts; server/core/indexnow.py; signals.py wired via apps.py ready()"
    },
    {
      "id": "R3-VIDEO",
      "item": "VideoObject helper + about.tsx usage",
      "status": "PASS",
      "evidence": "buildVideoObject in schema.ts; about.tsx emits JsonLd when YouTube id + required fields present"
    },
    {
      "id": "R4-QUICKLINKS",
      "item": "quickLinks VNV Gallery → /gallery + cluster links",
      "status": "PASS",
      "evidence": "site.ts quickLinks: Gallery→/gallery + ethical/methodology/careers/demands; seed QuickLink has Gallery/demands/careers; methodology in main nav; ethical in footer"
    },
    {
      "id": "R4-ALT",
      "item": "Remaining empty alt=\"\" only on decorative/aria-hidden backgrounds",
      "status": "FAIL",
      "evidence": "Only 2 empty alts in src (index.tsx). Testimonial bg is aria-hidden. Stats section bg (alt=\"\") is decorative but NOT wrapped in aria-hidden"
    },
    {
      "id": "R5-ENV",
      "item": ".env.example production URL",
      "status": "PASS",
      "evidence": "web/.env.example VITE_SITE_URL=https://www.vnvnepal.com; server/.env.example FRONTEND_URL/SITE_URL same"
    },
    {
      "id": "RES-SPA",
      "item": "CSR SPA crawl risk",
      "status": "FAIL",
      "evidence": "vite.config.ts spa.enabled=true with single index.html prerender — route HTML/meta may be thin for non-JS crawlers"
    },
    {
      "id": "RES-INDEXNOW-OPS",
      "item": "IndexNow key provisioning",
      "status": "FAIL",
      "evidence": "INDEXNOW_KEY / VITE_INDEXNOW_KEY commented unset; soft no-op until key + /{key}.txt hosted"
    },
    {
      "id": "RES-ARTICLE-IMAGE",
      "item": "Article JSON-LD image",
      "status": "FAIL",
      "evidence": "buildArticle/ArticleInput have no image; news.$slug.tsx cover used for og:image meta but not Article schema"
    },
    {
      "id": "RES-CAREERS-SHELL",
      "item": "Empty careers/demands shells",
      "status": "NA",
      "evidence": "Routes have real head/meta, breadcrumbs, copy + empty-state UX when CMS lists are empty — not blank shells"
    }
  ],
  "residual_fails": [
    "CSR SPA risk (spa mode + index-only prerender)",
    "IndexNow ops: key + verification file not provisioned (code ready, pings no-op)",
    "Article schema missing image despite cover_image_url / og:image path",
    "index.tsx stats background: alt=\"\" without aria-hidden parent"
  ],
  "notes": [
    "Footer quickLinks are CMS-driven (not site.ts export); seed omits methodology/ethical from QuickLink table but they exist in nav/footer",
    "Careers/demands can render zero items from CMS — content emptiness is ops/data, not an empty route shell"
  ]
}
```

### Residual FAILs (honest)
1. **CSR SPA risk** — `spa.enabled: true` + prerender only `/index.html`
2. **IndexNow key ops** — implementation present; production key + `{key}.txt` not set
3. **Article `image`** — still absent from `buildArticle` JSON-LD
4. **Decorative alt** — stats background `alt=""` without `aria-hidden` (testimonials OK)

**Verdict: NEEDS WORK**