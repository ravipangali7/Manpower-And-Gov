import { buildPageMeta } from "@/lib/seo";
import { publicApi, type PageSeo } from "@/lib/public-api";

type SeoDefaults = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article";
};

/** Merge CMS PageMeta / site defaults with route-level SEO fallbacks. */
export function seoFromCms(cms: PageSeo | null | undefined, defaults: SeoDefaults) {
  return buildPageMeta({
    title: cms?.title?.trim() || defaults.title,
    description: cms?.description?.trim() || defaults.description,
    path: defaults.path,
    image: cms?.og_image_url || undefined,
    ogTitle: defaults.ogTitle,
    ogDescription: defaults.ogDescription,
    type: defaults.type,
  });
}

/** Loader helper used by public routes to pull live SEO from the API. */
export async function loadPageSeo(path: string): Promise<PageSeo | null> {
  try {
    return await publicApi.seo(path);
  } catch {
    return null;
  }
}
