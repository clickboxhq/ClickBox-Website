import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import img9576 from "@/assets/IMG_9576.png";
import img9574 from "@/assets/IMG_9574.jpeg";
import img9571 from "@/assets/IMG_9571.jpeg";

const SLIDE_IMAGES = [img9576, img9574, img9571] as const;
const SLIDE_INTERVAL_MS = 4000;

type Props = {
  asHero?: boolean;
};

const HeroHeadline = ({ className = "" }: { className?: string }) => (
  <h1 className={`hero-headline font-heading font-bold ${className}`}>
    <span className="hero-headline-line">Build Securely</span>
    <span className="hero-headline-line-muted">With ClickBox</span>
  </h1>
);

const BackgroundSlideshow = ({
  activeIndex,
  asHero,
}: {
  activeIndex: number;
  asHero: boolean;
}) => (
  <>
    {SLIDE_IMAGES.map((src, index) => (
      <img
        key={src}
        src={src}
        alt=""
        role="presentation"
        loading={asHero && index === 0 ? "eager" : "lazy"}
        fetchPriority={asHero && index === 0 ? "high" : "auto"}
        decoding="async"
        sizes="100vw"
        className={`absolute left-0 top-0 h-full w-full max-w-none object-cover object-center transition-opacity duration-1000 ease-in-out ${
          index === activeIndex ? "opacity-100" : "opacity-0"
        }`}
      />
    ))}
  </>
);

const PremiumCTA = ({ asHero = false }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroContentScale = useTransform(scrollYProgress, [0, 0.4], [1, reduced ? 1 : 0.96]);
  const heroBgY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 28]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDE_IMAGES.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full bg-background ${
        asHero ? "mobile-cta-section-root" : "border-t border-white/5"
      }`}
    >
      {/* ═══════════════════════════════════════
          MOBILE ONLY  (max-width: 767px)
          Full-height hero — image fills section,
          content sits over a bottom gradient.
          ═══════════════════════════════════════ */}
      <div className="mobile-cta-screen md:hidden">
        <div className="mobile-cta-wrapper">
          <div className="absolute inset-0">
            <BackgroundSlideshow activeIndex={activeIndex} asHero={asHero} />
          </div>

          {/* Dark overlay — bottom-up gradient for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 40%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Subtle top fade from navbar */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              height: "15%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)",
            }}
          />

          {/* Content — lower-left / lower-center */}
          <div className="absolute inset-x-0 bottom-0 px-5 pb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
              Enterprise Cybersecurity
            </div>

            <HeroHeadline className="text-[2rem]" />

            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
              >
                Book a Security Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/#services"
                className="inline-flex items-center justify-center rounded-md border border-white/20 bg-black/30 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-black/50"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          DESKTOP / TABLET  (min-width: 768px)
          Unchanged — do NOT modify.
          ═══════════════════════════════════════ */}
      <div className="hidden min-h-screen md:block">
        <div
          className="relative min-h-screen w-full overflow-hidden"
          aria-hidden="true"
        >
          <motion.div className="absolute inset-0" style={{ y: heroBgY, willChange: "transform" }}>
            <BackgroundSlideshow activeIndex={activeIndex} asHero={asHero} />
          </motion.div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
            style={{
              height: "50%",
              background: "linear-gradient(to bottom, transparent, hsl(var(--background)))",
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10"
            style={{
              height: "22%",
              background: "linear-gradient(to bottom, hsl(var(--background)), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10"
            style={{
              width: "55%",
              background:
                "linear-gradient(to right, hsl(var(--background) / 0.72), hsl(var(--background) / 0.28) 60%, transparent)",
            }}
          />
        </div>

        <motion.div
          className="relative z-20 mx-auto max-w-7xl px-6 pb-16 md:pb-24"
          style={{
            marginTop: "clamp(-180px, -20vw, -240px)",
            scale: heroContentScale,
            transformOrigin: "left bottom",
            willChange: "transform",
          }}
        >
          <div className={`max-w-sm sm:max-w-md md:max-w-xl ${asHero ? "pt-0" : "pt-4"}`}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/25 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black backdrop-blur-sm md:text-[11px]">
              <ShieldCheck className="h-3.5 w-3.5 text-black" />
              Enterprise Cybersecurity
            </div>

            <HeroHeadline className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl" />

            <div className="mt-6 flex flex-wrap gap-3 md:mt-8 md:gap-4">
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
        </motion.div>
      </div>

      <span className="sr-only">ClickBox headquarters building</span>
    </section>
  );
};

export default PremiumCTA;
