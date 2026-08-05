import { Link } from "@tanstack/react-router";
import type { ElementType } from "react";
import bannerImg from "@/assets/page-banner.jpg";

export type BannerCrumb = {
  label: string;
  to?: string;
};

type PageBannerProps = {
  title: string;
  /** Simple final crumb label (Home › crumb). */
  crumb?: string;
  /** Multi-segment breadcrumbs; preferred when linking intermediate pages. */
  crumbs?: BannerCrumb[];
  /** Heading element for the banner title. Use `p` when the page already has an H1. */
  titleAs?: "h1" | "h2" | "p";
  /** Hide the banner title (breadcrumb only) when another H1 exists on the page. */
  hideTitle?: boolean;
  /** Descriptive alt for the banner image; defaults to page title context. */
  imageAlt?: string;
};

export function PageBanner({
  title,
  crumb,
  crumbs,
  titleAs = "h1",
  hideTitle = false,
  imageAlt,
}: PageBannerProps) {
  const TitleTag = titleAs as ElementType;
  const alt =
    imageAlt ??
    `${title} page banner — Vision & Value Overseas recruitment agency Nepal`;

  const segments: BannerCrumb[] =
    crumbs && crumbs.length > 0
      ? crumbs
      : crumb
        ? [{ label: crumb }]
        : [{ label: title }];

  return (
    <section className="relative h-[320px] w-full overflow-hidden">
      <img
        src={bannerImg}
        alt={alt}
        width={1920}
        height={520}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="banner-overlay absolute inset-0" />
      <div className="relative flex h-full flex-col items-center justify-center px-5 pt-24 text-center sm:pt-28">
        {!hideTitle && (
          <TitleTag className="text-4xl font-bold text-white md:text-5xl">{title}</TitleTag>
        )}
        <p
          className={`text-xs font-semibold uppercase tracking-wide text-white/85 ${
            hideTitle ? "" : "mt-3"
          }`}
        >
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          {segments.map((seg) => (
            <span key={seg.label}>
              <span className="mx-2">›</span>
              {seg.to ? (
                <Link to={seg.to} className="hover:text-primary">
                  {seg.label}
                </Link>
              ) : (
                <span className="text-white/70">{seg.label}</span>
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
