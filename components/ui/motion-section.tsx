"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HTMLMotionProps } from "motion/react";

type MotionSectionProps = HTMLMotionProps<"section"> & {
  delay?: number;
};

export function MotionSection({
  children,
  className,
  delay = 0,
  ...props
}: MotionSectionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
