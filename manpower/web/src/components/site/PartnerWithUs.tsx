import { Link } from "@tanstack/react-router";
import { SectionTitle } from "./SectionTitle";
import { useSiteData } from "@/hooks/use-site-data";

export function PartnerWithUs() {
  const { settings } = useSiteData();
  const heading = settings?.partner_cta_heading || "Partner With Us";
  const body = settings?.partner_cta_body || "";
  const buttonLabel = settings?.partner_cta_button_label || "Partner With Us";
  const buttonPath = settings?.partner_cta_button_path || "/contact";

  if (!settings) return null;

  return (
    <section
      className="relative pt-16"
      style={{
        background:
          "linear-gradient(to bottom, var(--section) 0%, var(--section) 55%, var(--footer) 55%, var(--footer) 100%)",
      }}
    >
      <div className="relative z-10 mx-auto max-w-[1240px] px-5">
        <div className="relative overflow-hidden bg-brand-blue-light px-6 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <svg width="100%" height="100%" aria-hidden="true">
              <defs>
                <pattern id="tri" width="160" height="160" patternUnits="userSpaceOnUse">
                  <path d="M20 100 L45 55 L70 100 Z" fill="none" stroke="#fff" strokeWidth="2" />
                  <path d="M110 40 L140 40 L125 70 Z" fill="#fff" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tri)" />
            </svg>
          </div>
          <div className="relative">
            <div className="[&_h2]:text-white">
              <SectionTitle>{heading}</SectionTitle>
            </div>
            <p className="mx-auto mt-6 max-w-3xl text-[15px] leading-7 text-white/95">{body}</p>
            <Link
              to={buttonPath}
              className="mt-8 inline-block bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wide text-primary transition-opacity hover:opacity-90"
            >
              {buttonLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
