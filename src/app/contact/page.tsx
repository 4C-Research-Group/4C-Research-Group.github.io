"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { contactPageContent } from "@/data/contact-page";

export default function ContactPage() {
  const contact = contactPageContent;
  const reduceMotion = useReducedMotion();
  const spring = [0.22, 1, 0.36, 1] as const;
  const fadeUp = reduceMotion ? undefined : { opacity: 0, y: 16 };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border/40 bg-linear-to-b from-slate-50/95 via-background to-background">
        <div
          className="pointer-events-none absolute inset-0 bg-grid-black/5 mask-[linear-gradient(180deg,white,transparent_80%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 h-[26rem] w-[26rem] rounded-full bg-brand/12 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(280px,400px)] lg:gap-14">
            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.5,
                ease: spring,
              }}
              className="text-center lg:text-left"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <MessageCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Contact
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                  {contact.hero_title}
                </span>
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-2xl font-semibold leading-snug tracking-tight text-muted-foreground sm:text-3xl lg:mx-0 lg:text-[1.65rem]">
                {contact.hero_description}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-cognition/20 bg-cognition/5 px-3 py-2 text-xs font-medium text-cognition sm:text-sm">
                  <Mail className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Email the lab
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-consciousness/20 bg-consciousness/5 px-3 py-2 text-xs font-medium text-consciousness sm:text-sm">
                  <MapPin className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  London, ON
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-care/20 bg-care/5 px-3 py-2 text-xs font-medium text-care sm:text-sm">
                  <User className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Coordinator listed below
                </span>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-brand-deep"
                >
                  Send an email
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </a>
                <Link
                  href="/collaborate/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:bg-muted/40"
                >
                  Collaborate
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.55,
                delay: reduceMotion ? 0 : 0.06,
                ease: spring,
              }}
              className="relative mx-auto w-full max-w-md lg:mx-0"
            >
              <div
                className="absolute -inset-1 rounded-[1.35rem] bg-linear-to-br from-cognition/15 via-brand/12 to-care/15 opacity-90 blur-sm"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-6 shadow-lg ring-1 ring-black/[0.04] backdrop-blur-md sm:p-7">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/12 text-brand">
                  <Mail className="h-5 w-5" aria-hidden />
                </div>
                <p className="text-sm font-semibold tracking-tight text-foreground">
                  Quick contacts
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="block rounded-2xl border border-border/50 bg-muted/20 px-3 py-3 font-medium text-brand transition hover:border-brand/25 hover:bg-brand/5"
                    >
                      {contact.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+15196858500"
                      className="block rounded-2xl border border-border/50 bg-muted/20 px-3 py-3 text-foreground transition hover:border-brand/25 hover:bg-muted/30"
                    >
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Phone
                      </span>
                      <span className="mt-0.5 block font-medium tabular-nums">
                        {contact.phone}
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact-map"
                      className="block rounded-2xl border border-border/50 bg-muted/20 px-3 py-3 text-foreground transition hover:border-brand/25 hover:bg-muted/30"
                    >
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Map
                      </span>
                      <span className="mt-0.5 block leading-snug text-muted-foreground">
                        Victoria & Children&apos;s Hospital
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-[max(0px,calc(50%-40rem))] top-24 h-72 w-72 rounded-full bg-cognition/6 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[max(0px,calc(50%-38rem))] top-40 h-64 w-64 rounded-full bg-brand/6 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.div
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.04,
                ease: spring,
              }}
              className="space-y-8 lg:col-span-5"
            >
              <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-7">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Email
                </h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-3 block text-lg font-semibold text-brand underline-offset-4 transition hover:underline"
                >
                  {contact.email}
                </a>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  For questions about our research, partnerships, or the lab.
                </p>
              </div>

              <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-7">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Lab details
                </h2>
                <ul className="mt-5 space-y-5 text-sm">
                  <li className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cognition/10 text-cognition ring-1 ring-cognition/15">
                      <MapPin className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">Address</p>
                      <p className="mt-1 leading-relaxed text-muted-foreground">
                        {contact.address}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                      <Phone className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a
                        href="tel:+15196858500"
                        className="mt-1 block text-muted-foreground transition-colors hover:text-brand"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-consciousness/10 text-consciousness ring-1 ring-consciousness/15">
                      <Clock className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Hours</p>
                      <p className="mt-1 text-muted-foreground">
                        {contact.hours}
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-care/10 text-care ring-1 ring-care/15">
                      <User className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Research coordinator
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        {contact.research_coordinator_name}
                      </p>
                      <a
                        href={`mailto:${contact.research_coordinator_email}`}
                        className="mt-1 inline-block font-medium text-brand underline-offset-4 hover:underline"
                      >
                        {contact.research_coordinator_email}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-dashed border-border/70 bg-muted/15 px-5 py-5 text-sm text-muted-foreground sm:px-6">
                <span className="font-medium text-foreground">Students:</span>{" "}
                Interested in joining the team?{" "}
                <Link
                  href="/join-4c-lab/"
                  className="font-semibold text-brand underline-offset-4 hover:underline"
                >
                  Join 4C Lab
                </Link>
                .
              </div>
            </motion.div>

            <motion.div
              id="contact-map"
              initial={fadeUp}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.08,
                ease: spring,
              }}
              className="lg:col-span-7"
            >
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Map
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Victoria Hospital &amp; Children&apos;s Hospital, London
              </p>
              <div className="mt-4 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-md ring-1 ring-black/[0.04]">
                <iframe
                  src={contact.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Victoria Hospital & Children's Hospital"
                  className="aspect-[4/3] min-h-[260px] w-full sm:min-h-[320px] lg:aspect-auto lg:min-h-[420px]"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/NHAV4ZiR9p3aeGGW6"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl text-sm font-semibold text-brand underline-offset-4 transition hover:underline"
              >
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
