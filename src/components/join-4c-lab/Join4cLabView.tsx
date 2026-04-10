"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Lightbulb, Mail, School, Users } from "lucide-react";
import {
  joinTestimonials,
  type JoinTestimonial,
} from "@/data/join-testimonials";
import type { Join4cLabPagePayload } from "@/data/join-4c-lab-page";
import { fetchJoinPageTestimonialsFromSupabase } from "@/lib/team/supabase-testimonials";

/** Avatar ring color (full class names for Tailwind). */
const TESTIMONIAL_VARIANT = [
  { avatarRing: "ring-2 ring-cognition/25" },
  { avatarRing: "ring-2 ring-care/25" },
  { avatarRing: "ring-2 ring-consciousness/25" },
] as const;

const ZIGZAG_ROW_LEFT = [
  "md:flex-row md:border-l-4 md:border-l-cognition",
  "md:flex-row md:border-l-4 md:border-l-care",
  "md:flex-row md:border-l-4 md:border-l-consciousness",
] as const;
const ZIGZAG_ROW_RIGHT = [
  "md:flex-row-reverse md:border-r-4 md:border-r-cognition",
  "md:flex-row-reverse md:border-r-4 md:border-r-care",
  "md:flex-row-reverse md:border-r-4 md:border-r-consciousness",
] as const;

function interpolateEmail(text: string, email: string): string {
  return text.replace(/\{\{email\}\}/g, email);
}

