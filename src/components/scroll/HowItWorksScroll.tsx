import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type HowItWorksStep = {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
};

type Props = {
  steps: HowItWorksStep[];
};

const HowItWorksScroll = ({ steps }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative border-t border-white/5"
      style={{ height: reduced ? "auto" : `${steps.length * 100}vh` }}
      aria-label="How ClickBox works"
    >
      {reduced ? (
        <div className="section-padding">
          <div className="mx-auto max-w-3xl space-y-10">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                How It Works
              </p>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                A clear path from assessment to ongoing protection.
              </h2>
            </div>
            {steps.map((step) => (
              <div key={step.n} className="glass-card rounded-xl p-8">
                <step.icon className="mb-4 h-8 w-8 text-primary" strokeWidth={1.5} />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                  Step {step.n}
                </span>
                <h3 className="mt-2 font-heading text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-12 lg:px-24">
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                How It Works
              </p>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                How ClickBox strengthens your security posture.
              </h2>
            </div>

            <div className="relative flex min-h-[320px] items-center md:min-h-[420px]">
              {steps.map((step, index) => (
                <StepPanel
                  key={step.n}
                  step={step}
                  index={index}
                  total={steps.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const StepPanel = ({
  step,
  index,
  total,
  scrollYProgress,
}: {
  step: HowItWorksStep;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) => {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const mid = start + segment * 0.5;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + segment * 0.15, mid, end - segment * 0.1, end],
    [0, 1, 1, 1, index === total - 1 ? 1 : 0],
  );
  const y = useTransform(scrollYProgress, [start, mid], [32, 0]);
  const scale = useTransform(scrollYProgress, [start, mid], [0.97, 1]);

  return (
    <motion.article
      style={{
        opacity,
        y,
        scale,
        willChange: "transform, opacity",
      }}
      className="absolute inset-0 flex items-center"
    >
      <div className="glass-card w-full rounded-2xl p-8 md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <step.icon className="h-9 w-9 text-primary" strokeWidth={1.5} />
          <span className="font-heading text-4xl font-bold text-primary/20">{step.n}</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Step {step.n}</p>
        <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">{step.title}</h3>
        <p className="mt-4 leading-relaxed text-muted-foreground">{step.desc}</p>
      </div>
    </motion.article>
  );
};

export default HowItWorksScroll;
