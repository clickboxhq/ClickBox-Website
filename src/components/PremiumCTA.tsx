import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import hqImage from "@/assets/clickbox-hq.jpg";

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  return (
    <section
      className={`relative overflow-hidden ${
        asHero ? "min-h-[88vh] pt-28 md:pt-32" : "border-t border-white/5"
      }`}
    >
      {/* Background image — bundled for production; logo focal point on upper-right */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
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
        {/* Subtle overlays — preserve building architecture and logo visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/5 to-background/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-background/10 to-transparent md:from-background/40 md:via-transparent" />
      </div>

      <div
        className={`relative z-10 mx-auto flex max-w-7xl px-6 ${
          asHero
            ? "min-h-[80vh] items-center py-16 md:py-24"
            : "items-center py-24 md:py-32"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card w-full max-w-sm p-5 backdrop-blur-2xl sm:max-w-md sm:p-6 md:max-w-lg md:p-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary md:text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Enterprise Cybersecurity
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Build Securely With <span className="text-gradient">ClickBox.</span>
          </h1>

          <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-foreground/90 sm:text-base md:mt-5 md:text-lg">
            Helping organizations strengthen security, reduce risk, and scale with confidence
            through practical cybersecurity services and expertise.
          </p>

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
        </motion.div>
      </div>

      {/* Accessible description for screen readers */}
      <span className="sr-only">ClickBox headquarters building</span>
    </section>
  );
};

export default PremiumCTA;
