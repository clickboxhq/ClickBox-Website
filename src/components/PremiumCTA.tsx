import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SLIDES = [
  { src: "/assets/images/cta-building.png", alt: "Black and white architectural building" },
  { src: "/assets/images/cta-robot.jpeg", alt: "Robotic arm in a bright technology lab" },
  { src: "/assets/images/cta-office.jpeg", alt: "Open-plan technology office workspace" },
] as const;

const SLIDE_INTERVAL_MS = 4000;

type Props = {
  asHero?: boolean;
};

const PremiumCTA = ({ asHero = false }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative w-full min-h-[80vh] overflow-hidden"
      aria-label="ClickBox security call to action"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            role="presentation"
            loading={asHero && index === 0 ? "eager" : "lazy"}
            fetchPriority={asHero && index === 0 ? "high" : "auto"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" aria-hidden="true" />

      <div className="relative z-10 flex min-h-[80vh] w-full items-center justify-center px-6 py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#7C3AED]">
            SECURE. INTELLIGENT. READY.
          </p>

          <h2 className="font-heading text-5xl font-bold text-white">Protect What You&apos;ve Built</h2>

          <p className="mt-5 max-w-[560px] text-lg text-white">
            ClickBox gives growing teams enterprise-grade cybersecurity — without the enterprise overhead.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#7C3AED] px-8 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Get Protected
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center justify-center rounded-full border border-white px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>

      <span className="sr-only">{SLIDES[activeIndex].alt}</span>
    </section>
  );
};

export default PremiumCTA;
