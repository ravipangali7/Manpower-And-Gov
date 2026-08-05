import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi, type NewsItem } from "@/lib/public-api";
import { CmsRichText } from "@/lib/cms-content";
import { buildPageMeta, truncateTitle } from "@/lib/seo";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildArticle, buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/news/$slug")({
  loader: async ({ params }) => {
    try {
      const article = await publicApi.news.get(params.slug);
      return { article, seo: await loadPageSeo(`/news/${params.slug}`) };
    } catch {
      return { article: null, seo: null };
    }
  },
  head: ({ loaderData, params }) => {
    const article = loaderData?.article;
    if (!article) {
      return seoFromCms(loaderData?.seo, {
        title: "News | VNVNEPAL",
        description: "News from Vision & Value Overseas.",
        path: `/news/${params.slug}`,
      });
    }
    const title = truncateTitle(article.meta_title || article.title);
    const description = article.meta_description || article.excerpt;
    const published = article.published_at?.slice(0, 10) || "";
    const head = seoFromCms(loaderData?.seo, {
      title,
      description,
      path: `/news/${article.slug}`,
      ogTitle: title,
      type: "article",
    });
    if (!loaderData?.seo?.og_image_url && article.cover_image_url) {
      const withImage = buildPageMeta({
        title,
        description,
        path: `/news/${article.slug}`,
        image: article.cover_image_url,
        ogTitle: title,
        type: "article",
      });
      return {
        ...withImage,
        meta: [
          ...withImage.meta,
          ...(published
            ? [
                { property: "article:published_time", content: published },
                { property: "article:modified_time", content: published },
              ]
            : []),
        ],
      };
    }
    return {
      ...head,
      meta: [
        ...head.meta,
        ...(published
          ? [
              { property: "article:published_time", content: published },
              { property: "article:modified_time", content: published },
            ]
          : []),
      ],
    };
  },
  component: NewsDetail,
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

function mapApiArticle(n: NewsItem) {
  const datePublished = n.published_at?.slice(0, 10) || "";
  return {
    slug: n.slug,
    title: n.title,
    author: n.author || "vnv",
    excerpt: n.excerpt,
    datePublished,
    body: n.content || n.excerpt || "",
    cover: n.cover_image_url ?? null,
  };
}

function NewsDetail() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["public", "news", slug],
    queryFn: () => publicApi.news.get(slug),
  });

  const article = data ? mapApiArticle(data) : null;

  if (!isLoading && !article) {
    throw notFound();
  }

  if (!article) {
    return (
      <SiteLayout>
        <PageBanner title="News & Update" crumb="News & Update" />
        <div className="py-16 text-center text-sm text-muted-foreground">Loading article…</div>
      </SiteLayout>
    );
  }

  const crumbLabel =
    article.title.length > 48 ? `${article.title.slice(0, 48)}…` : article.title;

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "News & Update", path: "/news/" },
          { name: article.title, path: `/news/${article.slug}` },
        ])}
      />
      {article.datePublished && (
        <JsonLd
          data={buildArticle({
            title: article.title,
            description: article.excerpt,
            author: article.author,
            datePublished: article.datePublished,
            dateModified: article.datePublished,
            path: `/news/${article.slug}`,
            image: article.cover,
          })}
        />
      )}
      <PageBanner
        title="News & Update"
        titleAs="p"
        imageAlt="News article banner — Vision & Value Overseas updates"
        crumbs={[
          { label: "News & Update", to: "/news" },
          { label: crumbLabel },
        ]}
      />
      <article className="py-16">
        <div className="mx-auto max-w-[820px] px-5">
          <p className="text-xs text-muted-foreground">
            {article.datePublished && (
              <>
                Published{" "}
                <time dateTime={article.datePublished}>
                  {formatDisplayDate(article.datePublished)}
                </time>
              </>
            )}
            {" · "}By {article.author}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-brand-blue">{article.title}</h1>
          {article.cover ? (
            <img
              src={article.cover}
              alt={article.title}
              className="mt-8 h-64 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="mt-8 h-64 bg-brand-blue"
              role="img"
              aria-label={`${article.title} feature image`}
            />
          )}
          <CmsRichText content={article.body} />
          <Link to="/news" className="mt-8 inline-block text-sm font-medium text-primary">
            ‹ Back to all news
          </Link>
        </div>
      </article>
    </SiteLayout>
  );
}
