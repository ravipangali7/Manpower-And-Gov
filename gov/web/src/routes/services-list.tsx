import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import emblem from "@/assets/nepal-emblem.png";
import { PageBar } from "@/components/site-header";
import { useCms } from "@/lib/cms-store";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services-list")({
  head: () =>
    buildPageMeta({
      title: "Services — Department of Foreign Employment",
      description:
        "Online services of the Department of Foreign Employment: FEIMS labour approval, sticker search, pre-permission and grievance management.",
      path: "/services-list",
    }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data } = useCms();

  return (
    <div>
      <PageBar label="Services" />
      <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
        <h1 className="gov-section-title text-lg">Our Services</h1>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 rounded border border-border p-6 transition hover:border-gov-blue"
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border">
                <img src={emblem} alt="Emblem of Nepal" loading="lazy" width={40} height={40} className="h-9 w-9" />
              </span>
              <span>
                <span className="flex items-center gap-1 text-sm font-medium text-gov-blue">
                  {s.title} <ExternalLink className="h-3.5 w-3.5" />
                </span>
                <span className="mt-1 block text-xs leading-6 text-muted-foreground">{s.description}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
