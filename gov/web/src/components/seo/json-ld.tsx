/**
 * Renders a JSON-LD script tag. Uses JSON.stringify so output is always valid JSON.
 */
export function JsonLd({ data, id }: { data: Record<string, unknown> | Record<string, unknown>[]; id?: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
