export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
        <path d="M1 12 L9 1 L13 12 Z" fill="oklch(0.564 0.183 28.5)" />
      </svg>
      <h2 className="section-title">{children}</h2>
      <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
        <path d="M5 2 L17 2 L11 13 Z" fill="oklch(0.55 0.13 244)" />
      </svg>
    </div>
  );
}
