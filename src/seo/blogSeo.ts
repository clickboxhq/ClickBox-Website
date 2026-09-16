// Relative import (not the "@/" alias) — this module is bundled both by
// Vite (app) and independently by Vercel's edge middleware bundler, and a
// plain relative path resolves correctly in both without relying on either
// bundler picking up tsconfig path aliases.
import { blogPosts } from "../data/blog";
import { type RouteMeta } from "./routes";

export type BlogRouteMeta = RouteMeta & { lastmod: string };

export function getBlogRouteMeta(slug: string): BlogRouteMeta | undefined {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return undefined;
  return {
    path: `/resources/${post.slug}`,
    title: `${post.title} | ClickBox`,
    description: post.excerpt,
    ogImage: post.heroImage,
    index: true,
    lastmod: post.publishedAt,
  };
}

export function allBlogRoutes(): BlogRouteMeta[] {
  return blogPosts.map((post) => ({
    path: `/resources/${post.slug}`,
    title: `${post.title} | ClickBox`,
    description: post.excerpt,
    ogImage: post.heroImage,
    index: true,
    lastmod: post.publishedAt,
  }));
}
