import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { SectionTitle } from "@/components/site/SectionTitle";
import { JsonLd } from "@/components/seo/JsonLd";
import { useSiteData } from "@/hooks/use-site-data";
import { publicApi, type CareerOpening } from "@/lib/public-api";
import { buildPageMeta } from "@/lib/seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/careers")({
  head: () =>
    buildPageMeta({
      title: "Careers at VNVNEPAL | Join Our Kathmandu Team",
      description:
        "Explore career openings at Vision & Value Overseas — join our ethical recruitment team in Kathmandu, Nepal.",
      path: "/careers",
      ogTitle: "Careers | VNVNEPAL",
    }),
  component: CareersPage,
});

function CareersPage() {
  const { settings } = useSiteData();
  const { data, isLoading } = useQuery({
    queryKey: ["public", "careers"],
    queryFn: () => publicApi.careers(),
    staleTime: 60_000,
    retry: 1,
  });

  const openings: CareerOpening[] =
    data?.openings?.length
      ? data.openings
      : settings?.career_openings?.length
        ? settings.career_openings
        : [];

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ])}
      />
      <PageBanner title="Careers" crumb="Careers" />

      <section className="py-16">
        <div className="mx-auto max-w-[1000px] px-5">
          <SectionTitle>Join Our Team</SectionTitle>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[15px] leading-7 text-foreground">
            Vision &amp; Value Overseas welcomes professionals who share our commitment to ethical,
            zero-cost recruitment. Explore current openings below or{" "}
            <Link to="/contact" className="font-medium text-primary">
              get in touch
            </Link>
            .
          </p>

          <div className="mt-12 space-y-5">
            {isLoading && openings.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">Loading openings…</p>
            )}
            {!isLoading && openings.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No career openings are listed right now. Please{" "}
                <Link to="/contact" className="font-medium text-primary">
                  contact us
                </Link>{" "}
                to enquire about future roles, or{" "}
                <Link to="/online-registration" className="font-medium text-primary">
                  register for overseas jobs
                </Link>
                .
              </p>
            )}
            {openings.map((o) => (
              <article
                key={o.id}
                className="border border-border border-b-2 border-b-primary bg-white p-6"
              >
                <h2 className="text-lg font-bold text-brand-blue">{o.title}</h2>
                {o.description && (
                  <p className="mt-3 whitespace-pre-wrap text-[13px] leading-6 text-muted-foreground">
                    {o.description}
                  </p>
                )}
                <div className="mt-5">
                  <a
                    href={o.apply_path || "/contact"}
                    {...(o.apply_path?.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="inline-block bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-primary-foreground"
                  >
                    Apply Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
