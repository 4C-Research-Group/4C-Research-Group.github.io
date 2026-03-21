"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Mail, Sparkles } from "lucide-react";
import PageHero from "@/components/PageHero";

const CARD_ACCENTS = [
  "from-cognition via-brand to-consciousness",
  "from-consciousness via-care to-cognition",
  "from-care via-cognition to-brand",
] as const;

function TeamPhoto({
  src,
  alt,
  initials,
  className,
  initialsClassName,
}: {
  src: string;
  alt: string;
  initials: string;
  className?: string;
  initialsClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand/15 via-consciousness/10 to-care/15 ${className ?? ""}`}
        aria-hidden
      >
        <span
          className={
            initialsClassName ??
            "text-3xl font-bold tracking-tight text-brand sm:text-4xl"
          }
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title="Meet Our Team"
        subtitle="Dedicated researchers and healthcare professionals advancing pediatric critical care"
      />

      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-24 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-40 right-0 h-96 w-96 rounded-full bg-consciousness/10 blur-3xl"
          aria-hidden
        />

        <section className="relative px-4 py-12 sm:px-6 sm:py-16">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mb-4 text-center"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Leadership
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Principal Investigator
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Leading our research initiatives
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xl shadow-brand/5"
            >
              <div className="grid md:grid-cols-12">
                <div className="relative aspect-[4/5] md:col-span-5 md:min-h-[380px]">
                  <TeamPhoto
                    src="/team/team-1.jpg"
                    alt="Dr. Rishi Ganesan"
                    initials="RG"
                    className="object-cover"
                    initialsClassName="text-5xl font-bold tracking-tight text-brand md:text-6xl"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card to-transparent md:hidden"
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:col-span-7 md:p-10 lg:p-12">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Dr. Rishi Ganesan
                  </h3>
                  <p className="mt-2 text-sm font-medium text-brand">
                    Head of the 4C Research Group
                  </p>
                  <p className="mt-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Dr. Rishi Ganesan is a paediatric intensive care
                    physician-researcher with additional expertise in paediatric
                    neurocritical care. He is a physician in the Division of
                    Paediatric Critical Care Medicine at the Children&apos;s
                    Hospital - London Health Sciences Centre, Assistant
                    Professor in the Department of Paediatrics at the Schulich
                    School of Medicine (Western University) and an Associate
                    Scientist at the Lawson Health Research Institute.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="mailto:rishi.ganesan@lhsc.on.ca"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-brand" />
                      Email
                    </a>
                    <a
                      href="https://www.linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                    >
                      <Linkedin className="h-4 w-4 shrink-0 text-brand" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative border-t border-border/60 bg-linear-to-b from-muted/30 to-background px-4 py-14 sm:px-6 sm:py-20">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                People
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Our Team Members
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
              <p className="mt-4 text-muted-foreground">
                Students, coordinators, and research staff driving our projects
                forward
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {teamMembers.map((member, index) => (
                <motion.article
                  key={member.slug}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.04, 0.2),
                  }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-lg hover:shadow-brand/5"
                >
                  <div
                    className={`h-1 bg-linear-to-r ${CARD_ACCENTS[index % 3]}`}
                    aria-hidden
                  />
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <TeamPhoto
                      src={`/team/${member.photoFile}`}
                      alt={member.name}
                      initials={member.initials}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-card/95 via-card/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
                      aria-hidden
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-12">
                      <h3 className="text-lg font-bold tracking-tight text-foreground drop-shadow-sm">
                        {member.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 pt-4">
                    <div className="flex items-start gap-2 rounded-2xl border border-border/60 bg-muted/40 p-4">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-care" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Superpower
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                          {member.superpower}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const teamMembers = [
  {
    slug: "team-2",
    photoFile: "team-2.jpg",
    name: "Maysaa Assaf",
    initials: "MA",
    role: "Clinical Research Coordinator",
    superpower: "My smile!",
  },
  {
    slug: "team-3",
    photoFile: "team-3.jpg",
    name: "Karen Wong",
    initials: "KW",
    role: "PhD Student",
    superpower: "I play on the Women's Football team at Western!",
  },
  {
    slug: "team-4",
    photoFile: "team-4.jpg",
    name: "Brian Krivoruk",
    initials: "BK",
    role: "MSc Student",
    superpower: "Making music and DJing as a side job!",
  },
  {
    slug: "team-5",
    photoFile: "team-5.jpg",
    name: "Hiruthika Ravi",
    initials: "HR",
    role: "MSc Student",
    superpower: "Intense puzzler (2000+ pieces especially!)",
  },
  {
    slug: "team-6",
    photoFile: "team-6.jpg",
    name: "Srinidhi Srinivasan",
    initials: "SS",
    role: "Research Assistant",
    superpower: "I am a long-distance runner!",
  },
  {
    slug: "team-7",
    photoFile: "team-7.jpg",
    name: "Kyle Sun",
    initials: "KS",
    role: "MSc Student",
    superpower: "Still searching for my superpower... check back later!",
  },
  {
    slug: "team-8",
    photoFile: "team-8.jpg",
    name: "Tallulah Nyland",
    initials: "TN",
    role: "MSc Student",
    superpower: "Still searching for my superpower... check back later!",
  },
  {
    slug: "team-9",
    photoFile: "team-9.jpg",
    name: "Daniela Carvalho",
    initials: "DC",
    role: "Research Assistant",
    superpower: "Major bookworm! (Guess my favourite genre)",
  },
  {
    slug: "team-10",
    photoFile: "team-10.jpg",
    name: "Sukhnoor Riar",
    initials: "SR",
    role: "BSc Student in Biology and Medical Science",
    superpower: "Quoting Bollywood songs and movies!",
  },
  {
    slug: "team-11",
    photoFile: "team-11.jpg",
    name: "Sara Gehlaut",
    initials: "SG",
    role: "BHSc student in Health Sciences and Biology",
    superpower: "Bollywood trivia!",
  },
];
