import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import hqImage from "@/assets/clickbox-hq.jpg";

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  return (
    <section
      className={`relative w-full bg-background ${
        asHero ? "" : "border-t border-white/5"
      }`}
    >
      {/* Building image wrapper — mobile: taller showcase; desktop: unchanged */}
      <div
        className="cta-building-wrapper relative w-full overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={hqImage}
          alt=""
          role="presentation"
          loading={asHero ? "eager" : "lazy"}
          fetchPriority={asHero ? "high" : "auto"}
          decoding="async"
          sizes="100vw"
          className="building-img absolute inset-0 h-full w-full"
          style={{
            objectFit: "contain",
            background: "hsl(0 0% 4%)",
          }}
        />
        {/* Gradient fade: bottom into page background */}
        <div
          className="cta-gradient-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10"
          style={{
            background: "linear-gradient(to bottom, transparent, hsl(0 0% 4%))",
          }}
        />
        {/* Gradient fade: top from navbar */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10"
          style={{
            height: "22%",
            background: "linear-gradient(to bottom, hsl(0 0% 4%), transparent)",
          }}
        />
        {/* Gradient fade: left for text readability (desktop only) */}
        <div
          className="cta-gradient-left pointer-events-none absolute inset-y-0 left-0 z-10"
          style={{
            width: "55%",
            background:
              "linear-gradient(to right, hsl(0 0% 4% / 0.72), hsl(0 0% 4% / 0.28) 60%, transparent)",
          }}
        />
        {/* Mobile: subtle bottom vignette for premium framing */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 md:hidden"
          style={{
            height: "35%",
            background:
              "linear-gradient(to top, hsl(0 0% 4% / 0.85), transparent)",
          }}
        />
      </div>

      {/* Content — mobile: centered below building; desktop: unchanged overlap */}
      <div className="cta-content-wrapper relative z-20 mx-auto max-w-7xl">
        <div className={`cta-content-inner ${asHero ? "pt-0" : "pt-2 md:pt-4"}`}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black backdrop-blur-sm md:text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-black" />
            Enterprise Cybersecurity
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Build Securely With{" "}
            <span className="hero-brand-outline" data-text="ClickBox.">
              ClickBox.
            </span>
          </h1>

          <div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-8 md:justify-start md:gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 md:px-6 md:py-3"
            >
              Book a Security Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/#services"
              className="rounded-md border border-white/10 bg-secondary/80 px-5 py-2.5 text-sm font-semibold text-secondary-foreground backdrop-blur transition-all hover:bg-muted md:px-6 md:py-3"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      <span className="sr-only">ClickBox headquarters building</span>
    </section>
  );
};

export default PremiumCTA;
