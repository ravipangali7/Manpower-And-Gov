import type { QueryClient } from "@tanstack/react-query";

/** Invalidate all public-site React Query caches so the frontend reflects CMS edits. */
export function invalidatePublicQueries(qc: QueryClient) {
  return qc.invalidateQueries({ queryKey: ["public"] });
}
