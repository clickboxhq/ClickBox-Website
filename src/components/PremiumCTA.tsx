import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import hqAsset from "@/assets/clickbox-hq.asset.json";

const PremiumCTA = () => {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/5">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={hqAsset.url}
          alt="ClickBox headquarters building"
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* Layered overlays for legibility + brand mood */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/55 to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_70%)]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center px-6 py-28 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-card mx-auto w-full max-w-3xl p-8 md:p-12 backdrop-blur-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise Cybersecurity
          </div>

          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Build Securely With <span className="text-gradient">ClickBox.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Helping organizations strengthen security, reduce risk, and scale with confidence
            through practical cybersecurity services and expertise.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Book a Security Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/#services"
              className="rounded-md border border-white/10 bg-secondary/80 px-6 py-3 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PremiumCTA;
