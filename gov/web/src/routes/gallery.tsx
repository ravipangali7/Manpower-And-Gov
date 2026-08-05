import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import { PageBar } from "@/components/site-header";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

const PHOTOS = [gallery1, gallery2, gallery3, gallery4, gallery5];

export const Route = createFileRoute("/gallery")({
  head: () =>
    buildPageMeta({
      title: "Gallery — Department of Foreign Employment",
      description:
        "Photographs and audio visual records of programs, meetings and orientation activities of the Department of Foreign Employment.",
      path: "/gallery",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  const { data } = useCms();
  const [tab, setTab] = useState<"Photographs" | "Audio Visual">("Photographs");
  const albums = data.albums.filter((a) => a.type === tab);

  return (
    <div>
      <PageBar label="Gallery" />
      <section className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">
        <h1 className="gov-section-title text-lg">Gallery</h1>

        <div className="mt-6 flex gap-2">
          {(["Photographs", "Audio Visual"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                t === tab
                  ? "rounded bg-gov-blue px-4 py-1.5 text-sm text-primary-foreground"
                  : "rounded bg-muted px-4 py-1.5 text-sm text-muted-foreground"
              }
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {albums.map((g, i) => (
            <figure key={g.id}>
              <img
                src={PHOTOS[i % PHOTOS.length]}
                alt={g.title}
                loading="lazy"
                width={800}
                height={560}
                className="aspect-[10/7] w-full bg-muted object-cover"
              />
              <figcaption className="mt-3 text-sm font-medium">{g.title}</figcaption>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" /> {g.count} items · {g.date}
              </p>
            </figure>
          ))}
          {albums.length === 0 && (
            <p className="col-span-full py-16 text-center text-sm text-muted-foreground">
              No albums published yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
