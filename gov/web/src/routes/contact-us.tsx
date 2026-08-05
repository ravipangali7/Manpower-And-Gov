import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { FaqSection } from "@/components/seo/faq-section";
import { PageBar } from "@/components/site-header";
import { SITE_ENTITY } from "@/config/site-seo";
import { buildPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact-us")({
  head: () =>
    buildPageMeta({
      title: "Contact Information — Department of Foreign Employment",
      description:
        "Contact the Department of Foreign Employment, Tahachal, Kathmandu. Phone 01-4792671, toll free 1140, email info@dofe.gov.np.",
      path: "/contact-us",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div>
      <PageBar
        label="Contact Information"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact Information", path: "/contact-us" },
        ]}
      />
      <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
        <h1 className="border-b border-border pb-4 text-2xl font-semibold">Contact information</h1>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          <iframe
            title="Department of Foreign Employment location map"
            className="h-[420px] w-full border border-border"
            loading="lazy"
            src="https://www.google.com/maps?q=Department%20of%20Foreign%20Employment%20Tahachal%20Kathmandu&output=embed"
          />

          <div>
            <h2 className="text-xl font-semibold">Contact us for complaints and suggestions</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gov-blue" />
                <span className="gov-link">{SITE_ENTITY.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gov-blue" />
                <span>
                  <span className="block text-muted-foreground">Contact information</span>
                  <span className="gov-link">{SITE_ENTITY.phone}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <PhoneCall className="mt-0.5 h-4 w-4 text-gov-blue" />
                <span>
                  <span className="block text-muted-foreground">Toll Free Number</span>
                  <span className="font-semibold text-gov-blue">Toll free no {SITE_ENTITY.tollFree}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gov-blue" />
                <span>
                  <span className="block text-muted-foreground">Email</span>
                  <a href={`mailto:${SITE_ENTITY.email}`} className="gov-link">
                    {SITE_ENTITY.email}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 w-4 text-center font-semibold text-gov-blue">𝕏</span>
                <span>
                  <span className="block text-muted-foreground">Twitter</span>
                  <a href="https://x.com/baidesik_rojgar" className="gov-link">
                    https://x.com/baidesik_rojgar
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Facebook className="mt-0.5 h-4 w-4 text-gov-blue" />
                <span>
                  <span className="block text-muted-foreground">Facebook</span>
                  <a href="https://www.facebook.com/dofe.np" className="gov-link">
                    https://www.facebook.com/dofe.np
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <FaqSection className="mt-16 max-w-3xl" title="Frequently asked questions" />
      </section>
    </div>
  );
}
