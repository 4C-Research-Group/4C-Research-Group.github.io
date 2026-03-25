"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  Eye,
  Users,
  ExternalLink,
  Users2,
  BookOpen,
} from "lucide-react";
import PageHero from "@/components/PageHero";

export default function Research() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-brand-light">
      <PageHero
        compact
        title="Our Research"
        subtitle="Exploring the frontiers of neuroprognostication and brain monitoring in critical care"
      />

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="space-y-12 sm:space-y-16">
            {researchThemes.map((theme, themeIndex) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(themeIndex * 0.05, 0.2),
                }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
              >
                <div
                  className="p-6 sm:p-8 text-primary-foreground"
                  style={{ background: theme.gradient }}
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                      <theme.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold sm:text-3xl">
                      {theme.title}
                    </h2>
                  </div>
                  <p className="text-base leading-relaxed text-primary-foreground/95 sm:text-lg">
                    {theme.description}
                  </p>
                </div>

                <div className="p-6 sm:p-8 bg-background/50">
                  <div className="grid md:grid-cols-2 gap-6">
                    {theme.projects.map((project) => (
                      <div
                        key={project.title}
                        className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-brand/25 hover:shadow-md"
                      >
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                          <h3 className="text-xl font-bold text-foreground">
                            {project.title}
                          </h3>
                          {project.funder && (
                            <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                              {project.funder}
                            </span>
                          )}
                        </div>

                        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>

                        {"publications" in project && project.publications && (
                          <div className="mb-4">
                            <h4 className="mb-2 flex items-center font-semibold text-foreground">
                              <BookOpen className="mr-2 h-4 w-4 text-brand" />
                              Key Publications
                            </h4>
                            <ul className="space-y-1">
                              {project.publications.map(
                                (
                                  pub: { title: string; link: string },
                                  i: number,
                                ) => (
                                  <li
                                    key={i}
                                    className="flex items-start text-sm text-muted-foreground"
                                  >
                                    <ExternalLink className="mr-2 mt-1 h-3 w-3 shrink-0 text-brand" />
                                    <a
                                      href={pub.link}
                                      className="text-brand hover:text-brand-deep transition-colors"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {pub.title}
                                    </a>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}

                        {project.team && (
                          <div className="mb-4">
                            <h4 className="mb-2 flex items-center font-semibold text-foreground">
                              <Users2 className="mr-2 h-4 w-4 text-brand" />
                              Team Members
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.team.map((member, i) => (
                                <span
                                  key={i}
                                  className="rounded-md bg-muted px-2 py-1 text-sm text-foreground"
                                >
                                  {member}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                          <span className="text-sm text-muted-foreground">
                            {project.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/40 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
              Multi-center Collaborations
            </h2>
            <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-linear-to-r from-cognition via-consciousness to-care" />
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Leading and participating in international research networks
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {collaborations.map((collab, index) => (
              <motion.div
                key={collab.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.15),
                }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-brand/20 hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-cognition/15">
                  <Users className="h-6 w-6 text-cognition" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {collab.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {collab.description}
                </p>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-foreground">
                    Role:
                  </span>
                  <p className="text-sm text-muted-foreground">{collab.role}</p>
                </div>
                {collab.link !== "#" ? (
                  <a
                    href={collab.link}
                    className="inline-flex cursor-pointer items-center gap-1 font-medium text-brand hover:text-brand-deep transition-colors"
                  >
                    Visit Website
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground italic">
                    Link Coming Soon
                  </span>
                )}
              </motion.div>
            ))}
          </div>
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
