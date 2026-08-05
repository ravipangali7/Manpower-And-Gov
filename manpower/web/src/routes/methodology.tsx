import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { CmsRichText } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/methodology")({
  loader: async () => {
    try {
      const [page, seo] = await Promise.all([
        publicApi.cms.get("methodology"),
        loadPageSeo("/methodology"),
      ]);
      return { page, seo };
    } catch {
      return { page: null, seo: null };
    }
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    return seoFromCms(loaderData?.seo, {
      title: page?.meta_title || page?.title || "Methodology | VNVNEPAL",
      description:
        page?.meta_description ||
        page?.excerpt ||
        "Our Listen–Plan–Recruit–Deliver methodology for ethical overseas recruitment.",
      path: "/methodology",
      ogTitle: page?.meta_title || page?.title || "Methodology | VNVNEPAL",
    });
  },
  component: MethodologyPage,
});

function MethodologyPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public", "cms", "methodology"],
    queryFn: () => publicApi.cms.get("methodology"),
    staleTime: 60_000,
    retry: 1,
  });

  if (!isLoading && (isError || !data)) {
    throw notFound();
  }

  if (!data) {
    return (
      <SiteLayout>
        <PageBanner title="Methodology" crumb="Methodology" />
        <div className="py-16 text-center text-sm text-muted-foreground">Loading page…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: data.title, path: "/methodology" },
        ])}
      />
      <PageBanner title={data.title} crumb="Methodology" />

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
            with any questions, or explore our{" "}
            <Link to="/services" className="font-medium text-primary">
              recruitment services
            </Link>
            .
          </p>
        </div>
      </article>
    </SiteLayout>
  );
}
