import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import hqImage from "@/assets/clickbox-hq.jpg";

// ─── Animation variants ──────────────────────────────────────────────────────

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.25,
    },
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: image drifts slowly as section scrolls out of view
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Image moves from -5% → +5% of its own height as section scrolls away.
  // Ken Burns scale (up to 1.08) provides headroom so image never clips.
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden ${
        asHero
          ? "min-h-[90vh]"
          : "min-h-[70vh] border-t border-white/5"
      }`}
    >
      {/* ── Building image — Ken Burns + Parallax ─────────────────────── */}
      <motion.div
        aria-hidden="true"
        style={{ position: "absolute", top: "-8%", right: "-8%", bottom: "-8%", left: "-8%", y: imageY }}
      >
        {/* Ken Burns animation applied to inner div; parallax on outer */}
        <div
          className="h-full w-full will-change-transform"
          style={{ animation: "kenBurns 20s ease-in-out infinite" }}
        >
          <img
            src={hqImage}
            alt=""
            role="presentation"
            loading={asHero ? "eager" : "lazy"}
            fetchPriority={asHero ? "high" : "auto"}
            decoding="async"
            sizes="100vw"
            className="h-full w-full object-cover object-[82%_28%] sm:object-[78%_26%] md:object-[72%_24%] lg:object-[68%_22%]"
          />
        </div>
      </motion.div>

      {/* ── Atmospheric vignette — barely-visible depth layer ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 68% 38%, transparent 38%, hsl(0 0% 0% / 0.22) 100%)",
          animation: "atmosphericPulse 14s ease-in-out infinite",
        }}
      />

      {/* ── Glass reflection sweep — architectural glass facade shimmer ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(108deg, transparent 38%, rgba(255,255,255,0.038) 50%, transparent 62%)",
            animation: "glassShimmer 14s ease-in-out 6s infinite",
          }}
        />
      </div>

      {/* ── Gradient overlays — text readability without a glass card ─── */}
      {/* Left: where content lives */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, hsl(0 0% 3% / 0.82) 0%, hsl(0 0% 3% / 0.52) 32%, hsl(0 0% 3% / 0.14) 60%, transparent 82%)",
        }}
      />
      {/* Top: smooth transition into navbar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36"
        style={{
          background: "linear-gradient(to bottom, hsl(0 0% 3% / 0.55) 0%, transparent 100%)",
        }}
      />
      {/* Bottom: ground fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44"
        style={{
          background: "linear-gradient(to top, hsl(0 0% 3% / 0.55) 0%, transparent 100%)",
        }}
      />

      {/* ── Content — floats over gradients, no glass card ──────────────── */}
      <div
        className={`relative z-10 mx-auto max-w-7xl px-6 ${
          asHero
            ? "flex min-h-[90vh] items-center py-32"
            : "flex min-h-[70vh] items-center py-24"
        }`}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-lg space-y-7"
        >
          {/* Badge */}
          <motion.div variants={slideUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Enterprise Cybersecurity
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={slideUp}
            className="font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            style={{
              textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 6px rgba(0,0,0,0.9)",
            }}
          >
            Build Securely
            <br />
            <span className="text-gradient">With ClickBox.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={slideUp}
            className="max-w-[400px] text-base leading-relaxed text-white/82 sm:text-lg"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
          >
            Helping organizations strengthen security, reduce risk, and scale
            with confidence through practical cybersecurity services and expertise.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={slideUp} className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2.5 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-xl hover:shadow-primary/30"
            >
              Book a Security Consultation
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center rounded-lg border border-white/25 bg-white/[0.09] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.15] hover:border-white/35"
            >
              Explore Services
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <span className="sr-only">ClickBox headquarters building</span>
    </section>
  );
};

export default PremiumCTA;
