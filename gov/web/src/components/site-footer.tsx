import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import emblem from "@/assets/nepal-emblem.png";
import { FOOTER_LINKS_LEFT, FOOTER_LINKS_RIGHT, type FooterLink } from "@/data/site";
import { SITE_ENTITY } from "@/config/site-seo";

function LinkList({ items }: { items: readonly FooterLink[] }) {
  return (
    <ul className="space-y-3">
      {items.map((l) => (
        <li key={l.href + l.label} className="border-l-2 border-primary-foreground/50 pl-3 text-sm leading-relaxed">
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-gov-blue text-primary-foreground">
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
        <div className="flex items-center gap-4">
          <img src={emblem} alt="Emblem of Nepal" loading="lazy" width={80} height={80} className="h-20 w-20" />
          <div className="leading-tight">
            <p className="text-sm">{SITE_ENTITY.parentMinistry}</p>
            <p className="text-xl font-semibold">{SITE_ENTITY.name}</p>
            <p className="text-sm">{SITE_ENTITY.address}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Office hours</h3>
            <p className="mt-5 text-sm font-medium">जाडो (कार्तिक १६ देखि माघ १५)</p>
            <div className="mt-3 flex justify-between border-b border-primary-foreground/25 pb-4 text-sm">
              <span>Monday- Friday</span>
              <span>09:00 A.M. - 4:00 P.M.</span>
            </div>
            <p className="mt-5 text-sm font-medium">गर्मी (माघ १६ देखि कार्तिक १५)</p>
            <div className="mt-3 flex justify-between text-sm">
              <span>Monday- Friday</span>
              <span>09:00 A.M. - 5:00 P.M.</span>
            </div>

            <h3 className="mt-8 text-lg font-semibold">About & contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/pages/$slug" params={{ slug: "aim-and-vision" }} className="hover:underline">
                  Aim and Vision
                </Link>
              </li>
              <li>
                <Link to="/our-team" className="hover:underline">
                  Official and Staff
                </Link>
              </li>
              <li>
                <Link to="/pages/$slug" params={{ slug: "citizen-charter" }} className="hover:underline">
                  Citizen Charter
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/services-list" className="hover:underline">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="mb-5 text-lg font-semibold">Important Links</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <LinkList items={FOOTER_LINKS_LEFT} />
              <LinkList items={FOOTER_LINKS_RIGHT} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/dofe.np"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://x.com/baidesik_rojgar" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <span className="font-semibold">𝕏</span>
            </a>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {SITE_ENTITY.address}
            </span>
            <a href={`mailto:${SITE_ENTITY.email}`} className="flex items-center gap-2 hover:underline">
              <Mail className="h-4 w-4" /> {SITE_ENTITY.email}
            </a>
            <a href={`tel:${SITE_ENTITY.phone.replace(/-/g, "")}`} className="flex items-center gap-2 hover:underline">
              <Phone className="h-4 w-4" /> {SITE_ENTITY.phone}
            </a>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> <span className="font-semibold">Toll free no</span>{" "}
              {SITE_ENTITY.tollFree}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
