import { getStaticRouteMeta, SITE_URL, absoluteOgImage, DEFAULT_OG_IMAGE_ALT, type RouteMeta } from "./src/seo/routes";
import { getBlogRouteMeta } from "./src/seo/blogSeo";

/**
 * Edge-time <head> rewrite for the SPA's single index.html.
 *
 * The app is a client-rendered Vite SPA (no SSR), so every route serves the
 * same index.html. Crawlers/social bots that don't execute JS (and the very
 * first byte Googlebot sees) would otherwise all get the homepage's title,
 * description, canonical, and OG tags — regardless of which page they
 * requested. This rewrites those tags per-route at the edge, before the
 * response reaches the client, using src/seo/routes.ts as the single source
 * of truth (same data the sitemap and the client-side useSeo hook use).
 *
 * Unmatched routes get a real 404 status + noindex (still rendering the
 * SPA's own NotFound UI, so humans see the normal branded 404 page).
 */

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function resolveMeta(pathname: string): { meta: RouteMeta; found: boolean } {
  const staticMatch = getStaticRouteMeta(pathname);
  if (staticMatch) return { meta: staticMatch, found: true };

  const blogMatch = pathname.match(/^\/resources\/([^/]+)\/?$/);
  if (blogMatch) {
    const post = getBlogRouteMeta(decodeURIComponent(blogMatch[1]));
    if (post) return { meta: post, found: true };
    return {
      meta: {
        path: pathname,
        title: "Article Not Found | ClickBox",
        description: "The article you're looking for doesn't exist.",
        index: false,
      },
      found: false,
    };
  }

  return {
    meta: {
      path: pathname,
      title: "Page Not Found | ClickBox",
      description: "The page you're looking for doesn't exist or may have moved.",
      index: false,
    },
    found: false,
  };
}

function rewriteHead(html: string, pathname: string, meta: RouteMeta): string {
  const canonicalUrl = `${SITE_URL}${pathname}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(absoluteOgImage(meta.ogImage));
  const imageAlt = escapeHtml(meta.ogImageAlt ?? DEFAULT_OG_IMAGE_ALT);
  const robots = meta.index ? "index, follow" : "noindex, nofollow";

  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonicalUrl}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${robots}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonicalUrl}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<meta property="og:image:alt" content=")[^"]*(")/, `$1${imageAlt}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${image}$2`)
    .replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/, `$1${imageAlt}$2`);
}

// Legacy paths — also declared as real redirects in vercel.json; handled
// here too so the result doesn't depend on middleware/redirect ordering.
const LEGACY_REDIRECTS: Record<string, string> = {
  "/product": "/solutions/threatlens",
  "/solutions": "/solutions/threatlens",
};

export default async function middleware(request: Request): Promise<Response> {
  const url = new URL(request.url);

  const redirectTo = LEGACY_REDIRECTS[url.pathname];
  if (redirectTo) {
    return Response.redirect(new URL(redirectTo, url.origin), 308);
  }

  const { meta, found } = resolveMeta(url.pathname);

  const originResponse = await fetch(request);
  const contentType = originResponse.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return originResponse;

  const html = await originResponse.text();
  const rewritten = rewriteHead(html, url.pathname, meta);

  const headers = new Headers(originResponse.headers);
  const isProd = process.env.VERCEL_ENV === "production";
  if (!isProd) headers.set("X-Robots-Tag", "noindex, nofollow");

  return new Response(rewritten, {
    status: found ? originResponse.status : 404,
    headers,
  });
}

export const config = {
  matcher: ["/((?!assets/|.*\\.[a-zA-Z0-9]+$).*)"],
};
