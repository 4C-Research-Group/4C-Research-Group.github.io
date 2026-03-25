"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Brain,
  Activity,
  Eye,
  Users,
  ExternalLink,
  Users2,
  BookOpen,
  Grid3X3,
  Beaker,
  Microscope,
  Zap,
  ChevronDown,
  ChevronRight,
  Building,
  Calendar,
  Link2,
} from "lucide-react";

export default function Research() {
  const [expandedTheme, setExpandedTheme] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/30">
        <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
        <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Beaker className="h-4 w-4" />
              Research Excellence
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Our Research
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                Advancing Critical Care Neuroscience
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Exploring the frontiers of neuroprognostication and brain
              monitoring through innovative research, advanced neuroimaging, and
              collaborative discovery.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <Brain className="h-4 w-4" />
                Neuroprognostication
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Microscope className="h-4 w-4" />
                Neuroimaging
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Zap className="h-4 w-4" />
                Critical Care
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Themes - Accordion Style */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Key Research Themes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Click on each theme to explore our detailed research projects and
              findings.
            </p>
          </motion.div>

          <div className="mx-auto max-w-5xl space-y-6">
            {researchThemes.map((theme, themeIndex) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: themeIndex * 0.1,
                }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg">
                  {/* Theme Header - Clickable */}
                  <button
                    onClick={() =>
                      setExpandedTheme(
                        expandedTheme === theme.title ? null : theme.title,
                      )
                    }
                    className="w-full px-6 py-5 text-left transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl"
                          style={{
                            background: theme.gradient.replace(
                              "135deg",
                              "to bottom right",
                            ),
                          }}
                        >
                          <theme.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground">
                            {theme.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-foreground">
                            {theme.projects.length} Projects
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {theme.projects.filter((p) => p.funder).length}{" "}
                            Funded
                          </div>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:scale-110">
                          {expandedTheme === theme.title ? (
                            <ChevronDown className="h-4 w-4 text-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedTheme === theme.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border bg-muted/20"
                    >
                      <div className="p-6">
                        <div className="mb-6">
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {theme.description}
                          </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-2">
                          {theme.projects.map((project, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border bg-background p-5"
                            >
                              <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                                <h4 className="text-lg font-bold text-foreground">
                                  {project.title}
                                </h4>
                                {project.funder && (
                                  <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                                    <Building className="mr-1 h-3 w-3 inline" />
                                    {project.funder}
                                  </span>
                                )}
                              </div>

                              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                                {project.description}
                              </p>

                              {"publications" in project &&
                                project.publications && (
                                  <div className="mb-4">
                                    <h5 className="mb-3 flex items-center text-sm font-semibold text-foreground">
                                      <BookOpen className="mr-2 h-4 w-4 text-brand" />
                                      Key Publications (
                                      {project.publications.length})
                                    </h5>
                                    <div className="space-y-2">
                                      {project.publications.map(
                                        (
                                          pub: { title: string; link: string },
                                          i: number,
                                        ) => (
                                          <div
                                            key={i}
                                            className="flex items-start gap-2 rounded-lg bg-muted/30 p-3"
                                          >
                                            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                                            <a
                                              href={pub.link}
                                              className="text-sm text-brand hover:text-brand-deep transition-colors line-clamp-2"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              {pub.title}
                                            </a>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {project.team && (
                                <div className="mb-4">
                                  <h5 className="mb-3 flex items-center text-sm font-semibold text-foreground">
                                    <Users2 className="mr-2 h-4 w-4 text-brand" />
                                    Team Members ({project.team.length})
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {project.team.map((member, i) => (
                                      <span
                                        key={i}
                                        className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground"
                                      >
                                        {member}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between rounded-lg bg-muted/20 p-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {project.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-center Collaborations */}
      <section className="py-16 sm:py-24 bg-linear-to-br from-slate-50 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Users className="h-4 w-4" />
              Global Impact
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Multi-center Collaborations
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Leading and participating in international research networks to
              advance pediatric critical care worldwide.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {collaborations.map((collab, index) => (
              <motion.div
                key={collab.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cognition/15">
                    <Users className="h-6 w-6 text-cognition" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                    {collab.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {collab.description}
                  </p>
                  <div className="mb-4 rounded-lg bg-muted/30 p-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Role
                    </span>
                    <p className="mt-1 text-sm text-foreground">
                      {collab.role}
                    </p>
                  </div>
                  {collab.link !== "#" ? (
                    <a
                      href={collab.link}
                      className="inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-deep transition-colors"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-muted-foreground italic">
                      Link Coming Soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="rounded-3xl border border-border bg-linear-to-br from-card via-background to-muted/30 p-8 sm:p-12 shadow-lg shadow-brand/5">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
                <Beaker className="h-4 w-4" />
                Join Our Mission
              </div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Collaborate With Us
              </h2>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                We welcome collaborations from clinicians, researchers,
                institutions, and industry partners who share our passion for
                advancing pediatric neurocritical care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/collaborate"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                >
                  Start Collaboration
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const researchThemes = [
  {
    title:
      "Neuroprognostication in Acute Disorder of Consciousness after Acquired Brain Injury",
    description:
      "Developing and validating advanced methods to predict outcomes in patients with acquired brain injury and disorders of consciousness through systematic reviews, neuroimaging, and standardized protocols",
    icon: Brain,
    gradient: "linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)",
    projects: [
      {
        title: "Systematic Reviews on Neuroprognostication",
        description:
          "Comprehensive meta-analyses on prediction of neurological outcomes after pediatric cardiac arrest and brain injury",
        status: "Published",
        publications: [
          {
            title:
              "Prediction of good neurological outcome after return of circulation following paediatric cardiac arrest: A systematic review and meta-analysis",
            link: "https://www.sciencedirect.com/science/article/pii/S030095722400858X",
          },
        ],
      },
      {
        title: "PREDICT ABI Project",
        description:
          "Evaluating functional neuroimaging (fNIRS, hdEEG and fMRI) as a tool to detect covert consciousness and improve accuracy of outcome prediction in children with acquired brain injury",
        funder: "AMOSO",
        status: "Ongoing",
        team: ["Dr. Karen", "Research Team"],
      },
      {
        title: "Common Data Elements for Disorders of Consciousness",
        description:
          "Developing standardized data collection protocols for pediatric disorders of consciousness research to improve multicenter collaboration",
        status: "Active",
        publications: [
          {
            title:
              "Common Data Elements for Disorders of Consciousness: Recommendations from the Working Group in the Pediatric Population",
            link: "https://link.springer.com/article/10.1007/s12028-023-01870-7",
          },
        ],
      },
      {
        title: "Ethics of Research in Disorders of Consciousness",
        description:
          "Exploring ethical considerations and frameworks for conducting research in patients with severe disorders of consciousness",
        status: "In Progress",
      },
      {
        title: "GERMINAL Project",
        description:
          "Quality improvement project to improve caregiver satisfaction and reduce moral distress around complex decision making in children with devastating brain injuries",
        funder:
          "Radboud-Western Collaboration Fund & Dept. of Paediatrics Summer Studentship",
        status: "Active",
        team: ["Dr. Femke Bekius", "Research Team"],
      },
      {
        title:
          "Book Chapter: Approach to Child with Reduced Level of Consciousness",
        description:
          "Comprehensive clinical guide for assessing and managing children with altered consciousness",
        status: "Published",
        publications: [
          {
            title: "Approach to the Child with Reduced Level of Consciousness",
            link: "https://link.springer.com/chapter/10.1007/978-3-031-67951-3_49",
          },
        ],
      },
    ],
  },
  {
    title: "ICU Delirium & Sleep Deprivation",
    description:
      "Investigating brain connectivity changes, cognitive impacts, and detection methods for delirium and sleep deprivation in critical care settings using advanced neuroimaging and machine learning approaches",
    icon: Activity,
    gradient: "linear-gradient(135deg, #7c3aed 0%, #059669 100%)",
    projects: [
      {
        title: "TraNSIENCE",
        description:
          "Tracking brain connectivity in children at risk of delirium using advanced neuroimaging techniques. Over 70 children enrolled with multiple conference presentations",
        funder: "Brain Canada",
        status: "Active (70+ enrolments)",
        team: ["Srinidhi", "Brian", "Bobbi", "Research Team"],
      },
      {
        title: "Systematic Review: Functional Connectivity Changes in Delirium",
        description:
          "Comprehensive analysis of brain connectivity alterations associated with delirium in critically ill patients",
        status: "Manuscript in Preparation",
        team: ["Karen", "Research Team"],
      },
      {
        title:
          "Systematic Review: Functional Connectivity Changes in Acute Sleep Deprivation",
        description:
          "Analysis of brain connectivity changes associated with acute sleep deprivation in healthcare providers",
        status: "Accepted for Publication",
        publications: [
          {
            title:
              "Functional connectivity changes associated with acute sleep deprivation (Neurological Sciences)",
            link: "#",
          },
        ],
      },
      {
        title: "BrainCASH Study",
        description:
          "Brain connectivity in Acutely Sleep deprived Health care providers - investigating cognitive and neurological impacts",
        status: "Published Abstracts",
        team: ["Dr. Stephanie Hosang", "Research Team"],
      },
      {
        title: "BrainCASH-2 Study",
        description:
          "Cognitive function assessment in Acutely Sleep deprived healthcare providers - resident research project",
        status: "Underway",
        team: ["Dr. Sunny Kim", "Resident Research Project"],
      },
      {
        title:
          "EEG-based Machine Learning Framework for Acute Sleep Deprivation",
        description:
          "Developing automated detection systems for acute sleep deprivation using quantitative EEG and machine learning algorithms",
        status: "Under Review",
        publications: [
          {
            title:
              "EEG-based machine learning framework for diagnosis of acute sleep deprivation (Frontiers in Physiology)",
            link: "#",
          },
        ],
        team: ["Daya Kumar", "Dr. Narayan's IDSL Lab"],
      },
    ],
  },
  {
    title: "Quantitative EEG Guided Enhanced Neuromonitoring",
    description:
      "Advanced EEG monitoring and quantitative analysis for seizure detection, delirium assessment, and neuromonitoring in critically ill children using innovative nurse-led protocols",
    icon: Eye,
    gradient: "linear-gradient(135deg, #0284c7 0%, #059669 100%)",
    projects: [
      {
        title: "NuANCEd: Nurse-led Advanced Monitoring",
        description:
          "Nurse-led advanced monitoring for non-convulsive seizures in encephalopathic critically ill children",
        funder: "AMOSO Opportunities",
        status: "Ongoing",
      },
      {
        title: "Quantitative EEG in PICU Delirium",
        description:
          "Evaluating qEEG metrics such as ADR (Amplitude-integrated EEG Derivative Ratio) and RAV (Relative Alpha Variability) in children with and without PICU delirium",
        status: "Active",
        team: ["Hiruthika Ravi", "Research Team"],
      },
    ],
  },
  {
    title: "Pain and Comfort in Critical Care",
    description:
      "Optimizing sedation, analgesia, and comfort management for pediatric critically ill patients through multicenter trials and international surveys of neurocritical care practices",
    icon: Users,
    gradient: "linear-gradient(135deg, #059669 0%, #0284c7 100%)",
    projects: [
      {
        title: "ABOVE Trial",
        description:
          "Advancing Brain Outcomes in pediatric critically ill patients sedated with Volatile Anesthetic Agents: A pilot multicentre randomized controlled trial",
        funder: "CIHR",
        status: "Pilot Phase",
        team: [
          "Angela Jerath",
          "Nicole McKinnon",
          "Brian Cuthbertson",
          "Marat Slessarev",
        ],
        publications: [
          {
            title:
              "Volatile gas scavenging in the paediatric intensive care unit: Occupational health and safety assessment",
            link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11189165/",
          },
          {
            title:
              "Inhaled volatiles for status asthmaticus (Critical Care Explorations)",
            link: "https://journals.lww.com/ccejournal/fulltext/2024/02000/inhaled_volatiles_for_status_asthmaticus.17.aspx",
          },
          {
            title:
              "Analogsedative drug use in burn ICU patients (Critical Care Medicine)",
            link: "https://journals.lww.com/ccmjournal/fulltext/2024/01001/966__analgosedative_drug_use_in_burn_icu_patients.911.aspx",
          },
        ],
      },
      {
        title: "In-SYNCC",
        description:
          "International survey of neurocritical care practices in pediatric ICUs - Series of surveys focusing on sedation, analgesia, delirium detection, TBI management and neuroprognostication in brain-injured critically ill children",
        status: "Ongoing",
      },
    ],
  },
];

const collaborations = [
  {
    title: "POPCORN Project",
    description:
      "Pediatric Outcomes improvement through Coordination of Research Networks - National network improving pediatric critical care outcomes through collaborative research and quality improvement initiatives",
    role: "Scientific Committee Chair, Site PI, SnaCCC Sub-study Lead (Study of Neurological Complications in children with COVID-19 infections)",
    link: "https://www.popcornpediatrics.ca/",
  },
  {
    title: "PROBE Registry",
    description:
      "Pediatric Registry of Brain Death Practices - International registry of over 2000 children who underwent death declaration by neurologic criteria to standardize practices and improve outcomes",
    role: "Collaborating Investigator",
    link: "#",
  },
  {
    title: "BOBBI Trial",
    description:
      "Better Outcomes in Babies with Bacterial meningitis - Multicenter randomized controlled trial for improving outcomes in pediatric bacterial meningitis through optimized treatment protocols",
    role: "Canada Lead Investigator",
    funder: "CIHR",
    link: "#",
  },
];
