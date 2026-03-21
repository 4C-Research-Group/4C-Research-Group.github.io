"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CircleHelp, Search, Target, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";

const missionCards = [
  {
    icon: CircleHelp,
    iconBg: "bg-cognition/15",
    iconClass: "text-cognition w-8 h-8",
    title: "What?",
    description:
      "To improve outcomes for critically ill patients with acute disorders of cognition and consciousness.",
  },
  {
    icon: Search,
    iconBg: "bg-consciousness/15",
    iconClass: "text-consciousness w-8 h-8",
    title: "How?",
    description:
      "Through the development and validation of functional neuroimaging modalities as tools for accurate prediction and timely detection of pathological brain states.",
  },
  {
    icon: Target,
    iconBg: "bg-care/15",
    iconClass: "text-care w-8 h-8",
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
        title="About 4C Research"
        subtitle="Advancing the frontiers of Cognition, Consciousness, and Critical Care through innovative research"
      />

      <div className="container mx-auto px-4 py-16 relative">
        <div
          className="absolute -z-10 top-32 left-0 w-64 h-64 bg-cognition/10 rounded-full blur-2xl"
          aria-hidden
        />
        <div
          className="absolute -z-10 bottom-10 right-0 w-80 h-80 bg-care/10 rounded-full blur-2xl"
          aria-hidden
        />

        <motion.section
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-cognition to-care mx-auto mb-6 rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {missionCards.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-card p-8 rounded-xl shadow-lg border border-border text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-6">
                  <div
                    className={`p-4 ${item.iconBg} rounded-full inline-flex items-center justify-center`}
                  >
                    <item.icon className={item.iconClass} strokeWidth={1.75} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  About Us
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
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
                    Our work is driven by our passion for improving the lives
                    of children and their families. Join us on this journey as
                    we strive to make a difference in the world of pediatric
                    survivors of critical illness. Together, we can create a
                    brighter future for our young patients.
                  </p>
                </div>
                <div className="mt-8">
                  <Link
                    href="/team"
                    className="inline-block bg-brand hover:bg-brand-deep text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Meet Our Team
                  </Link>
                </div>
              </div>

              <div className="md:w-1/2 w-full">
                <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[3/2] bg-muted">
                  <Image
                    src="/images/mission.jpg"
                    alt="Our mission in pediatric research"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="py-16 mb-16 bg-muted/40 rounded-2xl border border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                About the Principal Investigator
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-cognition to-care mx-auto mb-6 rounded-full" />
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Leading the 4C Research Group at Western University and London
                Health Sciences Centre
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <motion.div
                  className="w-full md:w-1/3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl bg-muted">
                    <Image
                      src="/team/team-1.jpg"
                      alt="Dr. Rishi Ganesan, Principal Investigator"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="w-full md:w-2/3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Dr. Rishi Ganesan
                  </h3>
                  <div className="text-muted-foreground mb-4 space-y-4 leading-relaxed">
                    <p>
                      Dr. Rishi Ganesan is a paediatric intensive care
                      physician-researcher with additional expertise in paediatric
                      neurocritical care. He is a physician in the Division of
                      Paediatric Critical Care Medicine at the Children&apos;s
                      Hospital - London Health Sciences Centre, Assistant
                      Professor in the Department of Paediatrics at the Schulich
                      School of Medicine (Western University) and an Associate
                      Scientist at the Lawson Health Research Institute.
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Education &amp; Training
                      </h4>
                      <ul className="text-muted-foreground list-disc pl-5 space-y-1">
                        <li>MD and specialist training in paediatric critical care</li>
                        <li>Advanced expertise in paediatric neurocritical care</li>
                        <li>
                          Faculty, Schulich School of Medicine &amp; Dentistry,
                          Western University
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Research Focus
                      </h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Functional neuroimaging, quantitative EEG, covert
                        consciousness detection, and outcome prediction in
                        critically ill children — translating bedside monitoring
                        into tools that improve survival and long-term function.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-6">
                    <a
                      href="https://www.schulich.uwo.ca/paediatrics/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-brand hover:text-brand-deep font-medium whitespace-nowrap"
                    >
                      View Full Profile
                      <ChevronRight className="h-5 w-5 ml-0.5 shrink-0" />
                    </a>
                    <Link
                      href="/team"
                      className="inline-flex items-center text-brand hover:text-brand-deep font-medium whitespace-nowrap"
                    >
                      View Full Team
                      <ChevronRight className="h-5 w-5 ml-0.5 shrink-0" />
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Research Focus
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-cognition to-care mx-auto mb-6 rounded-full" />
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We integrate clinical paediatric critical care with cutting-edge
                neuroimaging and computational methods to understand and predict
                brain function when it matters most.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Key Areas
                </h3>
                <ul className="space-y-4">
                  {researchKeyAreas.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-cognition shrink-0" />
                      <span className="text-muted-foreground leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Our Approach
                </h3>
                <div className="text-muted-foreground space-y-4 leading-relaxed">
                  <p>
                    We combine prospective clinical studies, multimodal brain
                    monitoring, and rigorous validation so that new measures can
                    move from the lab to the bedside responsibly.
                  </p>
                  <p>
                    Collaboration with families, clinicians, and international
                    partners ensures our science stays grounded in real-world
                    needs — from early detection to long-term outcomes for
                    survivors of critical illness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
