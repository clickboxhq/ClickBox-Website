import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import icebergAsset from "@/assets/cta/iceberg.png.asset.json";

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
      {/* Iceberg background — full-bleed, cinematic */}
      <div className="absolute inset-0">
        <img
          src={icebergAsset.url}
          alt=""
          role="presentation"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center animate-ken-burns will-change-transform"
        />
      </div>

      {/* Axiom Blue brand overlay — blends image into brand */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(21,49,64,0.55) 0%, rgba(21,49,64,0.35) 40%, rgba(13,32,40,0.75) 80%, rgba(13,32,40,0.95) 100%)",
        }}
      />
      {/* Left-side vignette for text legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(13,32,40,0.75) 0%, rgba(13,32,40,0.35) 40%, rgba(13,32,40,0) 70%)",
        }}
      />

      {/* CTA content */}
      <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-end px-6 pb-14 pt-28 md:pb-20 md:pt-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm md:text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#BDC4C6]" />
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

          <div className="mt-8 flex flex-wrap gap-3 md:gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-[rgba(189,196,198,0.4)] bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#1D4358] hover:border-[rgba(189,196,198,0.55)]"
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
