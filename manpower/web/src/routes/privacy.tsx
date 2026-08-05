import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageBanner } from "@/components/site/PageBanner";
import { JsonLd } from "@/components/seo/JsonLd";
import { company } from "@/data/site";
import { buildPageMeta } from "@/lib/seo";
import { buildBreadcrumbList } from "@/lib/schema";

export const Route = createFileRoute("/privacy")({
  head: () =>
    buildPageMeta({
      title: "Privacy Policy | Vision & Value Overseas (VNVNEPAL)",
      description:
        "How Vision & Value Overseas Pvt. Ltd. collects, uses and protects personal information of candidates, employers and website visitors.",
      path: "/privacy",
      ogTitle: "Privacy Policy | VNVNEPAL",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout partner={false}>
      <JsonLd
        data={buildBreadcrumbList([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <PageBanner title="Privacy Policy" crumb="Privacy Policy" />

      <article className="py-16">
        <div className="mx-auto max-w-[800px] space-y-8 px-5 text-[13px] leading-6 text-muted-foreground">
          <p>
            This Privacy Policy explains how {company.name} ({company.short}) handles personal
            information when you visit our website, contact us, register as a candidate, or enquire
            as an employer. We are a licensed overseas recruitment agency based in Kathmandu, Nepal.
          </p>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Who we are</h2>
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
            <h2 className="text-lg font-bold text-brand-blue">Information we collect</h2>
            <p className="mt-3">
              We may collect information you provide directly — such as your name, phone number,
              email, CV details, passport or identity documents needed for lawful recruitment, and
              messages sent through our contact or registration forms. We also receive routine
              technical data from your browser (for example IP address and pages visited) when you
              use our site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">How we use information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To respond to enquiries from candidates, employers and partners</li>
              <li>To screen, place and support candidates in overseas employment where permitted</li>
              <li>To meet legal and regulatory duties under Nepal foreign employment law</li>
              <li>To improve our website and services</li>
            </ul>
            <p className="mt-3">
              We do not sell personal information. Recruitment for candidates follows our zero-cost
              policy — we do not charge workers recruitment fees.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Sharing and confidentiality</h2>
            <p className="mt-3">
              We share candidate or employer details only as needed for recruitment (for example
              with licensed employers, medical centres, or government authorities) or when the law
              requires it. Concerns or complaints raised with us are handled with confidentiality, as
              stated in our public notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Retention and security</h2>
            <p className="mt-3">
              We keep records only as long as needed for recruitment, support, and legal compliance.
              We take reasonable technical and organisational steps to protect personal data, though
              no online transmission is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Your choices</h2>
            <p className="mt-3">
              You may request access to, correction of, or deletion of personal information we hold
              about you, subject to legal retention requirements. Contact us at{" "}
              <a href={`mailto:${company.email}`} className="font-medium text-primary">
                {company.email}
              </a>{" "}
              or visit our{" "}
              <Link to="/contact" className="font-medium text-primary">
                contact page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-brand-blue">Updates</h2>
            <p className="mt-3">
              We may update this policy from time to time. The current version is always published on
              this page. Last updated: 30 July 2026.
            </p>
          </section>
        </div>
      </article>
    </SiteLayout>
  );
}
