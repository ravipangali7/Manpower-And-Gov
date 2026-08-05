import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { CmsRichText } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/pages/$slug")({
  loader: async ({ params }) => {
    try {
      const [page, seo] = await Promise.all([
        publicApi.cms.get(params.slug),
        loadPageSeo(`/pages/${params.slug}`),
      ]);
      return { page, seo };
    } catch {
      return { page: null, seo: null };
    }
  },
  head: ({ loaderData, params }) => {
    const page = loaderData?.page;
    return seoFromCms(loaderData?.seo, {
      title: page?.meta_title || page?.title || params.slug.replace(/-/g, " "),
      description:
        page?.meta_description ||
        page?.excerpt ||
        "Page from Vision & Value Overseas (VNVNEPAL).",
      path: `/pages/${params.slug}`,
      ogTitle: page?.meta_title || page?.title,
    });
  },
  component: CmsPage,
});

function CmsPage() {
  const { slug } = Route.useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public", "cms", slug],
    queryFn: () => publicApi.cms.get(slug),
    staleTime: 60_000,
    retry: 1,
  });

  if (!isLoading && (isError || !data)) {
    throw notFound();
  }

  if (!data) {
    return (
      <SiteLayout>
        <PageBanner title="Loading…" crumb="Page" />
        <div className="py-16 text-center text-sm text-muted-foreground">Loading page…</div>
      </SiteLayout>
    );
  }

  const crumbLabel = data.title.length > 48 ? `${data.title.slice(0, 48)}…` : data.title;

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: data.title, path: `/pages/${data.slug}` },
        ])}
      />
      <PageBanner title={data.title} crumbs={[{ label: crumbLabel }]} />

      <article className="py-16">
        <div className="mx-auto max-w-[820px] px-5">
          {data.excerpt && (
            <p className="text-[15px] leading-7 text-muted-foreground">{data.excerpt}</p>
          )}
          {data.banner_image_url && (
            <img
              src={data.banner_image_url}
              alt={data.title}
              className="mt-8 w-full object-cover"
              loading="lazy"
            />
          )}
          <CmsRichText content={data.content || data.excerpt || ""} />
          <p className="mt-10 text-[13px] text-muted-foreground">
            <Link to="/contact" className="font-medium text-primary">
              Contact us
            </Link>{" "}
            with any questions, or return{" "}
            <Link to="/" className="font-medium text-primary">
              home
            </Link>
            .
          </p>
        </div>
      </article>
    </SiteLayout>
  );
}
