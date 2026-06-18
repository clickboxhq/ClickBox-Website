import type { Transition, Variants } from "framer-motion";

export const EASE_OUT: Transition["ease"] = [0.25, 0.1, 0.25, 1];

export const viewportOnce = {
  once: true,
  margin: "-80px" as const,
};

export const fadeUpVariants = (reduced: boolean): Variants => ({
  hidden: reduced ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
});

export const fadeUpTransition = (delay = 0, reduced = false): Transition => ({
  duration: reduced ? 0 : 0.55,
  delay: reduced ? 0 : delay,
  ease: EASE_OUT,
});

export const staggerContainer = (reduced: boolean): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: reduced ? 0 : 0.08,
      delayChildren: reduced ? 0 : 0.05,
    },
  },
});
