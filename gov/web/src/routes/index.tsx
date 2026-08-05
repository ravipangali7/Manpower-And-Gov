import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Download, Mail, Phone } from "lucide-react";
import emblem from "@/assets/nepal-emblem.png";
import official1 from "@/assets/official-1.jpg";
import official2 from "@/assets/official-2.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import { FaqSection } from "@/components/seo/faq-section";
import { PageBar } from "@/components/site-header";
import { HOMEPAGE_DEFINITION } from "@/config/site-seo";
import { CATEGORY_TITLES } from "@/data/cms-seed";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

const OFFICIAL_PHOTOS = [official1, official2];
const GALLERY_PHOTOS = [gallery1, gallery2, gallery3, gallery4, gallery5];
const TABS = ["ji-to-ji", "press-release", "report-list", "case-case", "notices"] as const;

export const Route = createFileRoute("/")({
  head: () =>
    buildPageMeta({
      title: "Department of Foreign Employment — Government of Nepal",
      description:
        "Official portal of the Department of Foreign Employment, Ministry of Youth, Labour and Employment, Tahachal, Kathmandu. Notices, labour approval services and publications.",
      path: "/",
    }),
  component: Index,
});

function SectionTitle({ children }: { children: string }) {
  return <h2 className="gov-section-title text-lg">{children}</h2>;
}

