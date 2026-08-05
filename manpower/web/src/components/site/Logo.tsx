import { useSiteData } from "@/hooks/use-site-data";

type LogoProps = {
  /** Kept for callers; brand mark is a full-color image on all backgrounds. */
  light?: boolean;
  className?: string;
  /** Intrinsic height attribute for layout (live site uses 80). */
  height?: number;
};

export function Logo({ className = "h-20", height = 80 }: LogoProps) {
  const { settings, company } = useSiteData();
  const src = settings?.logo_url;
  const alt =
    company.name ||
    settings?.company_name ||
    "Vision & Value Overseas Pvt. Ltd. — Ethical Recruitment Agency Nepal";
  const textFallback = settings?.short_name || company.name || settings?.company_name || "";

  if (!src) {
    if (!textFallback) return null;
    return (
      <span
        className={`inline-flex items-center font-bold tracking-tight text-brand-blue ${className}`}
        style={{ fontSize: Math.max(14, Math.round(height * 0.28)) }}
      >
        {textFallback}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      width={Math.round(height * (1393 / 417))}
      className={`w-auto object-contain ${className}`}
      decoding="async"
    />
  );
}
