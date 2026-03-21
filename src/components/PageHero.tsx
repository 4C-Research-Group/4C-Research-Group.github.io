"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  /** Shorter hero (no half-viewport min-height) — good for content-heavy pages */
  compact?: boolean;
}

export default function PageHero({
  title,
  subtitle,
  children,
  className = "",
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`relative flex items-center justify-center bg-linear-to-br from-brand-light/80 via-background to-consciousness/10 ${
        compact ? "py-8 md:py-10" : "min-h-[50vh]"
      } ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute bg-cognition/15 rounded-full blur-2xl animate-pulse ${
            compact
              ? "top-4 left-4 w-32 h-32 opacity-70"
              : "top-10 left-10 w-48 h-48"
          }`}
        />
        <div
          className={`absolute bg-consciousness/15 rounded-full blur-2xl animate-pulse [animation-delay:1s] ${
            compact
              ? "top-8 right-8 w-40 h-40 opacity-70"
              : "top-20 right-20 w-64 h-64"
          }`}
        />
        <div
          className={`absolute bg-care/15 rounded-full blur-2xl animate-pulse [animation-delay:2s] ${
            compact
              ? "bottom-4 left-1/3 w-36 h-36 opacity-70"
              : "bottom-10 left-1/4 w-56 h-56"
          }`}
        />
      </div>

      <div
        className={`relative z-20 container mx-auto px-4 ${
          compact ? "py-0" : "py-12 md:py-16"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: compact ? 12 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: compact ? 0.35 : 0.6 }}
          >
            <h1
              className={`font-bold leading-tight ${
                compact
                  ? "text-3xl md:text-4xl mb-2"
                  : "text-4xl md:text-5xl mb-4"
              }`}
            >
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p
                className={`text-muted-foreground leading-relaxed max-w-2xl mx-auto ${
                  compact
                    ? "text-base md:text-lg mb-4"
                    : "text-lg md:text-xl mb-6"
                }`}
              >
                {subtitle}
              </p>
            )}
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
