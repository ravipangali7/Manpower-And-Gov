import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { SectionTitle } from "@/components/site/SectionTitle";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicApi } from "@/lib/public-api";
import { buildPageMeta } from "@/lib/seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/gallery")({
  head: () =>
    buildPageMeta({
      title: "Photo Gallery | VNVNEPAL Events & Activities",
      description:
        "Photos from Vision & Value Overseas — training sessions, orientations, and recruitment activities in Nepal.",
      path: "/gallery",
      ogTitle: "Photo Gallery | VNVNEPAL",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<number | "all">("all");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public", "gallery"],
    queryFn: () => publicApi.gallery(),
    staleTime: 60_000,
    retry: 1,
  });

  const albums = data?.albums ?? [];
  const looseImages = data?.images ?? [];

  const images =
    activeAlbum === "all"
      ? [
          ...albums.flatMap((a) =>
            a.images.map((img) => ({ ...img, albumTitle: a.title })),
          ),
          ...looseImages.map((img) => ({ ...img, albumTitle: "Gallery" })),
        ]
      : albums.find((a) => a.id === activeAlbum)?.images.map((img) => ({
          ...img,
          albumTitle: albums.find((a) => a.id === activeAlbum)?.title ?? "",
        })) ?? [];

  return (
    <SiteLayout>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <PageBanner title="Gallery" crumb="Gallery" />

      <section className="py-16">
        <div className="mx-auto max-w-[1240px] px-5">
          <SectionTitle>Our Moments</SectionTitle>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] leading-6 text-muted-foreground">
            Training, orientation and community moments from Vision &amp; Value Overseas.
          </p>

          {albums.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveAlbum("all")}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wide ${
                  activeAlbum === "all"
                    ? "bg-brand-blue text-white"
                    : "border border-brand-blue text-brand-blue"
                }`}
              >
                All
              </button>
              {albums.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setActiveAlbum(a.id)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wide ${
                    activeAlbum === a.id
                      ? "bg-brand-blue text-white"
                      : "border border-brand-blue text-brand-blue"
                  }`}
                >
                  {a.title}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <p className="mt-12 text-center text-sm text-muted-foreground">Loading gallery…</p>
          )}
          {!isLoading && images.length === 0 && (
            <p className="mt-12 text-center text-sm text-muted-foreground">
              {isError
                ? "Gallery is temporarily unavailable. Please try again later."
                : "No gallery images have been published yet."}
            </p>
          )}

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <figure key={img.id} className="overflow-hidden border border-border bg-white">
                {img.image_url ? (
                  <img
                    src={img.image_url}
                    alt={img.title || img.caption || "Gallery image"}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center bg-brand-blue/10 text-sm text-muted-foreground">
                    No image
                  </div>
                )}
                {(img.title || img.caption) && (
                  <figcaption className="p-4">
                    {img.title && (
                      <p className="text-[13px] font-bold text-brand-blue">{img.title}</p>
                    )}
                    {img.caption && (
                      <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                        {img.caption}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
