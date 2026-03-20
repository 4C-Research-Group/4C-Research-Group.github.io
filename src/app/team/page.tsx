"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Linkedin, Users } from "lucide-react";

function TeamPhoto({
  src,
  alt,
  initials,
  className,
}: {
  src: string;
  alt: string;
  initials: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-brand/20 to-consciousness/20 text-brand font-semibold tracking-tight ${className ?? ""}`}
        aria-hidden
      >
        {initials}
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-brand-light">
      <section className="relative overflow-hidden bg-linear-to-br from-brand via-cognition to-consciousness text-primary-foreground py-20 md:py-24">
        <div className="absolute inset-0 bg-black/15" aria-hidden />
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm mb-6">
              <Users className="w-7 h-7" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet Our Team
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              Dedicated researchers and healthcare professionals working
              together to advance pediatric critical care
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-brand mb-2">
              Principal Investigator
            </p>
            <p className="text-center text-muted-foreground mb-10">
              Leading our research initiatives
            </p>

            <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-[280px_1fr] gap-0">
                <div className="relative aspect-square md:aspect-auto md:min-h-[320px] bg-muted">
                  <TeamPhoto
                    src="/team/team-1.jpg"
                    alt="Dr. Rishi Ganesan"
                    initials="RG"
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    Dr. Rishi Ganesan
                  </h2>
                  <p className="text-brand font-medium mb-6">
                    Head of the 4C Research Group
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    Dr. Rishi Ganesan is a paediatric intensive care
                    physician-researcher with additional expertise in paediatric
                    neurocritical care. He is a physician in the Division of
                    Paediatric Critical Care Medicine at the Children&apos;s
                    Hospital - London Health Sciences Centre, Assistant
                    Professor in the Department of Paediatrics at the Schulich
                    School of Medicine (Western University) and an Associate
                    Scientist at the Lawson Health Research Institute.
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Get in Touch
                    </p>
                    <ul className="space-y-3">
                      <li>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">
                          Email
                        </span>
                        <a
                          href="mailto:rishi.ganesan@lhsc.on.ca"
                          className="inline-flex items-center gap-2 text-brand hover:text-brand-deep font-medium"
                        >
                          <Mail className="w-4 h-4 shrink-0" />
                          rishi.ganesan@lhsc.on.ca
                        </a>
                      </li>
                      <li>
                        <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">
                          LinkedIn
                        </span>
                        <a
                          href="https://www.linkedin.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-brand hover:text-brand-deep font-medium"
                        >
                          <Linkedin className="w-4 h-4 shrink-0" />
                          Connect on LinkedIn
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Team Members
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Students, coordinators, and research staff driving our projects
              forward
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.article
                key={member.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group rounded-2xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                  <TeamPhoto
                    src={`/team/${member.photoFile}`}
                    alt={member.name}
                    initials={member.initials}
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-brand font-medium mb-4">
                    {member.role}
                  </p>
                  <div className="rounded-xl bg-muted/80 px-4 py-3 border border-border/60">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                      Superpower
                    </p>
                    <p className="text-sm text-foreground leading-snug">
                      {member.superpower}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
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
