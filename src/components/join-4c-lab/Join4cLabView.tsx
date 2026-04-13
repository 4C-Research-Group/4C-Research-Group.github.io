"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ClipboardList,
  Lightbulb,
  Mail,
  School,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
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

const fadeUp = (reduce: boolean) =>
  reduce
    ? undefined
    : { opacity: 0, y: 16 };
const fadeIn = (reduce: boolean) => (reduce ? false : { opacity: 0 });

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
  const ctaHref = content.ctaButtonLink.trim() || mailtoHref;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-slate-50/95 via-background to-background">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-black/5 mask-[linear-gradient(180deg,white,transparent_80%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 h-[28rem] w-[28rem] rounded-full bg-brand/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-consciousness/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-16">
            <motion.div
              initial={fadeUp(!!reduceMotion)}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center lg:text-left"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {content.heroBadge}
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {content.heroTitle}
                </span>
                <span className="mt-3 block text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:text-[1.65rem]">
                  {content.heroSubtitle}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
                {content.heroBody}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                  <School className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {content.heroPill1}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                  <Users className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {content.heroPill2}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                  <Lightbulb className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  {content.heroPill3}
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={fadeUp(!!reduceMotion)}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
            >
              <div className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/20 via-brand/15 to-care/20 opacity-80 blur-sm" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/85 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-8">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                  <Mail className="h-5 w-5" aria-hidden />
                </div>
                <a
                  href={mailtoHref}
                  className="block break-all text-lg font-semibold text-brand transition-colors hover:text-brand-deep sm:text-xl"
                >
                  {content.contactEmail}
                </a>
                <a
                  href={mailtoHref}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:bg-brand-deep sm:w-auto"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  {content.ctaButtonText}
                  <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent" aria-hidden />
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={fadeIn(!!reduceMotion)}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.introTitle}
            </h2>
            <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {[
              {
                title: content.card1Title,
                description: content.card1Description,
                Icon: School,
                accent:
                  "from-cognition/25 to-cognition/5 border-cognition/20 text-cognition",
                bar: "from-cognition to-cognition/60",
              },
              {
                title: content.card2Title,
                description: content.card2Description,
                Icon: Users,
                accent:
                  "from-consciousness/25 to-consciousness/5 border-consciousness/20 text-consciousness",
                bar: "from-consciousness to-consciousness/60",
              },
              {
                title: content.card3Title,
                description: content.card3Description,
                Icon: Lightbulb,
                accent: "from-care/25 to-care/5 border-care/20 text-care",
                bar: "from-care to-care/60",
              },
            ].map((card, i) => (
              <motion.article
                key={card.title}
                initial={fadeUp(!!reduceMotion)}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.4,
                  delay: reduceMotion ? 0 : i * 0.06,
                }}
                viewport={{ once: true, amount: 0.2 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm ring-1 ring-black/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-brand/25 hover:shadow-lg sm:p-7"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${card.bar}`}
                  aria-hidden
                />
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border bg-linear-to-br ${card.accent}`}
                >
                  <card.Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {card.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section className="border-y border-border/50 bg-muted/25 py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={fadeIn(!!reduceMotion)}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            viewport={{ once: true, amount: 0.15 }}
            className="mb-10 text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.applySectionTitle}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
          </motion.div>

          <motion.div
            initial={fadeUp(!!reduceMotion)}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            viewport={{ once: true, amount: 0.12 }}
            className="overflow-hidden rounded-3xl border border-border/60 bg-card/90 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-2">
              <div className="border-b border-border/60 p-6 sm:p-8 md:border-b-0 md:border-r">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cognition/12 text-cognition">
                    <ClipboardList className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-foreground sm:text-xl">
                    {content.requiredDocumentsHeading}
                  </h3>
                </div>
                <ul className="space-y-0">
                  {content.requiredDocuments.map((text, i) => (
                    <li
                      key={`${text}-${i}`}
                      className="relative flex gap-4 pb-6 last:pb-0"
                    >
                      {i < content.requiredDocuments.length - 1 ? (
                        <div
                          className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cognition to-cognition/80 text-xs font-bold text-primary-foreground shadow-sm">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-sm leading-relaxed text-muted-foreground">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 sm:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-consciousness/12 text-consciousness">
                    <Send className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-foreground sm:text-xl">
                    {content.applicationStepsHeading}
                  </h3>
                </div>
                <ul className="space-y-0">
                  {content.applicationSteps.map((text, i) => (
                    <li
                      key={`${text}-${i}`}
                      className="relative flex gap-4 pb-6 last:pb-0"
                    >
                      {i < content.applicationSteps.length - 1 ? (
                        <div
                          className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                          aria-hidden
                        />
                      ) : null}
                      <span className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-consciousness to-consciousness/80 text-xs font-bold text-primary-foreground shadow-sm">
                        {i + 1}
                      </span>
                      <span className="pt-1 text-sm leading-relaxed text-muted-foreground">
                        {interpolateEmail(text, content.contactEmail.trim())}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={fadeIn(!!reduceMotion)}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.1 }}
            className="mb-10 text-center md:mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {content.testimonialsTitle}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {content.testimonialsSubtitle}
            </p>
            <p className="mx-auto mt-2 text-xs text-muted-foreground/80 md:hidden">
              {content.testimonialsMobileHint}
            </p>
          </motion.div>

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
                    initial={fadeIn(!!reduceMotion)}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.22 }}
                    viewport={{
                      once: true,
                      amount: 0.12,
                      margin: "0px 0px -5% 0px",
                    }}
                    className={[
                      "flex w-[min(88vw,380px)] shrink-0 snap-center flex-col gap-4 rounded-3xl border border-border/50 p-5",
                      "bg-linear-to-br from-card via-card to-muted/30 shadow-md",
                      "ring-1 ring-black/[0.04] transition-[box-shadow,transform,border-color] duration-300",
                      "hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/[0.07]",
                      "md:w-full md:max-w-none md:items-center md:gap-8 md:p-7",
                      zigRow,
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3 md:w-36 md:shrink-0 md:flex-col md:items-center md:justify-center md:gap-4">
                      <div
                        className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border/50 bg-muted shadow-inner ring-offset-2 ring-offset-background md:h-24 md:w-24 ${variant.avatarRing}`}
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
                      <p className="text-[0.9375rem] leading-relaxed text-foreground/90 md:text-base md:leading-relaxed">
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
            <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 py-14 text-center">
              <p className="text-muted-foreground">
                {content.testimonialsEmptyMessage}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={fadeUp(!!reduceMotion)}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            viewport={{ once: true, amount: 0.25 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-linear-to-br from-cognition via-brand to-care px-6 py-12 text-center text-primary-foreground shadow-2xl shadow-brand/25 sm:px-10 sm:py-14"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-care/35 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-consciousness/30 blur-3xl"
              aria-hidden
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {content.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 text-base leading-relaxed text-primary-foreground/90 sm:text-lg">
                {content.ctaDescription}
              </p>
              <a
                href={ctaHref}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-lg transition hover:bg-card/90"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {content.ctaButtonText}
                <ArrowRight className="h-4 w-4 opacity-70" aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
