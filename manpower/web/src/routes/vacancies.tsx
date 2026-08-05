import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronRight, MapPin, Users } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { bodyLines, CmsPathLink, getBlock } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

type VacanciesSearch = {
  sector?: string;
  country?: string;
  sort?: string;
};

export const Route = createFileRoute("/vacancies")({
  validateSearch: (search: Record<string, unknown>): VacanciesSearch => ({
    sector: typeof search.sector === "string" && search.sector ? search.sector : undefined,
    country: typeof search.country === "string" && search.country ? search.country : undefined,
    sort: typeof search.sort === "string" && search.sort ? search.sort : undefined,
  }),
  loader: () => loadPageSeo("/vacancies"),
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Available Openings | Overseas Jobs from Nepal — VNVNEPAL",
      description:
        "Browse current overseas job openings in Qatar, Kuwait, UAE and more. Free, ethical recruitment through Vision & Value Overseas.",
      path: "/vacancies",
      ogTitle: "Available Openings | VNVNEPAL",
    }),
  component: VacanciesPage,
});

function VacanciesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sector, setSector] = useState<string | null>(search.sector ?? null);
  const [country, setCountry] = useState<string | null>(search.country ?? null);
  const [sort, setSort] = useState(search.sort || "newest");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    setSector(search.sector ?? null);
    setCountry(search.country ?? null);
    setSort(search.sort || "newest");
  }, [search.sector, search.country, search.sort]);

  const syncSearch = (next: {
    sector?: string | null;
    country?: string | null;
    sort?: string;
  }) => {
    void navigate({
      to: "/vacancies",
      search: {
        sector: next.sector || undefined,
        country: next.country || undefined,
        sort: next.sort && next.sort !== "newest" ? next.sort : undefined,
      },
      replace: true,
    });
  };

  const { data, isSuccess, isPending, isError, refetch } = useQuery({
    queryKey: ["public", "vacancies", sector, country, sort],
    queryFn: () =>
      publicApi.vacancies({
        sector: sector ?? undefined,
        country: country ?? undefined,
        sort: sort === "newest" ? undefined : sort,
      }),
  });

  const sortedJobs = isSuccess ? data?.jobs ?? [] : [];
  const jobSectors = isSuccess
    ? (data?.job_sectors ?? []).map((s) => ({ name: s.name, count: s.count }))
    : [];
  const jobCountries = isSuccess
    ? (data?.job_countries ?? []).map((c) => ({ name: c.name, count: c.count }))
    : [];
  const intro = getBlock(data?.content_blocks, "vacancies.intro");
  const nextSteps = getBlock(data?.content_blocks, "vacancies.next_steps");
  const nextStepItems = bodyLines(nextSteps?.body);

  return (
    <SiteLayout partner={false}>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Available Openings", path: "/vacancies" },
        ])}
      />
      <PageBanner title="Available Openings" crumb="Available Openings" />

      <section className="py-16">
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 lg:grid-cols-[300px_1fr]">
          <aside className="space-y-8">
            <FilterBox
              title="Filter by Sector"
              items={jobSectors}
              active={sector}
              onSelect={(n) => {
                const next = sector === n ? null : n;
                setSector(next);
                syncSearch({ sector: next, country, sort });
              }}
            />
            <FilterBox
              title="Filter by Country"
              items={jobCountries}
              active={country}
              onSelect={(n) => {
                const next = country === n ? null : n;
                setCountry(next);
                syncSearch({ sector, country: next, sort });
              }}
            />
            {(sector || country) && (
              <button
                type="button"
                onClick={() => {
                  setSector(null);
                  setCountry(null);
                  syncSearch({ sector: null, country: null, sort });
                }}
                className="text-[12px] font-bold uppercase tracking-wide text-primary"
              >
                Clear filters
              </button>
            )}
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-brand-blue pb-4">
              <h2 className="text-xl font-bold text-foreground">
                {intro?.heading || "Explore All the Job Openings Available"}
              </h2>
              <select
                value={sort}
                onChange={(e) => {
                  const next = e.target.value;
                  setSort(next);
                  syncSearch({ sector, country, sort: next });
                }}
                aria-label="Sort by"
                className="border border-input px-3 py-2 text-sm text-muted-foreground outline-none"
              >
                <option value="newest">Sort By</option>
                <option value="vacancies">Most Vacancies</option>
                <option value="title">Title (A–Z)</option>
              </select>
            </div>
            {intro?.body ? (
              <p className="mt-4 text-[13px] leading-6 text-muted-foreground">{intro.body}</p>
            ) : null}

            {isError ? (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">Could not load vacancies.</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="mt-4 bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-5">
                {isPending && !data
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="animate-pulse border border-border bg-white p-6">
                        <div className="h-5 w-48 bg-muted" />
                        <div className="mt-3 h-4 w-32 bg-muted" />
                        <div className="mt-4 h-4 w-64 bg-muted" />
                      </div>
                    ))
                  : sortedJobs.map((j) => (
                      <div
                        key={`${j.id}-${j.title}-${j.company}-${j.country}`}
                        className="border border-border border-b-2 border-b-primary bg-white p-6"
                      >
                        <h3 className="text-lg font-bold text-brand-blue">{j.title}</h3>
                        <p className="mt-1 text-[13px] text-muted-foreground">{j.company}</p>
                        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[13px] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary" /> {j.country}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary" /> {j.vacancies} vacancies
                          </span>
                          <span className="font-medium text-foreground">{j.salary}</span>
                          {j.deadline ? (
                            <span className="text-foreground">
                              Deadline{" "}
                              {new Date(j.deadline).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          ) : null}
                        </div>
                        {(j.description || j.requirements) && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => setExpanded(expanded === j.id ? null : j.id)}
                              className="text-[12px] font-bold uppercase tracking-wide text-primary"
                            >
                              {expanded === j.id ? "Hide details" : "View details"}
                            </button>
                            {expanded === j.id && (
                              <div className="mt-3 space-y-3 text-[13px] leading-6 text-muted-foreground">
                                {j.description ? (
                                  <p className="whitespace-pre-wrap">{j.description}</p>
                                ) : null}
                                {j.requirements ? (
                                  <p className="whitespace-pre-wrap">
                                    <span className="font-semibold text-foreground">
                                      Requirements:{" "}
                                    </span>
                                    {j.requirements}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSector(j.sector);
                              syncSearch({ sector: j.sector, country, sort });
                            }}
                            className="inline-block bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-primary-foreground"
                          >
                            {j.sector}
                          </button>
                          <Link
                            to="/online-registration"
                            className="inline-block border border-brand-blue px-5 py-2 text-[11px] font-bold uppercase tracking-wide text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                          >
                            Apply / Register
                          </Link>
                        </div>
                      </div>
                    ))}
                {!isPending && sortedJobs.length === 0 && (
                  <p className="py-10 text-sm text-muted-foreground">
                    No openings match the selected filters right now. Clear filters, or{" "}
                    <Link to="/contact" className="font-medium text-primary">
                      contact VNVNEPAL
                    </Link>{" "}
                    to ask about upcoming demands.
                  </p>
                )}
              </div>
            )}

            {(nextSteps?.heading || nextStepItems.length > 0) && (
              <div className="mt-10 border border-border bg-section p-6">
                <h3 className="text-base font-bold text-brand-blue">
                  {nextSteps?.heading || "Next steps"}
                </h3>
                {nextStepItems.length > 0 ? (
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-[13px] leading-6 text-muted-foreground">
                    {nextStepItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                ) : null}
                {nextSteps?.cta_label && nextSteps?.cta_path ? (
                  <CmsPathLink
                    path={nextSteps.cta_path}
                    className="mt-4 inline-block text-[13px] font-medium text-primary"
                  >
                    {nextSteps.cta_label} ›
                  </CmsPathLink>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function FilterBox({
  title,
  items,
  active,
  onSelect,
}: {
  title: string;
  items: { name: string; count: number }[];
  active: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="bg-section p-6">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <ul className="mt-4">
        {items.map((i) => (
          <li key={i.name}>
            <button
              type="button"
              onClick={() => onSelect(i.name)}
              className={`flex w-full items-center justify-between border-b border-border py-2.5 text-left text-[13px] ${
                active === i.name ? "font-bold text-primary" : "text-primary/90"
              }`}
            >
              {i.name} ({i.count})
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