export default function Join4cLabView({
  content,
}: {
  content: Join4cLabPagePayload;
}) {
  const reduceMotion = useReducedMotion();
  const [fromDb, setFromDb] = useState<JoinTestimonial[]>([]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      const rows = await fetchJoinPageTestimonialsFromSupabase();
      if (!alive) return;
      setFromDb(rows);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const testimonials = useMemo(
    () => [...fromDb, ...joinTestimonials],
    [fromDb],
  );

  const mailtoHref = `mailto:${content.contactEmail.trim()}`;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/30">
        <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:py-24">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Users className="h-4 w-4" />
              {content.heroBadge}
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {content.heroTitle}
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                {content.heroSubtitle}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {content.heroBody}
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <School className="h-4 w-4" />
                {content.heroPill1}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Users className="h-4 w-4" />
                {content.heroPill2}
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Lightbulb className="h-4 w-4" />
                {content.heroPill3}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-brand md:text-xl">
              <Mail className="h-6 w-6 shrink-0" aria-hidden />
              <a
                href={mailtoHref}
                className="break-all transition-colors hover:text-brand-deep"
              >
                {content.contactEmail}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              {content.introTitle}
            </h2>
            <div className="mx-auto h-1.5 w-32 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.15 }}
            className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3"
          >
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cognition/15">
                <School className="h-8 w-8 text-cognition" strokeWidth={1.75} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-foreground">
                {content.card1Title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {content.card1Description}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-consciousness/15">
                <Users
                  className="h-8 w-8 text-consciousness"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-foreground">
                {content.card2Title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {content.card2Description}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-care/15">
                <Lightbulb className="h-8 w-8 text-care" strokeWidth={1.75} />
              </div>
              <h3 className="mb-4 text-xl font-bold text-foreground">
                {content.card3Title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {content.card3Description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.15 }}
            className="mb-16 rounded-2xl border border-border bg-card p-8 shadow-lg"
          >
            <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
              {content.applySectionTitle}
            </h2>
            <div className="mx-auto mt-4 mb-8 h-1.5 w-32 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {content.requiredDocumentsHeading}
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {content.requiredDocuments.map((text, i) => (
                    <li key={`${text}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cognition text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  {content.applicationStepsHeading}
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {content.applicationSteps.map((text, i) => (
                    <li key={`${text}-${i}`} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-consciousness text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span>
                        {interpolateEmail(text, content.contactEmail.trim())}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.1 }}
            className="mb-16"
          >
            <div className="mb-8 text-center md:mb-10">
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">
                {content.testimonialsTitle}
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                {content.testimonialsSubtitle}
              </p>
              <p className="mx-auto mt-2 text-xs text-muted-foreground/80 md:hidden">
                {content.testimonialsMobileHint}
              </p>
            </div>

            {testimonials.length > 0 ? (
              <div
                className="mx-auto flex w-full max-w-5xl flex-row gap-4 overflow-x-auto overflow-y-visible pb-3 pt-1
                  snap-x snap-mandatory scroll-pl-4 [-ms-overflow-style:none] [scrollbar-width:none]
                  md:flex-col md:gap-8 md:overflow-visible md:pb-0 md:pt-0 md:snap-none
                  [&::-webkit-scrollbar]:hidden"
              >
                {testimonials.map((testimonial, ti) => {
                  const variant =
                    TESTIMONIAL_VARIANT[ti % TESTIMONIAL_VARIANT.length]!;
                  const colorIdx = ti % 3;
                  const zigRow =
                    ti % 2 === 0
                      ? ZIGZAG_ROW_LEFT[colorIdx]!
                      : ZIGZAG_ROW_RIGHT[colorIdx]!;
                  return (
                    <motion.article
                      key={testimonial.id}
                      initial={reduceMotion ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: reduceMotion ? 0 : 0.22 }}
                      viewport={{
                        once: true,
                        amount: 0.12,
                        margin: "0px 0px -5% 0px",
                      }}
                      className={[
                        "flex w-[min(88vw,380px)] shrink-0 snap-center flex-col gap-4 rounded-3xl border border-border/60 p-5 shadow-sm",
                        "bg-linear-to-br from-card via-card to-muted/25 bg-card/90",
                        "ring-1 ring-border/40 transition-[box-shadow,border-color] duration-200",
                        "hover:border-border hover:shadow-md hover:shadow-brand/[0.06]",
                        "md:w-full md:max-w-none md:items-center md:gap-8 md:rounded-3xl md:p-7",
                        zigRow,
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3 md:w-36 md:shrink-0 md:flex-col md:items-center md:justify-center md:gap-4">
                        <div
                          className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-inner ring-offset-2 ring-offset-background md:h-24 md:w-24 ${variant.avatarRing}`}
                        >
                          {testimonial.imageSrc ? (
                            <Image
                              src={testimonial.imageSrc}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 56px, 96px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-cognition to-brand-deep">
                              <span className="text-base font-bold text-primary-foreground md:text-lg">
                                {testimonial.name
                                  .split(/\s+/)
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 md:hidden">
                          <p className="font-semibold leading-tight text-foreground">
                            {testimonial.name}
                          </p>
                          <span className="mt-1 inline-block rounded-full bg-brand/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>

                      <blockquote className="min-w-0 flex-1 border-none p-0 md:min-h-0">
                        <p className="text-[0.9375rem] leading-relaxed text-foreground/88 md:text-base md:leading-relaxed">
                          {testimonial.quote}
                        </p>
                        <footer className="mt-4 hidden border-t border-border/50 pt-4 md:block">
                          <cite className="flex flex-wrap items-baseline gap-x-2 not-italic">
                            <span className="text-base font-semibold text-foreground">
                              {testimonial.name}
                            </span>
                            <span
                              aria-hidden
                              className="text-muted-foreground/50"
                            >
                              ·
                            </span>
                            <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                              {testimonial.role}
                            </span>
                          </cite>
                        </footer>
                      </blockquote>
                    </motion.article>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-lg text-muted-foreground">
                  {content.testimonialsEmptyMessage}
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl bg-linear-to-r from-cognition to-consciousness p-8 text-center text-primary-foreground shadow-xl"
          >
            <h2 className="mb-4 text-2xl font-bold">{content.ctaTitle}</h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed opacity-95">
              {content.ctaDescription}
            </p>
            <a
              href={content.ctaButtonLink.trim() || mailtoHref}
              className="inline-flex items-center gap-2 rounded-lg bg-card px-6 py-3 font-semibold text-brand transition-colors hover:bg-brand-light"
            >
              <Mail className="h-4 w-4" />
              {content.ctaButtonText}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
