import { staticRoutes, SITE_URL } from "./routes";
import { allBlogRoutes } from "./blogSeo";

export type SitemapEntry = { url: string; lastmod?: string; priority?: number };

/** Every URL that should appear in public/sitemap.xml. */
export function sitemapEntries(): SitemapEntry[] {
  const staticEntries: SitemapEntry[] = staticRoutes
    .filter((r) => r.index)
    .map((r) => ({ url: `${SITE_URL}${r.path}`, priority: r.priority }));

  const blogEntries: SitemapEntry[] = allBlogRoutes().map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastmod: r.lastmod.slice(0, 10),
    priority: 0.6,
  }));

  return [...staticEntries, ...blogEntries];
}
