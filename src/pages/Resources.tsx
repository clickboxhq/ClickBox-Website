import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts, resourceGroups, groupForCategory, type BlogPost } from "@/data/blog";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const PostCard = ({
  post,
  featured = false,
  variant = "dark",
}: {
  post: BlogPost;
  featured?: boolean;
  variant?: "dark" | "light";
}) => {
  const isLight = variant === "light";
  const cardClass = isLight
    ? "glass-card-dark group block h-full overflow-hidden rounded-xl transition-all duration-300 hover:border-primary/40"
    : "glass-card group block h-full overflow-hidden transition hover:border-primary/40";

  return (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4 }}
    className={featured ? "lg:col-span-2" : ""}
  >
    <Link to={`/resources/${post.slug}`} className={cardClass}>
      {post.heroImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={post.heroImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
        </div>
      )}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="badge-accent-frame rounded-full bg-[#0D2028] px-2.5 py-0.5">
            {post.category}
          </span>
          <span>·</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {post.readTime} min
          </span>
        </div>
        <h3
          className={`mt-4 font-heading font-semibold text-foreground transition-colors group-hover:text-primary ${
            featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xs">
            <p className="font-medium text-foreground">{post.author}</p>
            <p className="text-muted-foreground">{post.authorRole}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-70 transition-opacity group-hover:opacity-100">
            Read article <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  </motion.article>
  );
};

const Resources = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof resourceGroups)[number]>("All");

  useEffect(() => {
    const fromUrl = searchParams.get("group");
    if (fromUrl && resourceGroups.includes(fromUrl as (typeof resourceGroups)[number])) {
      setGroup(fromUrl as (typeof resourceGroups)[number]);
    }
  }, [searchParams]);

  const featured = useMemo(() => blogPosts.filter((p) => p.featured), []);
  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchesGroup = group === "All" || groupForCategory(p.category) === group;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [query, group]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="section-padding relative overflow-hidden pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.12),transparent_60%)]" />
        <div className="mx-auto max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="badge-accent-frame mb-6 rounded-full bg-[#0D2028] px-4 py-1.5 backdrop-blur">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              ClickBox Resource Center
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Cybersecurity insights, threat intelligence, and{" "}
              <span className="text-gradient">compliance guidance.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Practical perspectives from the ClickBox team on building, defending, and operating
              secure modern organizations.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 100))}
                placeholder="Search articles, topics, authors…"
                className="w-full rounded-md border border-white/10 bg-background/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 backdrop-blur"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {resourceGroups.map((c) => (
                <button
                  key={c}
                  onClick={() => setGroup(c)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    group === c
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-white/10 bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 && group === "All" && !query && (
        <section className="section-padding border-t border-black/5 bg-white pt-12">
          <div className="mx-auto max-w-7xl">
            <p className="section-label mb-6">
              Featured Articles
            </p>
            <div className="grid gap-6 lg:grid-cols-2">
              {featured.map((p) => (
                <PostCard key={p.slug} post={p} variant="light" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between gap-4">
            <p className="section-label">
              {query || group !== "All" ? "Results" : "Recent Posts"}
            </p>
            <p className="text-xs text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "article" : "articles"}
            </p>
          </div>
          {filtered.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-muted-foreground">
                No articles match your search. Try a different keyword or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
