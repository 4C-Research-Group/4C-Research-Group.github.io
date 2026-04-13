"use client";

import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const SPECKS: { top: string; left: string; delay: string }[] = [
  { top: "4%", left: "10%", delay: "0s" },
  { top: "3%", left: "50%", delay: "0.55s" },
  { top: "4%", left: "88%", delay: "1.05s" },
  { top: "48%", left: "2%", delay: "0.25s" },
  { top: "52%", left: "97%", delay: "0.85s" },
  { top: "93%", left: "12%", delay: "0.12s" },
  { top: "95%", left: "48%", delay: "0.7s" },
  { top: "93%", left: "86%", delay: "1.2s" },
  { top: "22%", left: "4%", delay: "0.95s" },
  { top: "78%", left: "96%", delay: "0.38s" },
];

/**
 * Frosted glass panel with animated iridescent border and twinkling edge specks.
 * Honors prefers-reduced-motion (static border, no twinkle animation).
 */
export function HeroGlassGlitterFrame({ children }: Props) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`hero-glass-frame relative flex w-full min-w-0 flex-col items-center px-3 py-4 sm:px-5 sm:py-5 ${reduced ? "" : "hero-glass-frame-motion"}`}
    >
      <div className="relative z-[1] flex w-full flex-col items-center">
        {children}
      </div>
      {!reduced ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
          aria-hidden
        >
          {SPECKS.map((s, i) => (
            <span
              key={`${s.top}-${s.left}-${i}`}
              className="hero-glitter-speck absolute h-1 w-1 rounded-full bg-white shadow-[0_0_4px_1px_rgba(255,255,255,0.95),0_0_14px_2px_rgba(56,189,248,0.5)]"
              style={{
                top: s.top,
                left: s.left,
                animationDelay: s.delay,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
