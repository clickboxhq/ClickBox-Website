import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Radar, Layers, ShieldCheck, Activity } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const phases = [
  {
    id: "discover",
    label: "01 — Discover",
    title: "Threat & risk baseline",
    desc: "We map your environment, exposure, and compliance obligations to establish a clear security baseline.",
    icon: Radar,
    accent: "from-primary/20 to-transparent",
  },
  {
    id: "align",
    label: "02 — Align",
    title: "Security architecture",
    desc: "Controls and roadmaps are aligned to business priorities — security that supports growth, not friction.",
    icon: Layers,
    accent: "from-primary/15 to-transparent",
  },
  {
    id: "deploy",
    label: "03 — Deploy",
    title: "Implementation & hardening",
    desc: "Targeted solutions are delivered with expert guidance — policies, tooling, and operational readiness.",
    icon: ShieldCheck,
    accent: "from-primary/25 to-transparent",
  },
  {
    id: "operate",
    label: "04 — Operate",
    title: "Continuous monitoring",
    desc: "Ongoing visibility, SOC capabilities, and iterative improvement keep your posture resilient over time.",
    icon: Activity,
    accent: "from-primary/20 to-transparent",
  },
];

const SecurityArchitectureScroll = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  if (reduced) {
    return (
      <section className="section-padding border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Security Architecture
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
              End-to-end protection, designed for how you operate.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {phases.map((phase) => (
              <div key={phase.id} className="glass-card-dark rounded-xl p-8">
                <phase.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">{phase.label}</p>
                <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative border-t border-black/5 bg-white"
      style={{ height: `${phases.length * 100}vh` }}
      aria-label="Security architecture"
    >
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-12 lg:px-24">
          <div className="max-w-lg">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Security Architecture
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl lg:text-5xl">
              End-to-end protection, designed for how you operate.
            </h2>
          </div>

          <div className="relative min-h-[360px] md:min-h-[440px]">
            {phases.map((phase, index) => (
              <ArchitectureVisual
                key={phase.id}
                phase={phase}
                index={index}
                total={phases.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ArchitectureVisual = ({
  phase,
  index,
  total,
  scrollYProgress,
}: {
  phase: (typeof phases)[number];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const mid = start + segment * 0.45;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + segment * 0.12, mid, end - segment * 0.08, end],
    [0, 1, 1, 1, index === total - 1 ? 1 : 0],
  );
  const y = useTransform(scrollYProgress, [start, mid], [24, 0]);

  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className="absolute inset-0 flex items-center"
    >
      <div className="glass-card-dark relative w-full overflow-hidden rounded-2xl p-8 md:p-10">
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${phase.accent} opacity-60`}
          aria-hidden
        />
        <div className="relative">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <phase.icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{phase.label}</p>
          <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">{phase.title}</h3>
          <p className="mt-3 leading-relaxed text-muted-foreground">{phase.desc}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default SecurityArchitectureScroll;
