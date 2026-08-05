import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { company } from "@/data/site";
import { buildPageMeta } from "@/lib/seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildPageMeta({
      title: "Terms & Conditions | Vision & Value Overseas (VNVNEPAL)",
      description:
        "Terms of use for the Vision & Value Overseas (VNVNEPAL) website and recruitment enquiries from Kathmandu, Nepal.",
      path: "/terms",
      ogTitle: "Terms & Conditions | VNVNEPAL",
    }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout partner={false}>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ])}
      />
      <PageBanner title="Terms & Conditions" crumb="Terms & Conditions" />

      <article className="py-16">
        <div className="mx-auto max-w-[800px] space-y-8 px-5 text-[13px] leading-6 text-muted-foreground">
          <p>
            These Terms &amp; Conditions govern use of the website and online forms operated by{" "}
            {company.name} ({company.short}). By using this site you agree to these terms.
          </p>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Company details</h2>
            <p className="mt-3">
              {company.name}
              <br />
              {company.address}
              <br />
              {company.poBox}
              <br />
              Phone: {company.phones.join(", ")}
              <br />
              Email:{" "}
              <a href={`mailto:${company.email}`} className="font-medium text-primary">
                {company.email}
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">What we do</h2>
            <p className="mt-3">
              We provide overseas manpower recruitment services from Nepal under licences and
              approvals required by the Government of Nepal. Website content describes our services
              for employers and job seekers; it is not a binding job offer until confirmed in writing
              through our formal process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Website use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Use the site only for lawful recruitment and information purposes</li>
              <li>Do not submit false, misleading or fraudulent information</li>
              <li>Do not attempt to disrupt or misuse the site or our systems</li>
              <li>Respect intellectual property in our text, logos and materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Candidates and fees</h2>
            <p className="mt-3">
              We operate an ethical, zero-cost recruitment model for workers: candidates are not
              charged recruitment fees by our agency. Any government fees, medical costs or other
              third-party charges required by law or destination country rules will be explained
              during the process. Registering online or submitting a CV does not guarantee placement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Employers and partners</h2>
            <p className="mt-3">
              Partnership and hiring enquiries are subject to verification of demand documents,
              compliance checks, and written agreements. Published vacancy details may change; always
              confirm current openings with our team via the{" "}
              <Link to="/contact" className="font-medium text-primary">
                contact page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Accuracy and liability</h2>
            <p className="mt-3">
              We aim to keep site information accurate but do not warrant that all content is
              complete or up to date. To the extent permitted by law, {company.name} is not liable
              for indirect or consequential loss arising from use of this website. Nothing in these
              terms limits liability that cannot be excluded under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Privacy</h2>
            <p className="mt-3">
              Personal data is handled as described in our{" "}
              <Link to="/privacy" className="font-medium text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Governing law</h2>
            <p className="mt-3">
              These terms are governed by the laws of Nepal. Disputes relating to this website will
              be subject to the courts of Kathmandu, Nepal, unless mandatory consumer protections
              require otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Contact</h2>
            <p className="mt-3">
              Questions about these terms:{" "}
              <a href={`mailto:${company.email}`} className="font-medium text-primary">
                {company.email}
              </a>{" "}
              or {company.phones[0]}. Last updated: 30 July 2026.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  );
}
