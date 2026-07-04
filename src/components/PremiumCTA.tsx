import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import brand1 from "@/assets/cta/brand-1.png";
import brand2 from "@/assets/cta/brand-2.png";

const SLIDES = [brand1, brand2] as const;
const SLIDE_INTERVAL_MS = 6000;

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Preload both images up-front to prevent any flicker on transition
  useEffect(() => {
    SLIDES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={`relative w-full overflow-hidden bg-black ${
        asHero ? "min-h-screen" : "min-h-[85vh] border-t border-white/5"
      }`}
    >
      {/* Slideshow — full-bleed, object-contain to preserve original artwork */}
      <div className="absolute inset-0">
        {SLIDES.map((src, index) => {
          const isActive = index === activeIndex;
          return (
            <img
              key={src}
              src={src}
              alt=""
              role="presentation"
              loading="eager"
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-[1400ms] ease-in-out will-change-[opacity,transform] ${
                isActive ? "opacity-100 animate-ken-burns" : "opacity-0"
              }`}
              style={{ backgroundColor: "#000" }}
            />
          );
        })}
      </div>

      {/* Subtle overlay for readability of overlaid CTA text */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
        }}
      />

      {/* CTA content */}
      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 md:pb-20 md:pt-32">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm md:text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Enterprise Cybersecurity
          </div>

          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
            Secure. Scale. <span className="text-primary">Transform.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
            Partner with ClickBox to build resilient cybersecurity, AI, cloud, and
            enterprise technology solutions trusted by modern organizations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-[rgba(208,201,195,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#007A48] hover:border-[rgba(208,201,195,0.55)]"
            >
              Book a Strategy Call <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
            >
              Explore Our Solutions
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumCTA;
