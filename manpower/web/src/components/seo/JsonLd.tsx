type JsonLdProps = {
  /** Any JSON-serializable schema.org object or array. */
  data: object;
};

/** Renders a safe application/ld+json script via JSON.stringify. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes < so this is safe for script embedding
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
