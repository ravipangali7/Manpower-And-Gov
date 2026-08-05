import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi, type NewsItem } from "@/lib/public-api";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/news/")({
  loader: () => loadPageSeo("/news/"),
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "News & Updates | VNVNEPAL Recruitment Insights",
      description:
        "Latest announcements, notices and stories from Vision & Value Overseas — ethical recruitment news from Nepal.",
      path: "/news/",
      ogTitle: "News & Updates | VNVNEPAL",
    }),
  component: NewsPage,
});

function formatDisplayDate(iso: string) {
  const day = iso.includes("T") ? iso.slice(0, 10) : iso;
  const d = new Date(`${day}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toListItem(n: NewsItem) {
  const datePublished = n.published_at?.slice(0, 10) || "";
  return {
    slug: n.slug,
    title: n.title,
    author: n.author,
    excerpt: n.excerpt,
    datePublished,
    cover: n.cover_image_url,
  };
}

function NewsPage() {
  const { data, isSuccess, isPending, isError, refetch } = useQuery({
    queryKey: ["public", "news"],
    queryFn: () => publicApi.news.list(),
  });

  const items = isSuccess ? (data ?? []).map(toListItem) : [];

  return (
    <SiteLayout partner={false}>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "News & Update", path: "/news/" },
        ])}
      />
      <PageBanner title="News & Update" crumb="News & Update" />

      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-5">
          {isError ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">Could not load news.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground"
              >
                Retry
              </button>
            </div>
          ) : isPending && !data ? (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="mt-4 h-4 w-32 bg-muted" />
                  <div className="mt-2 h-5 w-full bg-muted" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No news articles are published yet.
            </p>
          ) : (
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((n, i) => (
                <article key={n.slug}>
                  {n.cover ? (
                    <img
                      src={n.cover}
                      alt={n.title}
                      className="h-48 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className={`flex h-48 items-center justify-center p-6 text-center ${
                        i % 3 === 0
                          ? "bg-brand-blue"
                          : i % 3 === 1
                            ? "bg-brand-red-soft"
                            : "bg-brand-blue-light"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold uppercase leading-snug ${
                          i % 3 === 1 ? "text-primary" : "text-white"
                        }`}
                      >
                        {n.title.slice(0, 46)}
                      </span>
                    </div>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    {n.datePublished && (
                      <time dateTime={n.datePublished}>{formatDisplayDate(n.datePublished)}</time>
                    )}
                    {" · "}By {n.author}
                  </p>
                  <h2 className="mt-1 text-[15px] font-bold leading-snug text-brand-blue">{n.title}</h2>
                  <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{n.excerpt}</p>
                  <Link
                    to="/news/$slug"
                    params={{ slug: n.slug }}
                    className="mt-3 inline-block text-[13px] font-medium text-primary"
                  >
                    Read More ›
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
