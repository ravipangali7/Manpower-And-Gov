import { useEffect } from "react";

const gaId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();
const plausibleDomain = (import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined)?.trim();

/**
 * Optional analytics — loads only when env vars are set.
 * Set VITE_GA_MEASUREMENT_ID (G-…) and/or VITE_PLAUSIBLE_DOMAIN (e.g. www.vnvnepal.com).
 */
export function Analytics() {
  useEffect(() => {
    if (!gaId || typeof document === "undefined") return;
    if (document.querySelector(`script[data-ga="${gaId}"]`)) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    script.dataset.ga = gaId;
    document.head.appendChild(script);

    const w = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer?.push(args);
    };
    w.gtag("js", new Date());
    w.gtag("config", gaId);
  }, []);

  useEffect(() => {
    if (!plausibleDomain || typeof document === "undefined") return;
    if (document.querySelector(`script[data-plausible="${plausibleDomain}"]`)) return;

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.dataset.plausible = plausibleDomain;
    script.src = "https://plausible.io/js/script.js";
    document.head.appendChild(script);
  }, []);

  return null;
}
