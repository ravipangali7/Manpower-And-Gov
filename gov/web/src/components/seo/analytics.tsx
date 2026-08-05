import { useEffect } from "react";

/**
 * Loads Google Analytics (gtag) and/or Plausible only when env IDs are set.
 * No-op when neither VITE_GA_ID nor VITE_PLAUSIBLE_DOMAIN is configured.
 *
 * Manual follow-ups (cannot finish in code alone):
 * 1. Create a Google Search Console property for the production domain.
 * 2. Set VITE_GSC_VERIFICATION to the HTML-tag token (or use DNS verification).
 * 3. Submit sitemap.xml (usually /sitemap.xml) in Search Console → Sitemaps.
 * 4. Set VITE_GA_ID (G-XXXXXXXX) and/or VITE_PLAUSIBLE_DOMAIN for measurement.
 */

const GA_ID = (import.meta.env.VITE_GA_ID as string | undefined)?.trim();
const PLAUSIBLE_DOMAIN = (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined)?.trim();

function loadScript(src: string, attrs: Record<string, string> = {}) {
  if (typeof document === "undefined") return;
  if (document.querySelector(`script[src="${src}"]`)) return;
  const el = document.createElement("script");
  el.src = src;
  el.async = true;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.head.appendChild(el);
}

export function Analytics() {
  useEffect(() => {
    if (GA_ID) {
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`);
      const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
      w.dataLayer = w.dataLayer || [];
      w.gtag = function gtag(...args: unknown[]) {
        w.dataLayer!.push(args);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID);
    }

    if (PLAUSIBLE_DOMAIN) {
      loadScript("https://plausible.io/js/script.js", {
        defer: "",
        "data-domain": PLAUSIBLE_DOMAIN,
      });
    }
  }, []);

  return null;
}
