import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { getBlock } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/awards")({
  loader: () => loadPageSeo("/awards"),
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Awards & Recognition | Licences and Certifications — VNVNEPAL",
      description:
        "Government of Nepal licence, ISO 9001:2015, RBA training, SEDEX and ALP UK membership held by Vision & Value Overseas.",
      path: "/awards",
      ogTitle: "Awards & Recognition | VNVNEPAL",
    }),
  component: AwardsPage,
});

function AwardsPage() {
  const { data, isPending, isSuccess, isError, refetch } = useQuery({
    queryKey: ["public", "awards"],
    queryFn: () => publicApi.awards(),
  });

  const certificates = isSuccess
    ? (data?.certificates ?? []).map((c) => ({
        id: c.id,
        title: c.title,
        tag: c.tag,
        image: c.image_url,
        document: c.document_url,
      }))
    : [];
  const intro = getBlock(data?.content_blocks, "awards.intro");

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Awards & Recognition", path: "/awards" },
        ])}
      />
      <PageBanner title="Awards & Recognition" crumb="Awards & Recognition" />

      <section className="bg-section py-16">
        <div className="mx-auto max-w-[1240px] px-5">
          {(intro?.heading || intro?.body) && (
            <div className="mx-auto mb-10 max-w-3xl text-center">
              {intro.heading ? (
                <h2 className="text-2xl font-bold text-brand-blue">{intro.heading}</h2>
              ) : null}
              {intro.body ? (
                <p className="mt-4 text-[15px] leading-7 text-muted-foreground">{intro.body}</p>
              ) : null}
            </div>
          )}

          {isError ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">Could not load awards from the CMS.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
              >
                Retry
              </button>
            </div>
          ) : isPending && !data ? (
            <div className="grid gap-8 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[420px] animate-pulse bg-muted" />
              ))}
            </div>
          ) : certificates.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No certificates are published yet.{" "}
              <Link to="/contact" className="font-medium text-primary">
                Contact VNVNEPAL
              </Link>{" "}
              for licensing details.
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {certificates.map((c) => {
                const downloadHref = c.document || c.image || null;
                const cardBody = (
                  <>
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[oklch(0.96_0.01_90)] p-8">
                        <div className="w-full border-4 border-double border-[oklch(0.75_0.06_60)] p-6 text-center">
                          <p className="font-serif text-lg italic text-[oklch(0.5_0.12_25)]">
                            {c.tag || "Certificate"}
                          </p>
                          <p className="mt-4 text-sm font-semibold leading-5 text-foreground">
                            {c.title}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                      <p className="text-sm font-bold leading-snug text-white">{c.title}</p>
                      {c.tag ? (
                        <span className="mt-3 inline-block bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                          {c.tag}
                        </span>
                      ) : null}
                    </div>
                  </>
                );

                if (downloadHref) {
                  return (
                    <a
                      key={c.id}
                      href={downloadHref}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block h-[420px] overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      aria-label={`Download ${c.title}`}
                      title={`Download ${c.title}`}
                    >
                      {cardBody}
                    </a>
                  );
                }

                return (
                  <div key={c.id} className="relative h-[420px] overflow-hidden bg-white shadow-sm">
                    {cardBody}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
