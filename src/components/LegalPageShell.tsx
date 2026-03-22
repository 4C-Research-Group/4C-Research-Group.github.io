"use client";

import type { ReactNode } from "react";
import PageHero from "@/components/PageHero";

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="border-b border-border pb-2 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-brand [&_a]:underline [&_a:hover]:text-brand-deep">
        {children}
      </div>
    </section>
  );
}

export default function LegalPageShell({
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PageHero compact title={title} subtitle={subtitle} />
      <div className="relative border-t border-border/60 bg-linear-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          {lastUpdated ? (
            <p className="mb-10 text-xs text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          ) : null}
          <article className="space-y-10">{children}</article>
        </div>
      </div>
    </div>
  );
}
