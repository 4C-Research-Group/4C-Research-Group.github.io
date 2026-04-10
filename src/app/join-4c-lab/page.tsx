"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Mail, Users, Lightbulb, School } from "lucide-react";
import {
  joinTestimonials,
  type JoinTestimonial,
} from "@/data/join-testimonials";
import { fetchJoinPageTestimonialsFromSupabase } from "@/lib/team/supabase-testimonials";

const CONTACT_EMAIL = "rishi.ganesan@lhsc.on.ca";
const MAILTO = `mailto:${CONTACT_EMAIL}`;

/** Avatar ring color (full class names for Tailwind). */
const TESTIMONIAL_VARIANT = [
  { avatarRing: "ring-2 ring-cognition/25" },
  { avatarRing: "ring-2 ring-care/25" },
  { avatarRing: "ring-2 ring-consciousness/25" },
] as const;

/** Zigzag: even = photo left / quote right; odd = quote left / photo right. */
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

const joinContent = {
  hero_title: "Join 4C Research Group",
  hero_description:
    "We are always looking for passionate students to join our team. If you are interested in joining our team, please send your CV to:",
  intro_title:
    "Read more about previous students' experiences with the 4C Research Group below!",
  card1_title: "Research Excellence",
  card1_description:
    "Work on cutting-edge research in cognition, consciousness, and critical care. Gain hands-on experience with state-of-the-art methodologies and technologies.",
  card2_title: "Collaborative Environment",
  card2_description:
    "Join a diverse team of researchers, clinicians, and students. Learn from experts and contribute to meaningful research that makes a difference.",
  card3_title: "Innovation & Growth",
  card3_description:
    "Develop your skills in a supportive environment that encourages innovation and personal growth. Build your research portfolio and network.",
  cta_title: "Ready to Join Our Mission?",
  cta_description:
    "Send your CV today and take the first step towards contributing to groundbreaking research in cognition, consciousness, and critical care.",
  cta_button_text: "Send Your CV",
  cta_button_link: MAILTO,
};

export default function Join4CLabPage() {
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

  const renderHero = () => (
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
            Join Our Team
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Join 4C Research Group
            <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
              We are always looking for passionate students to join our team
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            If you are interested in joining our team, please send your CV to:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm mb-8">
            <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
              <School className="h-4 w-4" />
              Research Excellence
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
              <Users className="h-4 w-4" />
              Collaborative Environment
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
              <Lightbulb className="h-4 w-4" />
              Innovation & Growth
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold text-brand">
            <Mail className="w-6 h-6 shrink-0" aria-hidden />
            <a
              href={MAILTO}
              className="hover:text-brand-deep transition-colors break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderHero()}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {joinContent.intro_title}
            </h2>
            <div className="w-32 h-1.5 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto" />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
              <div className="bg-cognition/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <School className="w-8 h-8 text-cognition" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {joinContent.card1_title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {joinContent.card1_description}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
              <div className="bg-consciousness/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users
                  className="w-8 h-8 text-consciousness"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {joinContent.card2_title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {joinContent.card2_description}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
              <div className="bg-care/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-care" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {joinContent.card3_title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {joinContent.card3_description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.15 }}
            className="bg-card rounded-2xl border border-border shadow-lg p-8 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              How to Apply
            </h2>
            <div className="w-32 h-1.5 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto mt-4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Required Documents
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {[
                    "Updated CV/Resume",
                    "Cover letter explaining your interest",
                    "Academic transcripts (if applicable)",
                    "References (upon request)",
                  ].map((text, i) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="bg-cognition text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Application Steps
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {[
                    `Send your CV to ${CONTACT_EMAIL}`,
                    "Include a brief cover letter in the email",
                    "Wait for our team to review your application",
                    "We'll contact you for an interview if selected",
                  ].map((text, i) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="bg-consciousness text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{text}</span>
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
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Student Testimonials
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto" />
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
                Hear from our previous students about their experiences with the
                4C Research Group
              </p>
              <p className="mx-auto mt-2 text-xs text-muted-foreground/80 md:hidden">
                Swipe sideways to read more
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
                      viewport={{ once: true, amount: 0.12, margin: "0px 0px -5% 0px" }}
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
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No testimonials available at the moment. Check back soon!
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-2xl shadow-xl p-8 text-center text-primary-foreground bg-linear-to-r from-cognition to-consciousness"
          >
            <h2 className="text-2xl font-bold mb-4">{joinContent.cta_title}</h2>
            <p className="text-lg mb-6 opacity-95 max-w-2xl mx-auto leading-relaxed">
              {joinContent.cta_description}
            </p>
            <a
              href={joinContent.cta_button_link}
              className="inline-flex items-center gap-2 bg-card text-brand hover:bg-brand-light font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              {joinContent.cta_button_text}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
