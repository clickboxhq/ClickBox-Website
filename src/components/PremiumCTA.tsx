import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Radar, Lock, Activity } from "lucide-react";
import SecurityCoreVisual from "@/components/cta/SecurityCoreVisual";

const trustMarkers = [
  { icon: Radar, label: "24/7 Threat Monitoring" },
  { icon: Lock, label: "ISO 27001-Aligned" },
  { icon: Activity, label: "AI-Powered Detection" },
];

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  return (
    <section
      className={`relative w-full overflow-hidden bg-[#0D2028] ${
        asHero ? "min-h-screen" : "min-h-[85vh] border-t border-white/5"
      }`}
    >
      {/* Base brand gradient — Axiom Blue depth, no photography */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #153140 0%, #0D2028 55%, #0D2028 100%)",
        }}
      />

      {/* Bespoke network-core visual — abstract enterprise security infrastructure */}
      <SecurityCoreVisual />

      {/* Ambient top-right glow for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 85% 8%, rgba(83,181,224,0.16), transparent 65%)",
        }}
      />

      {/* Left-side vignette for text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(13,32,40,0.9) 0%, rgba(13,32,40,0.55) 40%, rgba(13,32,40,0.1) 75%)",
        }}
      />
      {/* Bottom fade for section transitions */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, transparent 70%, rgba(13,32,40,0.9) 100%)",
        }}
      />

      {/* CTA content */}
      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-end px-6 pb-16 pt-28 md:pb-24 md:pt-32">
        <div className="max-w-2xl">
          <div className="badge-accent-frame mb-7 inline-flex rounded-full bg-[#0D2028]/70 px-4 py-1.5 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[#53B5E0]" />
            Enterprise Cybersecurity
          </div>

          <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            The Exposure You See.
            <span className="mt-2 block bg-gradient-to-r from-white via-[#F7F3F2] to-[#BDC4C6] bg-clip-text text-transparent">
              The Protection We Provide.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-[#BDC4C6] md:text-lg">
            Most organizations only see the surface of their risk. ClickBox secures everything beneath it.
          </p>

          <div className="mt-9 flex flex-wrap gap-3 md:gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-md border border-[rgba(189,196,198,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_32px_-8px_rgba(83,181,224,0.35)] transition-all hover:bg-[#1D4358] hover:border-[rgba(189,196,198,0.55)] hover:shadow-[0_8px_36px_-6px_rgba(83,181,224,0.5)]"
            >
              Book a Strategy Call{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
            >
              Explore Our Solutions
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6">
            {trustMarkers.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#BDC4C6]">
                <Icon className="h-3.5 w-3.5 text-[#53B5E0]" strokeWidth={1.75} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {asHero && (
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 opacity-60 md:flex"
          aria-hidden
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#BDC4C6]">Scroll</span>
          <span className="h-8 w-px animate-scroll-cue bg-gradient-to-b from-[#BDC4C6] to-transparent" />
        </div>
      )}
    </section>
  );
};

export default PremiumCTA;
