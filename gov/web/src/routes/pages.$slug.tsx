import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DocumentViewer, TextSizeControls } from "@/components/document-viewer";
import { OrgChart } from "@/components/org-chart";
import { PageBar } from "@/components/site-header";
import { CITIZEN_CHARTER_PAGES, type CharterDocumentPage } from "@/data/citizen-charter";
import { SEED_PAGES } from "@/data/cms-seed";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

const ORG_STRUCTURE_SLUGS = new Set(["structure", "organization-structure"]);

export const Route = createFileRoute("/pages/$slug")({
  head: ({ params }) => {
    const page = SEED_PAGES.find((p) => p.slug === params.slug);
    const title = page?.title ?? (ORG_STRUCTURE_SLUGS.has(params.slug) ? "Organization Structure" : "Information");
    const description =
      page?.metaDescription ??
      page?.body.split("\n\n")[0]?.slice(0, 150) ??
      "Information page of the Department of Foreign Employment, Government of Nepal.";
    return buildPageMeta({
      title: `${title} — Department of Foreign Employment`,
      description,
      path: `/pages/${params.slug}`,
    });
  },
  component: StaticPage,
});

function parseDocumentPages(json?: string): CharterDocumentPage[] | null {
  if (!json?.trim()) return null;
  try {
    const parsed = JSON.parse(json) as CharterDocumentPage[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function StaticPage() {
  const { slug } = Route.useParams();
  const { data } = useCms();
  const page = data.pages.find((p) => p.slug === slug);
  const [textScale, setTextScale] = useState(1);

  const isOrgStructure = ORG_STRUCTURE_SLUGS.has(slug);
  const title = page?.title ?? (isOrgStructure ? "Organization Structure" : "Information");

  const documentPages = useMemo(() => {
    if (isOrgStructure) return null;
    const fromCms = parseDocumentPages(page?.documentPagesJson);
    if (fromCms) return fromCms;
    // Fallback so citizen-charter still works if localStorage has an older page row
    if (slug === "citizen-charter") return CITIZEN_CHARTER_PAGES;
    return null;
  }, [page?.documentPagesJson, slug, isOrgStructure]);

  if (isOrgStructure) {
    return (
      <div>
        <PageBar
          label={title}
          crumbs={[
            { name: "Home", path: "/" },
            { name: title, path: `/pages/${slug}` },
          ]}
        />
        <section className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
          <h1 className="relative inline-block pb-2 text-2xl font-semibold text-gov-blue after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-3/5 after:bg-gov-blue">
            {title}
          </h1>
          <div className="mt-4">
            <TextSizeControls scale={textScale} onChange={setTextScale} />
          </div>
          <div className="mt-6">
            <OrgChart textScale={textScale} />
          </div>
        </section>
      </div>
    );
  }

  if (documentPages) {
    return (
      <div>
        <PageBar
          label={title}
          crumbs={[
            { name: "Home", path: "/" },
            { name: title, path: `/pages/${slug}` },
          ]}
        />
        <section className="mx-auto max-w-[1100px] px-4 py-8 md:px-8">
          <h1 className="relative inline-block pb-2 text-2xl font-semibold text-gov-blue after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-3/5 after:bg-gov-blue">
            {title}
          </h1>
          <div className="mt-4">
            <TextSizeControls scale={textScale} onChange={setTextScale} />
          </div>
          <div className="mt-5">
            <DocumentViewer pages={documentPages} title={title} textScale={textScale} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageBar
        label={title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: title, path: `/pages/${slug}` },
        ]}
      />
      <section className="mx-auto max-w-[1000px] px-4 py-10 md:px-8">
        <h1 className="gov-section-title text-2xl">{title}</h1>
        <div className="mt-4">
          <TextSizeControls scale={textScale} onChange={setTextScale} />
        </div>
        <div
          style={{ fontSize: `${textScale}rem` }}
          className="mt-8 space-y-5 text-sm leading-7 text-muted-foreground"
        >
          {(page ? page.body.split("\n\n") : ["Content will be published soon."]).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
