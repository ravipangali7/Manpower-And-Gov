import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { Briefcase, Search } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi, type ContentBlock, type ServiceSector } from "@/lib/public-api";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/services/")({
  loader: async ({ context: { queryClient } }) => {
    const [seo] = await Promise.all([
      loadPageSeo("/services/"),
      queryClient.ensureQueryData({
        queryKey: ["public", "services"],
        queryFn: () => publicApi.services(),
      }),
    ]);
    return seo;
  },
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Our Services | Manpower Recruitment Sectors — VNVNEPAL",
      description:
        "Hospitality, catering, construction, healthcare, aviation and 30+ more sectors staffed by Vision & Value Overseas from Nepal.",
      path: "/services/",
      ogTitle: "Our Services | VNVNEPAL Recruitment Sectors",
    }),
  component: ServicesPage,
});

function getBlock(blocks: ContentBlock[] | undefined, key: string) {
  return blocks?.find((b) => b.key === key);
}

function CmsPathLink({
  path,
  className,
  children,
}: {
  path: string;
  className?: string;
  children: ReactNode;
}) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return (
      <a href={path} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={path} className={className}>
      {children}
    </Link>
  );
}

function ServicesPage() {
  const [query, setQuery] = useState("");
  const { data, isPending, isSuccess, isError, refetch } = useQuery({
    queryKey: ["public", "services"],
    queryFn: () => publicApi.services(),
  });

  const sectors = isSuccess ? data?.sectors ?? [] : [];
  const intro = getBlock(data?.content_blocks, "services.intro");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sectors;
    return sectors.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q),
    );
  }, [sectors, query]);

  if (isError) {
    return (
      <SiteLayout>
        <PageBanner title="Our Services" crumb="Services" />
        <div className="mx-auto max-w-[640px] px-5 py-16 text-center">
          <p className="text-sm text-muted-foreground">Could not load services from the CMS.</p>
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
          { name: "Services", path: "/services/" },
        ])}
      />
      <PageBanner title="Our Services" crumb="Services" />

      <section className="py-16">
        <div className="mx-auto max-w-[1000px] px-5">
          {isPending && !data ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-72 bg-muted" />
              <div className="h-20 w-full bg-muted" />
              <div className="h-16 w-full bg-muted" />
            </div>
          ) : intro?.heading || intro?.body || intro?.body_2 || intro?.body_3 ? (
            <>
              {intro?.heading ? (
                <h2 className="text-2xl font-bold text-brand-blue">{intro.heading}</h2>
              ) : null}
              {intro?.subheading ? (
                <p className="mt-2 text-sm font-medium text-muted-foreground">{intro.subheading}</p>
              ) : null}
              {intro?.image_url ? (
                <img
                  src={intro.image_url}
                  alt={intro.heading || intro.subheading || "Recruitment services"}
                  className="mt-6 max-h-72 w-full object-cover"
                />
              ) : null}
              {intro?.body ? (
                <p className="mt-4 text-[15px] leading-7 text-foreground">{intro.body}</p>
              ) : null}
              {intro?.body_2 ? (
                <p className="mt-6 text-[15px] leading-7 text-foreground">{intro.body_2}</p>
              ) : null}
              {intro?.body_3 ? (
                <p className="mt-6 text-[15px] leading-7 text-foreground">{intro.body_3}</p>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-3">
                {intro?.cta_label && intro?.cta_path ? (
                  <CmsPathLink
                    path={intro.cta_path}
                    className="inline-block bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {intro.cta_label}
                  </CmsPathLink>
                ) : (
                  <Link
                    to="/services/overseas-recruitment"
                    className="inline-block bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Overseas recruitment process
                  </Link>
                )}
                <Link
                  to="/vacancies"
                  className="inline-block border border-brand-blue px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                >
                  Available openings
                </Link>
                <Link
                  to="/contact"
                  className="inline-block border border-border px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-brand-blue hover:text-brand-blue"
                >
                  Partnership desk
                </Link>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add a content block with key <code>services.intro</code> in the admin panel to edit this
              section.
            </p>
          )}
        </div>

        <div className="mx-auto mt-14 max-w-[1000px] px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-blue">Recruitment sectors</h3>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {isPending && !data
                  ? "Loading sectors…"
                  : `${filtered.length} of ${sectors.length} sectors`}
              </p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search sectors</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sectors…"
                className="w-full border border-input bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-blue"
              />
            </label>
          </div>

          {isPending && !data ? (
            <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white p-6">
                  <div className="h-14 w-14 animate-pulse rounded-full bg-muted" />
                  <div className="mt-5 h-4 w-24 animate-pulse bg-muted" />
                </div>
              ))}
            </div>
          ) : filtered.length ? (
            <div className="mt-8 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-5">
              {filtered.map((s) => (
                <SectorCard key={s.id} sector={s} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-sm text-muted-foreground">
              No sectors match “{query}”. Clear the search or add sectors in the admin panel.
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function SectorCard({ sector }: { sector: ServiceSector }) {
  return (
    <Link
      to="/vacancies"
      search={{ sector: sector.name }}
      className="group bg-white p-6 transition-colors hover:bg-brand-red-soft/40"
      title={sector.description || `View openings in ${sector.name}`}
    >
      {sector.image_url ? (
        <img
          src={sector.image_url}
          alt={sector.name}
          className="h-14 w-14 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red-soft transition-colors group-hover:bg-white">
          <Briefcase className="h-7 w-7 text-primary" />
        </div>
      )}
      <p className="mt-5 text-[13px] font-bold leading-snug text-foreground">{sector.name}</p>
      {sector.description ? (
        <p className="mt-2 line-clamp-3 text-[11px] leading-5 text-muted-foreground">
          {sector.description}
        </p>
      ) : null}
    </Link>
  );
}
