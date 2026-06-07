import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import hqImage from "@/assets/clickbox-hq.jpg";

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  return (
    <section
      className={`relative overflow-hidden bg-background ${
        asHero ? "min-h-[88vh] pt-28 md:pt-32" : "border-t border-white/5"
      }`}
    >
      {/* Building image — full showcase, no aggressive crop */}
      <div className="absolute inset-0 z-0 bg-background" aria-hidden="true">
        <img
          src={hqImage}
          alt=""
          role="presentation"
          loading={asHero ? "eager" : "lazy"}
          fetchPriority={asHero ? "high" : "auto"}
          decoding="async"
          sizes="100vw"
          className="h-full w-full object-contain object-center md:object-[72%_50%]"
        />
        {/* Light overlays — preserve architecture visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/35 via-transparent to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent md:from-background/55 md:via-background/10 md:to-transparent" />
      </div>

      <div
        className={`relative z-10 mx-auto flex max-w-7xl px-6 ${
          asHero
            ? "min-h-[80vh] items-center py-16 md:py-24"
            : "items-center py-24 md:py-32"
        }`}
      >
        <div className="max-w-sm sm:max-w-md md:max-w-lg">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/20 bg-white/75 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black backdrop-blur-sm md:text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5 text-black" />
            Enterprise Cybersecurity
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Build Securely With{" "}
            <span className="hero-brand-outline" data-text="ClickBox.">
              ClickBox.
            </span>
          </h1>

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
      </div>

      <span className="sr-only">ClickBox headquarters building</span>
    </section>
  );
};

export default PremiumCTA;
