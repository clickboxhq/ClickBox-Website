import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Share2, Linkedin, Link2 } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/data/blog";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = useMemo(() => blogPosts.find((p) => p.slug === slug), [slug]);
  const related = useMemo(
    () => blogPosts.filter((p) => p.slug !== slug && p.category === post?.category).slice(0, 3),
    [slug, post],
  );

  useEffect(() => {
    if (post) document.title = `${post.title} — ClickBox`;
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 pt-40 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">Article not found</h1>
          <p className="mt-4 text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Link to="/resources" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Resources
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const url = typeof window !== "undefined" ? window.location.href : "";
  const shareTwitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-32">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <span className="badge-accent-frame inline-block rounded-full bg-[#0D2028] px-3 py-1">
              {post.category}
            </span>
            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> {fmtDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {post.readTime} min read
              </span>
              <span>
                <span className="text-foreground">{post.author}</span> · {post.authorRole}
              </span>
            </div>
          </motion.header>
        </div>

        {/* Hero image */}
        <div className="mx-auto mt-12 max-w-5xl px-6">
          <div className="glass relative overflow-hidden rounded-2xl">
            {post.heroImage ? (
              <img
                src={post.heroImage}
                alt={post.title}
                loading="eager"
                className="aspect-[16/8] w-full object-cover"
              />
            ) : (
              <div className="aspect-[16/8] w-full bg-gradient-to-br from-primary/20 via-secondary to-background" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_70%)]" />
          </div>
        </div>

        {/* Body */}
        <div className="mx-auto mt-12 max-w-3xl px-6">
          <div className="prose-clickbox space-y-6">
            {post.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="text-base leading-relaxed text-foreground/90"
              >
                {p}
              </motion.p>
            ))}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="mt-10 flex items-center gap-3 border-t border-white/5 pt-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Share2 className="h-3.5 w-3.5" /> Share
            </span>
            <a
              href={shareTwitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/10 bg-secondary/60 p-2 text-muted-foreground hover:text-primary"
              aria-label="Share on X"
            >
              <XIcon className="h-4 w-4" />
            </a>
            <a
              href={shareLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/10 bg-secondary/60 p-2 text-muted-foreground hover:text-primary"
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <button
              onClick={copyLink}
              className="rounded-md border border-white/10 bg-secondary/60 p-2 text-muted-foreground hover:text-primary"
              aria-label="Copy link"
            >
              <Link2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="section-padding mt-16 border-t border-white/5">
            <div className="mx-auto max-w-7xl">
              <p className="section-label mb-6">
                Related articles
              </p>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/resources/${r.slug}`}
                    className="glass-card group block p-6 transition hover:border-primary/40"
                  >
                    <p className="micro-label">
                      {r.category}
                    </p>
                    <h3 className="mt-3 font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-[#53B5E0]">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#53B5E0]">
                      Read article <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
