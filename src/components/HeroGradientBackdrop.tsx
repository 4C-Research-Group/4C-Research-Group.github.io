"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative gradient mesh for the home hero: floating color orbs, rotating conic wash,
 * and soft diagonal sheen. All pointer-events-none; motion is gated via `prefers-reduced-motion` in CSS.
 */
export function HeroGradientBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-tr from-brand/[0.04] via-transparent to-brand/[0.06]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-black/[0.04] mask-[linear-gradient(to_bottom,white_0%,white_55%,transparent_100%)]"
        aria-hidden
      />

      {/* Floating orbs — brand / consciousness / care */}
      <div
        className="hero-orb hero-orb-a pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-brand/12 blur-3xl"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb-b pointer-events-none absolute -right-28 bottom-0 h-[380px] w-[380px] rounded-full bg-consciousness/12 blur-3xl"
        aria-hidden
      />
      <div
        className="hero-orb hero-orb-c pointer-events-none absolute left-1/2 top-0 h-56 w-[min(85%,44rem)] rounded-full bg-care/10 blur-3xl"
        aria-hidden
      />

      {/* Extra depth: smaller accent blob */}
      <div
        className="hero-orb hero-orb-d pointer-events-none absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-cognition/8 blur-3xl"
        aria-hidden
      />

      {/* Slow rotating conic wash (right side, behind column content) */}
      <div
        className="pointer-events-none absolute right-[-18%] top-[22%] h-[min(92vw,680px)] w-[min(92vw,680px)] -translate-y-1/2"
        aria-hidden
      >
        <div className="hero-conic-layer hero-conic-spin h-full w-full rounded-full opacity-40 mix-blend-multiply blur-2xl" />
      </div>

      {/* Moving diagonal sheen */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] hero-sheen"
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
