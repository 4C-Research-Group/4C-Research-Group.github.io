"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Soft color-only backdrop for the home hero (no grid, shapes, or motion graphics).
 */
export function HeroGradientBackdrop() {
  const washStyle: CSSProperties = {
    backgroundImage: [
      "radial-gradient(ellipse 100% 85% at 15% 45%, color-mix(in srgb, var(--cognition) 14%, transparent), transparent 58%)",
      "radial-gradient(ellipse 90% 75% at 92% 35%, color-mix(in srgb, var(--consciousness) 12%, transparent), transparent 52%)",
      "radial-gradient(ellipse 80% 55% at 45% 100%, color-mix(in srgb, var(--care) 11%, transparent), transparent 50%)",
    ].join(", "),
  };

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-brand/[0.06] via-transparent to-brand/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.95]"
        style={washStyle}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-transparent via-care/[0.04] to-transparent"
        aria-hidden
      />
    </>
  );
}

type HeroLogoGlowProps = {
  children: ReactNode;
};

/** Soft breathing gradient halo behind the hero logo. */
export function HeroLogoGlow({ children }: HeroLogoGlowProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(120%,28rem)] w-[min(120%,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-brand/25 via-consciousness/20 to-care/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.12, 1],
                opacity: [0.45, 0.62, 0.45],
              }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(72%,17rem)] w-[min(72%,17rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-tr from-care/20 via-transparent to-consciousness/15 blur-2xl"
        animate={
          reduceMotion
            ? undefined
            : {
                scale: [1, 1.18, 1],
                opacity: [0.35, 0.55, 0.35],
              }
        }
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
