import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi, type ContentBlock } from "@/lib/public-api";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/services/overseas-recruitment")({
  loader: async ({ context: { queryClient } }) => {
    const [seo] = await Promise.all([
      loadPageSeo("/services/overseas-recruitment"),
      queryClient.ensureQueryData({
        queryKey: ["public", "services"],
        queryFn: () => publicApi.services(),
      }),
    ]);
    return seo;
  },
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Overseas Recruitment Services | VNVNEPAL Nepal",
      description:
        "End-to-end overseas recruitment from Nepal: sourcing, screening, documentation, pre-departure training and post-deployment support.",
      path: "/services/overseas-recruitment",
      ogTitle: "Overseas Recruitment Services | VNVNEPAL",
      ogDescription: "Zero-cost, sub-agent free overseas recruitment for global employers.",
    }),
  component: OverseasPage,
});

function getBlock(blocks: ContentBlock[] | undefined, key: string) {
  return blocks?.find((b) => b.key === key);
}

function CmsLink({
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
    <a href={path} className={className}>
      {children}
    </a>
  );
}

function OverseasPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["public", "services"],
    queryFn: () => publicApi.services(),
  });

  const what = getBlock(data?.content_blocks, "overseas.what");
  const how = getBlock(data?.content_blocks, "overseas.how");

  if (isError) {
    return (
      <SiteLayout>
        <PageBanner
          title="Overseas Recruitment"
          crumbs={[
            { label: "Services", to: "/services" },
            { label: "Overseas Recruitment" },
          ]}
        />
        <div className="mx-auto max-w-[640px] px-5 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load overseas recruitment content from the CMS.
          </p>
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
          { name: "Overseas Recruitment", path: "/services/overseas-recruitment" },
        ])}
      />
      <PageBanner
        title="Overseas Recruitment"
        crumbs={[
          { label: "Services", to: "/services" },
          { label: "Overseas Recruitment" },
        ]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-[1000px] px-5">
          {isPending && !data ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-80 bg-muted" />
              <div className="h-24 w-full bg-muted" />
              <div className="mt-8 h-8 w-48 bg-muted" />
              <div className="h-24 w-full bg-muted" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-brand-blue">
                {what?.heading || "What is overseas recruitment?"}
              </h2>
              {what?.image_url ? (
                <img
                  src={what.image_url}
                  alt={what.heading || "What is overseas recruitment?"}
                  className="mt-6 max-h-72 w-full object-cover"
                />
              ) : null}
              {what?.body ? (
                <p className="mt-4 text-[15px] leading-7 text-foreground">{what.body}</p>
              ) : null}
              {what?.body_2 ? (
                <p className="mt-4 text-[15px] leading-7 text-foreground">{what.body_2}</p>
              ) : null}
              {what?.cta_label && what?.cta_path ? (
                <CmsLink
                  path={what.cta_path}
                  className="mt-6 inline-block bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {what.cta_label}
                </CmsLink>
              ) : null}

              <h2 className="mt-10 text-2xl font-bold text-brand-blue">
                {how?.heading || "How it works"}
              </h2>
              {how?.body ? (
                <p className="mt-4 text-[15px] leading-7 text-foreground">{how.body}</p>
              ) : null}
              {how?.body_2 ? (
                <p className="mt-4 text-[15px] leading-7 text-foreground">{how.body_2}</p>
              ) : null}
              {how?.cta_label && how?.cta_path ? (
                <CmsLink
                  path={how.cta_path}
                  className="mt-6 inline-block border border-brand-blue px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
                >
                  {how.cta_label}
                </CmsLink>
              ) : null}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
