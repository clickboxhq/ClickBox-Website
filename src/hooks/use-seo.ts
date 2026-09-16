import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL, SITE_NAME, TWITTER_SITE, absoluteOgImage, DEFAULT_OG_IMAGE_ALT } from "@/seo/routes";

type SeoInput = {
  title: string;
  description: string;
  ogImage?: string;
  ogImageAlt?: string;
  /** Defaults to true. Set false for pages that must never be indexed. */
  index?: boolean;
};

/**
 * Updates <title>, description, canonical, and OG/Twitter tags for the
 * current route on the client. This keeps the browser tab title and
 * Googlebot's rendered view correct on client-side navigations; the initial
 * HTTP response (crawlers that don't execute JS, first paint) is handled
 * separately by the edge middleware using the same src/seo data.
 */
export function useSeo({ title, description, ogImage, ogImageAlt, index = true }: SeoInput) {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${location.pathname}`;
    const image = absoluteOgImage(ogImage);
    const imageAlt = ogImageAlt ?? DEFAULT_OG_IMAGE_ALT;
    const previousTitle = document.title;

    document.title = title;

    const setName = (name: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };
    const setProp = (prop: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setName("description", description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    setProp("og:site_name", SITE_NAME);
    setProp("og:type", "website");
    setProp("og:url", canonicalUrl);
    setProp("og:title", title);
    setProp("og:description", description);
    setProp("og:image", image);
    setProp("og:image:alt", imageAlt);
    setName("twitter:card", "summary_large_image");
    setName("twitter:site", TWITTER_SITE);
    setName("twitter:title", title);
    setName("twitter:description", description);
    setName("twitter:image", image);

    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!index) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.setAttribute("name", "robots");
        document.head.appendChild(robots);
      }
      robots.setAttribute("content", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }

    return () => {
      document.title = previousTitle;
    };
  }, [title, description, ogImage, ogImageAlt, index, location.pathname]);
}
