import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type TimelineMilestone = {
  year: string;
  title: string;
  desc: string;
};

type Props = {
  milestones: TimelineMilestone[];
};

const EngagementTimeline = ({ milestones }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="section-padding border-t border-white/5">
      <div className="mx-auto max-w-4xl">
        <ScrollHeader />

        <div className="relative mt-14">
          <div
            className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10 md:left-1/2 md:-translate-x-px"
            aria-hidden
          />
          {!reduced && (
            <motion.div
              style={{ scaleY: lineScale, transformOrigin: "top" }}
              className="absolute bottom-0 left-[11px] top-0 w-px bg-primary md:left-1/2 md:-translate-x-px"
              aria-hidden
            />
          )}
          {reduced && (
            <div
              className="absolute bottom-0 left-[11px] top-0 w-px bg-primary md:left-1/2 md:-translate-x-px"
              aria-hidden
            />
          )}

          <ol className="space-y-12">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.year + milestone.title}
                milestone={milestone}
                index={index}
                total={milestones.length}
                scrollYProgress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

const ScrollHeader = () => (
  <div className="max-w-2xl">
    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Engagement Journey</p>
    <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
      From first conversation to long-term partnership.
    </h2>
  </div>
);

const TimelineItem = ({
  milestone,
  index,
  total,
  scrollYProgress,
  reduced,
}: {
  milestone: TimelineMilestone;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduced: boolean;
}) => {
  const threshold = (index + 0.5) / total;
  const opacity = useTransform(scrollYProgress, [threshold - 0.05, threshold + 0.12], [0.35, 1]);
  const x = useTransform(scrollYProgress, [threshold - 0.05, threshold + 0.12], [reduced ? 0 : 12, 0]);

  const isEven = index % 2 === 0;

  return (
    <motion.li
      style={reduced ? undefined : { opacity, x, willChange: "transform, opacity" }}
      className={`relative grid gap-4 pl-10 md:grid-cols-2 md:gap-8 md:pl-0 ${
        isEven ? "" : "md:[&>div:first-child]:order-2"
      }`}
    >
      <span
        className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-primary/40 bg-background md:left-1/2 md:-translate-x-1/2"
        aria-hidden
      >
        <span className="h-2 w-2 rounded-full bg-primary" />
      </span>

      <div className={`md:text-right ${isEven ? "md:pr-10" : "md:pl-10 md:text-left"}`}>
        <p className="text-sm font-semibold text-primary">{milestone.year}</p>
        <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">{milestone.title}</h3>
      </div>

      <div className={`${isEven ? "md:pl-10" : "md:pr-10 md:text-right"}`}>
        <p className="text-sm leading-relaxed text-muted-foreground">{milestone.desc}</p>
      </div>
    </motion.li>
  );
};

export default EngagementTimeline;
