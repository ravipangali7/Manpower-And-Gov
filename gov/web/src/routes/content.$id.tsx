import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Download, Facebook, Printer, Share2, Twitter } from "lucide-react";
import { useState } from "react";
import emblem from "@/assets/nepal-emblem.png";
import { JsonLd } from "@/components/seo/json-ld";
import { PageBar } from "@/components/site-header";
import { siteSeo } from "@/config/site-seo";
import { CATEGORY_TITLES, SEED_CONTENTS } from "@/data/cms-seed";
import { useCms } from "@/lib/cms-store";
import { article } from "@/lib/schema";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/content/$id")({
  head: ({ params }) => {
    const item = SEED_CONTENTS.find((c) => c.id === params.id);
    const title =
      item?.metaTitle ??
      `${item?.title ?? "Notice"} — Department of Foreign Employment`;
    const description =
      item?.metaDescription ??
      item?.summary ??
      "Notice published by the Department of Foreign Employment, Nepal.";
    return buildPageMeta({
      title,
      description,
      path: `/content/${params.id}`,
      type: "article",
    });
  },
  component: ContentDetail,
});

function ContentDetail() {
  const { id } = Route.useParams();
  const { data } = useCms();
  const [scale, setScale] = useState(1);

  const item = data.contents.find((c) => c.id === id);
  const related = data.contents.filter((c) => c.id !== id).slice(0, 4);

  if (!item) {
    return (
      <div>
        <PageBar
          label="Notice"
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Notices", path: "/category/notices" },
            { name: "Unavailable", path: `/content/${id}` },
          ]}
        />
        <section className="mx-auto max-w-[900px] px-4 py-20 text-center md:px-8">
          <h1 className="text-2xl font-semibold">This content is no longer available</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            It may have been removed or unpublished by the Department.
          </p>
          <Link
            to="/category/$slug"
            params={{ slug: "notices" }}
            className="mt-6 inline-block rounded bg-gov-blue px-5 py-2 text-sm text-primary-foreground"
          >
            Browse all notices
          </Link>
        </section>
      </div>
    );
  }

  const categoryTitle = CATEGORY_TITLES[item.category] ?? "Notice";
  const contentPath = `/content/${item.id}`;

  return (
    <div>
      <JsonLd
        id="article-jsonld"
        data={article({
          headline: item.title,
          description: item.summary,
          datePublished: item.date,
          dateModified: item.updatedAt || item.date,
          author: siteSeo.name,
          url: contentPath,
          image: siteSeo.logo,
        })}
      />
      <PageBar
        label={categoryTitle}
        crumbs={[
          { name: "Home", path: "/" },
          { name: categoryTitle, path: `/category/${item.category}` },
          { name: item.title, path: contentPath },
        ]}
      />
      <article className="mx-auto max-w-[1200px] px-4 py-8 md:px-8">
        <h1 className="text-2xl font-bold leading-snug md:text-3xl">{item.title}</h1>

        <div className="mx-auto mt-8 max-w-[820px]">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-border px-5 py-3">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Published {item.date}
              </span>
              {item.updatedAt ? <span>Updated {item.updatedAt}</span> : null}
            </p>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gov-blue text-primary-foreground">
                <Facebook className="h-4 w-4" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gov-ink text-primary-foreground">
                <Twitter className="h-4 w-4" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gov-red text-primary-foreground">
                <Share2 className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setScale((s) => Math.min(1.6, s + 0.1))}
              className="rounded bg-gov-blue-light px-3 py-1.5 text-sm text-gov-blue"
            >
              A+
            </button>
            <button onClick={() => setScale(1)} className="rounded bg-gov-blue-light px-3 py-1.5 text-sm text-gov-blue">
              ↺
            </button>
            <button
              onClick={() => setScale((s) => Math.max(0.8, s - 0.1))}
              className="rounded bg-gov-blue-light px-3 py-1.5 text-sm text-gov-blue"
            >
              A−
            </button>
            <button
              onClick={() => typeof window !== "undefined" && window.print()}
              className="ml-auto flex items-center gap-1 rounded bg-gov-blue px-3 py-1.5 text-sm text-primary-foreground"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            {item.fileUrl && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded bg-gov-red px-3 py-1.5 text-sm text-primary-foreground"
              >
                <Download className="h-3.5 w-3.5" /> Attachment
              </a>
            )}
          </div>

          <div className="mt-4 bg-muted p-8">
            <div
              style={{ fontSize: `${scale}rem` }}
              className="mx-auto max-w-[640px] bg-background p-8 text-sm leading-7 shadow"
            >
              <div className="text-center">
                <img src={emblem} alt="Emblem of Nepal" width={64} height={64} className="mx-auto h-16 w-16" />
                <p className="mt-3 font-semibold">Government of Nepal</p>
                <p>{data.settings.ministry}</p>
                <p className="font-semibold">{data.settings.siteName}</p>
                <p className="text-xs text-muted-foreground">{data.settings.address}</p>
              </div>
              <h2 className="mt-8 text-center font-semibold underline">{item.title}</h2>
              <div className="mt-6 space-y-4 text-justify">
                {item.body.split("\n\n").map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h2 className="gov-section-title mt-12 text-lg">Related notices</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((n) => (
            <Link key={n.id} to="/content/$id" params={{ id: n.id }} className="group">
              <div className="flex h-40 items-center justify-center bg-muted">
                <img
                  src={emblem}
                  alt="Emblem of Nepal"
                  loading="lazy"
                  width={96}
                  height={96}
                  className="h-24 w-24"
                />
              </div>
              <p className="mt-3 text-sm font-medium group-hover:text-gov-blue">{n.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
            </Link>
          ))}
        </div>
      </article>
    </div>
  );
}
