import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { DOFE_FAQS } from "@/data/faqs";
import { faqPage } from "@/lib/schema";

function linkifyKnownUrls(text: string) {
  const urls = ["https://ujuri.dofe.gov.np", "https://feims.dofe.gov.np"] as const;
  const found = urls.find((u) => text.includes(u));
  if (!found) return <>{text}</>;
  const [before, after] = text.split(found);
  return (
    <>
      {before}
      <a href={found} className="gov-link" target="_blank" rel="noopener noreferrer">
        {found}
      </a>
      {after}
    </>
  );
}

function FaqAnswer({ text }: { text: string }) {
  return linkifyKnownUrls(text);
}

export function FaqSection({
  title = "Frequently asked questions",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <section className={className} aria-labelledby="dofe-faq-heading">
      <JsonLd id="faq-jsonld" data={faqPage(DOFE_FAQS)} />
      <h2 id="dofe-faq-heading" className="gov-section-title text-lg">
        {title}
      </h2>
      <Accordion type="single" collapsible className="mt-6 w-full">
        {DOFE_FAQS.map((faq, i) => (
          <AccordionItem key={faq.question} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-sm text-foreground">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              <FaqAnswer text={faq.answer} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
