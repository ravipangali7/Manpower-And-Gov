import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  Lightbulb,
  ListChecks,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi, type ContentBlock } from "@/lib/public-api";
import { blockMap, CmsRichText } from "@/lib/cms-content";
import { loadPageSeo, seoFromCms } from "@/lib/page-seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/ethical-recruitment")({
  loader: async ({ context: { queryClient } }) => {
    const [seo] = await Promise.all([
      loadPageSeo("/ethical-recruitment"),
      queryClient.ensureQueryData({
        queryKey: ["public", "ethical-recruitment"],
        queryFn: () => publicApi.ethicalRecruitment(),
      }),
    ]);
    return seo;
  },
  head: ({ loaderData }) =>
    seoFromCms(loaderData, {
      title: "Ethical Recruitment | Vision & Value Overseas (VNVNEPAL)",
      description:
        "Learn about ethical and zero-cost recruitment standards at Vision & Value Overseas — fair, transparent hiring for Nepali migrant workers.",
      path: "/ethical-recruitment",
      ogTitle: "Ethical Recruitment | VNVNEPAL",
      ogDescription:
        "Fair, transparent, and zero-cost overseas recruitment practices from Vision & Value Overseas.",
    }),
  component: EthicalRecruitmentPage,
});

const ICON_MAP: Record<string, LucideIcon> = {
  "file-text": FileText,
  settings: Settings,
  lightbulb: Lightbulb,
  "list-checks": ListChecks,
};

function SectionHeading({
  icon,
  children,
}: {
  icon?: string;
  children: string;
}) {
  const Icon = (icon && ICON_MAP[icon]) || FileText;
  return (
    <div className="flex items-start gap-3 border-b border-border pb-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-brand-blue/10 text-brand-blue">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-bold uppercase tracking-wide text-brand-blue md:text-2xl">
        {children}
      </h2>
    </div>
  );
}

function ContentSection({ block }: { block: ContentBlock }) {
  if (!block.heading && !block.body) return null;
  return (
    <div className="space-y-5">
      {block.heading ? (
        <SectionHeading icon={block.subheading}>{block.heading}</SectionHeading>
      ) : null}
      {block.image_url ? (
        <img
          src={block.image_url}
          alt={block.heading || block.subheading || "Ethical recruitment"}
          className="max-h-72 w-full object-cover"
          loading="lazy"
        />
      ) : null}
      {block.body ? (
        <CmsRichText content={block.body} className="space-y-5" accent="primary" />
      ) : null}
      {block.body_2 ? (
        <CmsRichText content={block.body_2} className="space-y-5" accent="primary" />
      ) : null}
      {block.body_3 ? (
        <CmsRichText content={block.body_3} className="space-y-5" accent="primary" />
      ) : null}
    </div>
  );
}

function EthicalRecruitmentPage() {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["public", "ethical-recruitment"],
    queryFn: () => publicApi.ethicalRecruitment(),
  });

  const blocks = blockMap(data?.content_blocks);
  const history = blocks["ethical.history"];
  const why = blocks["ethical.why"];
  const zeroCost = blocks["ethical.zero_cost"];
  const pageTitle = data?.page_title || "Ethical Recruitment";
  const comparison = data?.comparison;

  if (isError) {
    return (
      <SiteLayout>
        <PageBanner title="Ethical Recruitment" crumb="Ethical Recruitment" />
        <div className="mx-auto max-w-[640px] px-5 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load ethical recruitment content from the CMS.
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
          { name: "Ethical Recruitment", path: "/ethical-recruitment" },
        ])}
      />
      <PageBanner title={pageTitle} crumb="Ethical Recruitment" />

      <section className="py-16">
        <div className="mx-auto max-w-[1000px] space-y-14 px-5">
          {isPending && !data ? (
            <div className="space-y-8 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-8 w-80 bg-muted" />
                  <div className="h-24 w-full bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {history ? <ContentSection block={history} /> : null}
              {why ? <ContentSection block={why} /> : null}
              {zeroCost ? <ContentSection block={zeroCost} /> : null}

              {comparison ? (
                <div className="space-y-5">
                  {comparison.heading ? (
                    <SectionHeading icon={comparison.icon}>
                      {comparison.heading}
                    </SectionHeading>
                  ) : null}
                  {comparison.intro ? (
                    <p className="text-[15px] leading-7 text-foreground">
                      {comparison.intro}
                    </p>
                  ) : null}
                  {comparison.rows.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[560px] border-collapse border border-border text-left text-[14px] leading-6">
                        <thead>
                          <tr>
                            <th className="border border-border bg-[#e7f1ff] px-4 py-3 font-bold text-primary">
                              {comparison.left_header}
                            </th>
                            <th className="border border-border bg-[#fbeaea] px-4 py-3 font-bold text-primary">
                              {comparison.right_header}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparison.rows.map((row, i) => (
                            <tr key={i}>
                              <td className="border border-border px-4 py-3 align-top text-foreground">
                                {row.left}
                              </td>
                              <td className="border border-border px-4 py-3 align-top text-foreground">
                                {row.right}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
