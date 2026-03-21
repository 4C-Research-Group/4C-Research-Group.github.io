"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  CircleHelp,
  Search,
  Target,
  ChevronRight,
  Check,
  ArrowRight,
} from "lucide-react";
import PageHero from "@/components/PageHero";

const CARD_ACCENTS = [
  "from-cognition via-brand to-consciousness",
  "from-consciousness via-care to-cognition",
  "from-care via-cognition to-brand",
] as const;

const missionCards = [
  {
    icon: CircleHelp,
    iconBg: "bg-cognition/15",
    iconClass: "text-cognition h-8 w-8",
    title: "What?",
    description:
      "To improve outcomes for critically ill patients with acute disorders of cognition and consciousness.",
  },
  {
    icon: Search,
    iconBg: "bg-consciousness/15",
    iconClass: "text-consciousness h-8 w-8",
    title: "How?",
    description:
      "Through the development and validation of functional neuroimaging modalities as tools for accurate prediction and timely detection of pathological brain states.",
  },
  {
    icon: Target,
    iconBg: "bg-care/15",
    iconClass: "text-care h-8 w-8",
    title: "Why?",
    description:
      "The long-term consequences of brain injury acquired prior to or during critical illness are debilitating. Our work will improve survival and mitigate morbidity associated with brain injury.",
  },
];

const researchKeyAreas = [
  "Covert consciousness and disorders of consciousness in critically ill children",
  "Functional neuroimaging (fNIRS, EEG, fMRI) in the PICU",
  "Neuroprognostication and outcome prediction after brain injury",
  "Machine learning and quantitative signal analysis for brain monitoring",
  "Knowledge mobilization and family-centred communication in neurocritical care",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title="About 4C Research"
        subtitle="Advancing the frontiers of Cognition, Consciousness, and Critical Care through innovative research"
      />

      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-20 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-care/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-40 left-1/3 h-64 w-64 rounded-full bg-consciousness/10 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <motion.section
            className="pt-4 sm:pt-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Mission
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Mission
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            </div>
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {missionCards.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.15),
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5"
                >
                  <div
                    className={`h-1.5 bg-linear-to-r ${CARD_ACCENTS[index % 3]}`}
                    aria-hidden
                  />
                  <div className="px-8 pb-8 pt-8">
                    <div className="flex justify-center">
                      <div
                        className={`inline-flex rounded-2xl p-4 ${item.iconBg} transition-transform duration-300 group-hover:scale-105`}
                      >
                        <item.icon
                          className={item.iconClass}
                          strokeWidth={1.75}
                        />
                      </div>
                    </div>
                    <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="py-16 sm:py-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="order-2 lg:order-1">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Who we are
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  About Us
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Our dedicated research group focuses on uncovering
                    groundbreaking discoveries in altered cognition and
                    consciousness in critically ill children.
                  </p>
                  <p>
                    By understanding the complex neurophysiology underlying
                    these pathological brain states, we can develop tools to
                    predict and detect such neurological problems in a timely
                    manner. Accurate prediction and/or early detection of such
                    conditions would positively impact the long-term functional
                    outcomes of these children.
                  </p>
                  <p>
                    Our work is driven by our passion for improving the lives of
                    children and their families. Join us on this journey as we
                    strive to make a difference in the world of pediatric
                    survivors of critical illness. Together, we can create a
                    brighter future for our young patients.
                  </p>
                </div>
                <Link
                  href="/team"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                >
                  Meet Our Team
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/80 bg-muted shadow-xl shadow-brand/5 ring-1 ring-border/40">
                  <Image
                    src="/images/mission.jpg"
                    alt="Our mission in pediatric research"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <section className="rounded-3xl border border-border/80 bg-linear-to-br from-muted/40 via-card to-background p-6 shadow-lg shadow-brand/5 sm:p-10 md:p-12">
            <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Leadership
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Principal Investigator
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="mt-4 text-muted-foreground">
                Leading the 4C Research Group at Western University and London
                Health Sciences Centre
              </p>
            </div>

            <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-md">
              <div className="grid md:grid-cols-12">
                <motion.div
                  className="relative aspect-[4/5] md:col-span-5 md:min-h-[360px]"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                >
                  <Image
                    src="/team/team-1.jpg"
                    alt="Dr. Rishi Ganesan, Principal Investigator"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </motion.div>
                <motion.div
                  className="flex flex-col justify-center p-8 md:col-span-7 md:p-10 lg:p-12"
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                >
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Dr. Rishi Ganesan
                  </h3>
                  <p className="mt-2 text-sm font-medium text-brand">
                    Head of the 4C Research Group
                  </p>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Dr. Rishi Ganesan is a paediatric intensive care
                    physician-researcher with additional expertise in paediatric
                    neurocritical care. He is a physician in the Division of
                    Paediatric Critical Care Medicine at the Children&apos;s
                    Hospital - London Health Sciences Centre, Assistant
                    Professor in the Department of Paediatrics at the Schulich
                    School of Medicine (Western University) and an Associate
                    Scientist at the Lawson Health Research Institute.
                  </p>
                  <div className="mt-6 space-y-4 border-t border-border pt-6">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Education &amp; Training
                      </h4>
                      <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                        <li>MD and specialist training in paediatric critical care</li>
                        <li>Advanced expertise in paediatric neurocritical care</li>
                        <li>
                          Faculty, Schulich School of Medicine &amp; Dentistry,
                          Western University
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                        Research Focus
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Functional neuroimaging, quantitative EEG, covert
                        consciousness detection, and outcome prediction in
                        critically ill children — translating bedside monitoring
                        into tools that improve survival and long-term function.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://www.schulich.uwo.ca/paediatrics/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    >
                      View Full Profile
                      <ChevronRight className="h-4 w-4" />
                    </a>
                    <Link
                      href="/team"
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    >
                      View Full Team
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <motion.section
            className="py-16 sm:py-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-lg shadow-brand/5 sm:p-10 md:p-12">
              <div className="mx-auto mb-10 max-w-3xl text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Focus
                </span>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Research Focus
                </h2>
                <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  We integrate clinical paediatric critical care with
                  cutting-edge neuroimaging and computational methods to
                  understand and predict brain function when it matters most.
                </p>
              </div>

              <div className="grid gap-10 md:grid-cols-2 md:gap-12">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    Key Areas
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {researchKeyAreas.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:border-brand/20"
                      >
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cognition/15 text-cognition">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    Our Approach
                  </h3>
                  <div className="mt-5 space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    <p>
                      We combine prospective clinical studies, multimodal brain
                      monitoring, and rigorous validation so that new measures
                      can move from the lab to the bedside responsibly.
                    </p>
                    <p>
                      Collaboration with families, clinicians, and
                      international partners ensures our science stays grounded in
                      real-world needs — from early detection to long-term
                      outcomes for survivors of critical illness.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
