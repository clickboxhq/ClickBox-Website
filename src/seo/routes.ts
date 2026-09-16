/**
 * Single source of truth for public-route SEO metadata.
 *
 * Consumed by:
 *  - `useSeo` (client-side <head> updates on route change)
 *  - `scripts/generate-sitemap.mjs` (build-time sitemap.xml)
 *  - `middleware.ts` (edge-time <head> injection for crawlers/social bots)
 *
 * Keep this the only place static route metadata is declared so the app,
 * the sitemap, and the edge middleware can never drift apart.
 */

export const SITE_URL = "https://www.useclickbox.com";
export const SITE_NAME = "ClickBox";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-cover.jpg`;
export const DEFAULT_OG_IMAGE_ALT = "ClickBox — enterprise cybersecurity consulting and SOC as a Service";
export const TWITTER_SITE = "@clickboxhq";

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  /** Absolute URL. Defaults to DEFAULT_OG_IMAGE when omitted. */
  ogImage?: string;
  ogImageAlt?: string;
  /** Whether this page should be indexed by search engines. */
  index: boolean;
  /** Sitemap priority hint, 0–1. Only meaningful when index is true. */
  priority?: number;
};

export const staticRoutes: RouteMeta[] = [
  {
    path: "/",
    title: "ClickBox | Enterprise Cybersecurity Consulting & SOC as a Service",
    description:
      "ClickBox delivers enterprise-focused cybersecurity services — SOC as a Service, training, VAPT, ISO 27001 guidance, and data protection — for modern organizations.",
    index: true,
    priority: 1.0,
  },
  {
    path: "/about",
    title: "About ClickBox | Cybersecurity Consulting Company",
    description:
      "ClickBox is a cybersecurity company helping organizations strengthen their security posture, protect sensitive data, and stay compliant in an evolving digital landscape.",
    index: true,
    priority: 0.7,
  },
  {
    path: "/resources",
    title: "Cybersecurity Insights & Resources | ClickBox",
    description:
      "Practical perspectives from the ClickBox team on threat intelligence, compliance guidance, and operating secure modern organizations.",
    index: true,
    priority: 0.7,
  },
  {
    path: "/careers/jobs",
    title: "Careers at ClickBox | Cybersecurity Jobs",
    description:
      "Open roles and career opportunities with ClickBox's cybersecurity consulting and SOC as a Service team.",
    index: true,
    priority: 0.5,
  },
  {
    path: "/internship",
    title: "Cybersecurity Internship | ClickBox",
    description:
      "The ClickBox Cybersecurity Internship offers hands-on experience, mentorship, and real-world SOC training. Applications are currently closed — the next cohort opens in 2027.",
    index: true,
    priority: 0.6,
  },
  {
    path: "/solutions/threatlens",
    title: "ThreatLens | Cybersecurity Investigation & SOC Training Platform",
    description:
      "ThreatLens gives cybersecurity learners a hands-on environment for investigating realistic security incidents, analyzing evidence, and building practical SOC skills.",
    index: true,
    priority: 0.8,
  },
  {
    path: "/contact",
    title: "Contact ClickBox | Cybersecurity & Security Consulting",
    description:
      "Have a question about our services, need a security consultation, or want to explore ThreatLens for your team? Get in touch with ClickBox.",
    index: true,
    priority: 0.6,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | ClickBox",
    description:
      "How ClickBox Information Technology Ltd collects, uses, discloses, and safeguards your information.",
    index: true,
    priority: 0.3,
  },
  {
    // Real, working page — deliberately excluded from the sitemap (index:
    // false below filters it out), but still a known route so middleware
    // returns 200/noindex here rather than treating it as not-found.
    path: "/assessment",
    title: "Cybersecurity Assessment | ClickBox",
    description: "A short assessment tool used during ClickBox engagements.",
    index: false,
  },
  // /product, /solutions are redirect targets (HTTP 308 in vercel.json and
  // middleware.ts), not separate pages, so they have no entry here.
  // /resources/:slug is dynamic — see src/seo/blogSeo.ts.
];

export function getStaticRouteMeta(pathname: string): RouteMeta | undefined {
  return staticRoutes.find((r) => r.path === pathname);
}

export function absoluteOgImage(path?: string): string {
  if (!path) return DEFAULT_OG_IMAGE;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}
