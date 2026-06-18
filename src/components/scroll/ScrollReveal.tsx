import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { fadeUpTransition, fadeUpVariants, viewportOnce } from "@/lib/motion-presets";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

const ScrollReveal = ({ children, className = "", delay = 0, as = "div" }: Props) => {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUpVariants(reduced)}
      transition={fadeUpTransition(delay, reduced)}
      style={{ willChange: reduced ? undefined : "transform, opacity" }}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