function Index() {
  const { data } = useCms();
  const [tab, setTab] = useState<string>(TABS[0]);
  const [page, setPage] = useState(0);
  const [galleryTab, setGalleryTab] = useState<"Photographs" | "Audio Visual">("Photographs");

  const pageSize = 3;
  const pageCount = Math.max(1, Math.ceil(data.contactSections.length / pageSize));
  const visibleContacts = data.contactSections.slice(page * pageSize, page * pageSize + pageSize);

  const featured = data.contents.filter((c) => c.featured);
  const highlights = featured.slice(0, 3);
  const news = featured.slice(3, 6);
  const latest = data.contents.slice(0, 3);
  const tabItems = data.contents.filter((c) => c.category === tab).slice(0, 4);
  const publications = data.contents
    .filter((c) => ["publications", "press-release", "bulletin", "yearly"].includes(c.category))
    .slice(0, 4);
  const albums = data.albums.filter((a) => a.type === galleryTab);

  return (
    <div>
      <PageBar label="Home" crumbs={[{ name: "Home", path: "/" }]} />

      <section className="mx-auto mt-6 max-w-[1400px] px-4 md:px-8">
        <h1 className="text-2xl font-semibold text-gov-ink md:text-3xl">
          Department of Foreign Employment — Government of Nepal
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {HOMEPAGE_DEFINITION}
        </p>
        <p className="mt-3 text-sm text-gov-ink">
          Explore{" "}
          <Link to="/services-list" className="gov-link font-medium">
            online services
          </Link>
          ,{" "}
          <Link to="/jobs" className="gov-link font-medium">
            foreign employment jobs
          </Link>
          , and{" "}
          <Link to="/contact-us" className="gov-link font-medium">
            contact information
          </Link>
          .
        </p>
      </section>

      {/* Contact number banner */}
      <section className="mx-auto mt-6 max-w-[1400px] px-4 md:px-8">
        <div className="relative border-2 border-gov-red bg-background p-4">
          <table className="w-full border-collapse text-xs text-gov-red">
            <tbody>
              {visibleContacts.map((c) => (
                <tr key={c.id} className="border border-gov-red align-top">
                  <td className="w-10 border border-gov-red p-2 text-center">{c.no}</td>
                  <td className="w-1/3 border border-gov-red p-2">{c.name}</td>
                  <td className="border border-gov-red p-2">
                    {c.rows.split("\n").map((r) => (
                      <div key={r} className="border-b border-gov-red/40 py-1 last:border-0">
                        {r}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex gap-2">
              <button
                aria-label="Previous contact numbers"
                onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
                className="rounded-full bg-gov-blue p-2 text-primary-foreground transition hover:opacity-90"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next contact numbers"
                onClick={() => setPage((p) => (p + 1) % pageCount)}
                className="rounded-full bg-gov-blue p-2 text-primary-foreground transition hover:opacity-90"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xl font-semibold text-gov-ink">Contact Number</p>
          </div>
        </div>
      </section>

      {/* Services + officials */}
      <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
        <SectionTitle>Our Services</SectionTitle>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded border border-border p-8">
            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-4">
              {data.services.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border">
                    <img
                      src={emblem}
                      alt="Emblem of Nepal"
                      loading="lazy"
                      width={40}
                      height={40}
                      className="h-9 w-9"
                    />
                  </span>
                  <span className="mt-3 text-sm font-medium text-gov-blue">{s.title}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="max-h-[260px] space-y-0 overflow-y-auto rounded border border-border bg-gov-blue-light/60">
            {data.officials.map((o, oi) => (
              <div key={o.id} className="flex items-center gap-4 border-b border-border p-4 last:border-0">
                {OFFICIAL_PHOTOS[oi] ? (
                  <img
                    src={OFFICIAL_PHOTOS[oi]}
                    alt={o.name}
                    loading="lazy"
                    width={56}
                    height={64}
                    className="h-16 w-14 shrink-0 rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-14 shrink-0 rounded bg-muted" />
                )}
                <div className="text-sm">
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-muted-foreground">{o.role}</p>
                  {o.email && (
                    <p className="mt-1 flex items-center gap-1 text-gov-blue">
                      <Mail className="h-3.5 w-3.5" /> {o.email}
                    </p>
                  )}
                  {o.phone && (
                    <p className="mt-1 flex items-center gap-1 text-gov-blue">
                      <Phone className="h-3.5 w-3.5" /> {o.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights / Latest news */}
      <section className="bg-gov-blue-light/70 py-12">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 md:grid-cols-2 md:px-8">
          <div>
            <SectionTitle>Highlights</SectionTitle>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <ul className="space-y-6">
                {highlights.map((h) => (
                  <li key={h.id} className="border-l-2 border-gov-blue pl-3">
                    <Link to="/content/$id" params={{ id: h.id }} className="text-sm font-medium hover:text-gov-blue">
                      {h.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{h.date}</p>
                  </li>
                ))}
              </ul>
              <ul className="space-y-6">
                {news.map((n) => (
                  <li key={n.id}>
                    <Link to="/content/$id" params={{ id: n.id }} className="text-sm font-medium hover:text-gov-blue">
                      {n.title}
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <SectionTitle>Latest News</SectionTitle>
            <ul className="mt-6 space-y-4">
              {latest.map((d) => (
                <li key={d.id} className="flex items-center gap-4 bg-background p-3">
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center bg-muted">
                    <img
                      src={emblem}
                      alt="Emblem of Nepal"
                      loading="lazy"
                      width={32}
                      height={32}
                      className="h-8 w-8"
                    />
                  </div>
                  <Link to="/content/$id" params={{ id: d.id }} className="flex-1 text-sm font-medium hover:text-gov-blue">
                    {d.title}
                  </Link>
                  <Link
                    to="/content/$id"
                    params={{ id: d.id }}
                    className="flex shrink-0 items-center gap-1 rounded bg-gov-blue px-3 py-1.5 text-xs text-primary-foreground"
                  >
                    <Download className="h-3.5 w-3.5" /> View
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <div className="rounded border border-border p-6">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  t === tab
                    ? "rounded bg-gov-blue px-4 py-1.5 text-sm text-primary-foreground"
                    : "rounded px-4 py-1.5 text-sm text-muted-foreground hover:text-gov-blue"
                }
              >
                {CATEGORY_TITLES[t]}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {tabItems.map((i) => (
              <Link key={i.id} to="/content/$id" params={{ id: i.id }} className="group flex gap-4">
                <div className="flex h-20 w-24 shrink-0 items-center justify-center bg-muted">
                  <img
                    src={emblem}
                    alt="Emblem of Nepal"
                    loading="lazy"
                    width={40}
                    height={40}
                    className="h-10 w-10"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-gov-blue">{i.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{i.date}</p>
                </div>
              </Link>
            ))}
            {tabItems.length === 0 && (
              <p className="py-8 text-sm text-muted-foreground">No records published in this category yet.</p>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/category/$slug"
              params={{ slug: tab }}
              className="rounded bg-muted px-5 py-2 text-sm hover:text-gov-blue"
            >
              See all {CATEGORY_TITLES[tab]}
            </Link>
          </div>
        </div>
      </section>

      {/* Publication */}
      <section className="bg-gov-blue-light/70 py-12">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <SectionTitle>Publication</SectionTitle>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {publications.map((p) => (
              <Link key={p.id} to="/content/$id" params={{ id: p.id }} className="group">
                <div className="flex h-44 items-center justify-center bg-muted">
                  <img
                    src={emblem}
                    alt="Emblem of Nepal"
                    loading="lazy"
                    width={120}
                    height={120}
                    className="h-28 w-28"
                  />
                </div>
                <p className="mt-3 text-sm group-hover:text-gov-blue">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 md:px-8">
        <div className="flex gap-2">
          {(["Photographs", "Audio Visual"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setGalleryTab(t)}
              className={
                t === galleryTab
                  ? "rounded bg-gov-blue px-4 py-1.5 text-sm text-primary-foreground"
                  : "rounded px-4 py-1.5 text-sm text-muted-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {albums.map((g, gi) => (
            <figure key={g.id}>
              <img
                src={GALLERY_PHOTOS[gi % GALLERY_PHOTOS.length]}
                alt={g.title}
                loading="lazy"
                width={800}
                height={560}
                className="aspect-[10/7] w-full bg-muted object-cover"
              />
              <figcaption className="mt-3 text-sm font-medium">{g.title}</figcaption>
              {g.count > 0 && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" /> {g.count} items
                </p>
              )}
            </figure>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link to="/gallery" className="rounded bg-muted px-5 py-2 text-sm hover:text-gov-blue">
            See more
          </Link>
        </div>
      </section>

      <FaqSection className="mx-auto max-w-[1400px] px-4 py-10 md:px-8" />
    </div>
  );
}
