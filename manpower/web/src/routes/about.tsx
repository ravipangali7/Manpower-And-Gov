import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { SectionTitle } from "@/components/site/SectionTitle";
import { AutoPlayVideo } from "@/components/site/AutoPlayVideo";
import { JsonLd } from "@/components/seo/JsonLd";
import { useSiteData } from "@/hooks/use-site-data";
import { publicApi } from "@/lib/public-api";
import { blockMap, CmsPathLink } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";
import { extractYouTubeId, youtubeThumbnailUrl } from "@/lib/video";
import teamImg from "@/assets/about-team.jpg";
import statsBg from "@/assets/stats-bg.jpg";

export const Route = createFileRoute("/about")({
  loader: () => loadPageSeo("/about"),
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "About Vision & Value Overseas (VNVNEPAL) | Ethical Recruiter",
      description:
        "Learn about Vision & Value Overseas Pvt. Ltd. — a decade of ethical, sub-agent free recruitment of Nepali workers for employers worldwide.",
      path: "/about",
      ogTitle: "About Vision & Value Overseas (VNVNEPAL)",
    }),
  component: AboutPage,
});

function AboutPage() {
  const [open, setOpen] = useState(0);
  const { company } = useSiteData();
  const { data, isPending, isSuccess, isError, refetch } = useQuery({
    queryKey: ["public", "about"],
    queryFn: () => publicApi.about(),
  });

  const whyChooseUs = isSuccess
    ? (data?.why_choose_us ?? []).map((w) => ({
        no: w.number,
        title: w.title,
        body: w.body,
      }))
    : [];

  const accordion = isSuccess
    ? (data?.accordion ?? []).map((a) => ({ title: a.title, body: a.body }))
    : [];

  const blocks = blockMap(data?.content_blocks);
  const welcome = blocks["about.welcome"];
  const affiliations = blocks["about.affiliations"];
  const logoStory = blocks["about.logo_story"];
  const whyVideo = blocks["about.why_video"];
  const sourcing = blocks["about.sourcing"];
  const accordionMedia = blocks["about.accordion_media"];
  const accordionImage =
    accordionMedia?.image_url || welcome?.image_url || sourcing?.image_url || teamImg;

  if (isError) {
    return (
      <SiteLayout>
        <PageBanner title="About Us" crumb="About" />
        <div className="mx-auto max-w-[640px] px-5 py-16 text-center">
          <p className="text-sm text-muted-foreground">Could not load about content from the CMS.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageBanner title="About Us" crumb="About" />

      <section className="py-16">
        <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 md:grid-cols-2">
          {isPending && !data ? (
            <div className="col-span-full space-y-4 animate-pulse">
              <div className="h-8 w-64 bg-muted" />
              <div className="h-32 w-full bg-muted" />
            </div>
          ) : (
            <>
              <div>
                {welcome?.heading ? (
                  <p className="text-2xl font-light text-foreground">{welcome.heading}</p>
                ) : null}
                <h2 className="mt-1 text-3xl font-bold leading-tight text-brand-blue">
                  {company.name} ({company.short})
                </h2>
                {welcome?.body ? (
                  <p className="mt-5 text-[15px] leading-7 text-foreground">{welcome.body}</p>
                ) : null}
                {welcome?.body_2 ? (
                  <p className="mt-4 text-justify text-[13px] leading-6 text-muted-foreground">
                    {welcome.body_2}
                  </p>
                ) : null}
                {welcome?.body_3 ? (
                  <p className="mt-4 text-justify text-[13px] leading-6 text-muted-foreground">
                    {welcome.body_3}
                  </p>
                ) : null}
                {welcome?.cta_label && welcome?.cta_path ? (
                  <CmsPathLink
                    path={welcome.cta_path}
                    className="mt-5 inline-block text-[13px] font-medium text-primary"
                  >
                    {welcome.cta_label} ›
                  </CmsPathLink>
                ) : null}
              </div>
              <img
                src={welcome?.image_url || teamImg}
                alt="Vision & Value Overseas staff group photo"
                loading="lazy"
                width={1200}
                height={800}
                className="w-full object-cover"
              />
            </>
          )}
        </div>
      </section>

      {affiliations?.body ? (
        <section className="border-y border-border bg-white py-10">
          <div className="mx-auto max-w-[800px] px-5 text-center text-[13px] leading-6 text-muted-foreground">
            <p>{affiliations.body}</p>
          </div>
        </section>
      ) : null}

      {(logoStory?.heading || logoStory?.body || logoStory?.image_url) && (
        <section className="bg-section py-16">
          <div className="mx-auto max-w-[1240px] px-5">
            {logoStory.heading ? <SectionTitle>{logoStory.heading}</SectionTitle> : null}
            {logoStory.body ? (
              <p className="mx-auto mt-5 max-w-3xl text-center text-[13px] leading-6 text-muted-foreground">
                {logoStory.body}
              </p>
            ) : null}
            <div className="mt-12 flex justify-center overflow-x-auto">
              {logoStory.image_url ? (
                <img
                  src={logoStory.image_url}
                  alt={logoStory.heading || "Story of our logo"}
                  loading="lazy"
                  className="h-auto w-full max-w-[420px] object-contain"
                />
              ) : (
                <svg
                  width="420"
                  height="240"
                  viewBox="0 0 420 240"
                  className="h-auto w-full max-w-[420px] shrink-0"
                  aria-hidden="true"
                >
                  <path d="M120 190 L180 60 L215 190 Z" fill="oklch(0.564 0.183 28.5)" />
                  <circle cx="180" cy="150" r="34" fill="#fff" />
                  <path d="M225 60 L320 60 L270 190 Z" fill="oklch(0.55 0.13 244)" />
                  <path d="M330 60 L370 60 L350 130 Z" fill="oklch(0.55 0.13 244)" />
                  <text x="10" y="110" fontSize="11" fill="oklch(0.28 0.01 250)">
                    HUMAN RESOURCES
                  </text>
                  <text x="215" y="30" fontSize="11" fill="oklch(0.28 0.01 250)">
                    VALUE CREATED
                  </text>
                  <text x="228" y="50" fontSize="11" fill="oklch(0.28 0.01 250)">
                    OUTPUT
                  </text>
                  <text x="330" y="180" fontSize="11" fill="oklch(0.28 0.01 250)">
                    GOODS &amp; SERVICES
                  </text>
                  <text x="110" y="222" fontSize="11" fill="oklch(0.28 0.01 250)">
                    INPUT
                  </text>
                  <text x="180" y="236" fontSize="11" fill="oklch(0.28 0.01 250)">
                    VISION
                  </text>
                </svg>
              )}
            </div>
          </div>
        </section>
      )}

      {(whyVideo?.heading ||
        whyVideo?.subheading ||
        whyVideo?.body ||
        whyVideo?.video_url ||
        whyChooseUs.length > 0) && (
        <section aria-labelledby="why-choose-us-heading">
          {(whyVideo?.heading || whyVideo?.subheading || whyVideo?.body || whyVideo?.video_url) && (
            <div className="relative py-16 md:py-20">
              <img
                src={whyVideo?.image_url || statsBg}
                alt=""
                loading="lazy"
                width={1920}
                height={700}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[oklch(0.32_0.03_220)]/80" />
              <div className="relative mx-auto max-w-[1000px] px-5 text-center">
                {whyVideo?.subheading ? (
                  <p
                    id="why-choose-us-heading"
                    className="text-sm font-semibold text-brand-blue-light md:text-base"
                  >
                    {whyVideo.subheading}
                  </p>
                ) : (
                  <h2 id="why-choose-us-heading" className="sr-only">
                    Why Choose Us
                  </h2>
                )}
                {whyVideo?.heading ? (
                  <p className="mx-auto mt-3 max-w-3xl text-xl font-medium leading-relaxed text-white md:text-2xl lg:text-3xl">
                    {whyVideo.heading}
                  </p>
                ) : null}
                {whyVideo?.video_url ? (
                  <>
                    <div className="mx-auto mt-10 w-full max-w-[860px]">
                      <AutoPlayVideo
                        url={whyVideo.video_url}
                        title={
                          [whyVideo.body_2, whyVideo.body].filter(Boolean).join(" — ") ||
                          whyVideo.heading ||
                          "Why choose Vision & Value Overseas"
                        }
                        posterUrl={whyVideo.image_url}
                        autoPlay
                      />
                    </div>
                    {extractYouTubeId(whyVideo.video_url) ? (
                      <JsonLd
                        data={{
                          "@context": "https://schema.org",
                          "@type": "VideoObject",
                          name:
                            whyVideo.body_2 && whyVideo.body
                              ? `${whyVideo.body_2} — ${whyVideo.body}`
                              : whyVideo.heading || "Vision & Value Overseas introductory video",
                          description: whyVideo.heading || whyVideo.body || undefined,
                          thumbnailUrl:
                            whyVideo.image_url ||
                            youtubeThumbnailUrl(whyVideo.video_url) ||
                            undefined,
                          embedUrl: `https://www.youtube.com/embed/${extractYouTubeId(whyVideo.video_url)}`,
                          contentUrl: whyVideo.video_url,
                          publisher: {
                            "@type": "Organization",
                            name: company.name,
                          },
                        }}
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>
          )}

          {whyChooseUs.length > 0 && (
            <div className="bg-white py-14 md:py-16">
              <div className="mx-auto grid max-w-[1240px] gap-x-10 gap-y-12 px-5 sm:grid-cols-2 md:grid-cols-3">
                {whyChooseUs.map((w) => (
                  <article key={w.no + w.title}>
                    <p className="text-lg font-bold text-primary">{w.no}</p>
                    <h3 className="mt-1 text-lg font-bold text-foreground">{w.title}</h3>
                    <p className="mt-3 text-[13px] leading-6 text-muted-foreground">{w.body}</p>
                    {whyVideo?.cta_label && whyVideo?.cta_path ? (
                      <CmsPathLink
                        path={whyVideo.cta_path}
                        className="mt-3 inline-block text-[13px] font-medium text-primary"
                      >
                        {whyVideo.cta_label} »
                      </CmsPathLink>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {accordion.length > 0 && (
        <section className="bg-section py-16">
          <div className="mx-auto grid max-w-[1240px] items-start gap-10 px-5 md:grid-cols-2">
            <div>
              {accordion.map((a, i) => (
                <div key={a.title} className="mb-1">
                  <button
                    type="button"
                    onClick={() => setOpen(open === i ? -1 : i)}
                    className="flex w-full items-center justify-between bg-brand-blue px-4 py-3 text-left text-sm font-medium text-white"
                  >
                    {a.title}
                    <ChevronUp
                      className={`h-4 w-4 transition-transform ${open === i ? "" : "rotate-180"}`}
                    />
                  </button>
                  {open === i && (
                    <div className="border border-t-0 border-border bg-white p-4">
                      <p className="text-[13px] leading-6 text-muted-foreground">{a.body}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <img
              src={accordionImage}
              alt="Candidates at a VNVNEPAL orientation"
              loading="lazy"
              width={1200}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      )}

      {(sourcing?.heading || sourcing?.body) && (
        <section className="py-16">
          <div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 md:grid-cols-2">
            <img
              src={sourcing.image_url || teamImg}
              alt="Pre-departure briefing session"
              loading="lazy"
              width={1200}
              height={800}
              className="w-full object-cover"
            />
            <div>
              {sourcing.heading ? (
                <h2 className="text-2xl font-bold text-brand-blue">{sourcing.heading}</h2>
              ) : null}
              {sourcing.body ? (
                <p className="mt-5 text-justify text-[13px] leading-6 text-muted-foreground">
                  {sourcing.body}
                </p>
              ) : null}
              {sourcing.body_2 ? (
                <p className="mt-4 text-justify text-[13px] leading-6 text-muted-foreground">
                  {sourcing.body_2}
                </p>
              ) : null}
              {sourcing.body_3 ? (
                <p className="mt-4 text-justify text-[13px] leading-6 text-muted-foreground">
                  {sourcing.body_3}{" "}
                  Explore our{" "}
                  <Link to="/services" className="font-medium text-primary">
                    recruitment services
                  </Link>
                  , view{" "}
                  <Link to="/vacancies" className="font-medium text-primary">
                    current vacancies
                  </Link>
                  , or{" "}
                  <Link to="/contact" className="font-medium text-primary">
                    get in touch
                  </Link>
                  .
                </p>
              ) : null}
              {sourcing.cta_label && sourcing.cta_path ? (
                <CmsPathLink
                  path={sourcing.cta_path}
                  className="mt-5 inline-block bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-primary-foreground"
                >
                  {sourcing.cta_label}
                </CmsPathLink>
              ) : null}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
