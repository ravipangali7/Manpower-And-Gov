import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, MapPin, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { CmsPathLink, getBlock } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/demands")({
  loader: () => loadPageSeo("/demands"),
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Demand Lists | Current Overseas Job Demands — VNVNEPAL",
      description:
        "Browse published overseas demand lists from Vision & Value Overseas — positions, employers and destination countries.",
      path: "/demands",
      ogTitle: "Demand Lists | VNVNEPAL",
    }),
  component: DemandsPage,
});

function formatDate(iso: string | null) {
  if (!iso) return null;
  const day = iso.includes("T") ? iso.slice(0, 10) : iso;
  const d = new Date(`${day}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DemandsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["public", "demands"],
    queryFn: () => publicApi.demands(),
    staleTime: 60_000,
    retry: 1,
  });

  const demands = data?.demands ?? [];
  const intro = getBlock(data?.content_blocks, "demands.intro");

  return (
    <SiteLayout partner={false}>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Demands", path: "/demands" },
        ])}
      />
      <PageBanner title="Demand Lists" crumb="Demands" />

      <section className="py-16">
        <div className="mx-auto max-w-[1000px] px-5">
          {(intro?.body || intro?.heading) && (
            <div className="text-[15px] leading-7 text-foreground">
              {intro.heading ? (
                <h2 className="mb-3 text-xl font-bold text-brand-blue">{intro.heading}</h2>
              ) : null}
              {intro.body ? <p>{intro.body}</p> : null}
              {intro.cta_label && intro.cta_path ? (
                <p className="mt-3">
                  <CmsPathLink path={intro.cta_path} className="font-medium text-primary">
                    {intro.cta_label}
                  </CmsPathLink>
                  {" · "}
                  <Link to="/contact" className="font-medium text-primary">
                    Contact partnership desk
                  </Link>
                </p>
              ) : (
                <p className="mt-3">
                  <Link to="/online-registration" className="font-medium text-primary">
                    Register online
                  </Link>
                  {" · "}
                  <Link to="/contact" className="font-medium text-primary">
                    Contact partnership desk
                  </Link>
                </p>
              )}
            </div>
          )}

          <div className="mt-10 space-y-5">
            {isLoading && (
              <p className="py-10 text-sm text-muted-foreground">Loading demand lists…</p>
            )}
            {!isLoading && isError && demands.length === 0 && (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Demand lists are temporarily unavailable.
                </p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
                >
                  Retry
                </button>
              </div>
            )}
            {!isLoading && !isError && demands.length === 0 && (
              <p className="py-10 text-sm text-muted-foreground">
                No demand lists are published right now. Check{" "}
                <Link to="/vacancies" className="font-medium text-primary">
                  available openings
                </Link>{" "}
                or{" "}
                <Link to="/contact" className="font-medium text-primary">
                  contact VNVNEPAL
                </Link>
                .
              </p>
            )}
            {demands.map((d) => {
              const published = formatDate(d.published_at);
              return (
                <article
                  key={d.id}
                  className="border border-border border-b-2 border-b-primary bg-white p-6"
                >
                  <h2 className="text-lg font-bold text-brand-blue">{d.title}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{d.employer}</p>
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-muted-foreground">
                    {d.country_name && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" /> {d.country_name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" /> {d.positions} positions
                    </span>
                    {d.sector_name && (
                      <span className="font-medium text-foreground">{d.sector_name}</span>
                    )}
                  </div>
                  {d.description && (
                    <p className="mt-4 whitespace-pre-wrap text-[13px] leading-6 text-muted-foreground">
                      {d.description}
                    </p>
                  )}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {published && (
                      <span className="text-xs text-muted-foreground">Published {published}</span>
                    )}
                    {d.document_url && (
                      <a
                        href={d.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-brand-blue px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                      >
                        <FileText className="h-3.5 w-3.5" /> View document
                      </a>
                    )}
                    <Link
                      to="/online-registration"
                      className="inline-block bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-primary-foreground"
                    >
                      Apply / Register
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
