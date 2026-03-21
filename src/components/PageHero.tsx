"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

export default function PageHero({
  title,
  subtitle,
  children,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`relative min-h-[50vh] flex items-center justify-center bg-linear-to-br from-brand-light/80 via-background to-consciousness/10 ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-cognition/15 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-consciousness/15 rounded-full blur-2xl animate-pulse [animation-delay:1s]" />
        <div className="absolute bottom-10 left-1/4 w-56 h-56 bg-care/15 rounded-full blur-2xl animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
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
