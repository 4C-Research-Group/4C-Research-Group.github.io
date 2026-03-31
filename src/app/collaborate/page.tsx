"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Users,
  Handshake,
  ArrowRight,
  ExternalLink,
  Brain,
  Eye,
  Microscope,
  Building,
  Award,
  Lightbulb,
  Globe,
  Target,
  Zap,
} from "lucide-react";

export default function Collaborate() {
  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header with Foresee Theme */}
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
              <Eye className="h-4 w-4" />
              FORESEE Research Excellence
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Collaborate With Us
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                Predicting the Future of Brain Health
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Join our mission to advance neuroprognostication and critical care
              research through meaningful partnerships. Together, we can detect
              what's happening in the brain in real-time and predict future
              brain function.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <Brain className="h-4 w-4" />
                Real-time Detection
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Eye className="h-4 w-4" />
                Future Prediction
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Zap className="h-4 w-4" />
                Critical Care Impact
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Research Focus */}
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
              Our FORESEE Research Focus
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Two key aspects define our research program: detecting brain
              pathologies in real-time and predicting future brain function and
              outcomes.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-cognition/5 via-background to-consciousness/5 p-8 shadow-lg"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-cognition/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-cognition/15">
                  <Brain className="h-8 w-8 text-cognition" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  Real-time Detection
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  What is happening in the brain in real-time?
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cognition" />
                    <span className="text-muted-foreground">
                      Detection of brain pathologies in critically ill patients
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cognition" />
                    <span className="text-muted-foreground">
                      Covert consciousness identification
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cognition" />
                    <span className="text-muted-foreground">
                      Advanced neuroimaging and EEG monitoring
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-cognition" />
                    <span className="text-muted-foreground">
                      Timely intervention opportunities
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-consciousness/5 via-background to-care/5 p-8 shadow-lg"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-consciousness/10 blur-3xl" />
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-consciousness/15">
                  <Eye className="h-8 w-8 text-consciousness" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-foreground">
                  Future Prediction
                </h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  What will the brain's function look like in the future?
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-consciousness" />
                    <span className="text-muted-foreground">
                      Neuroprognostication after brain injury
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-consciousness" />
                    <span className="text-muted-foreground">
                      Outcome prediction models
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-consciousness" />
                    <span className="text-muted-foreground">
                      Machine learning for brain state prediction
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-consciousness" />
                    <span className="text-muted-foreground">
                      Long-term functional outcome forecasting
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="py-16 sm:py-24 bg-linear-to-br from-slate-50 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Partnership Opportunities
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We invite collaborators and industry partners interested in
              advancing disorders of cognition and consciousness research in
              critical care.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {collaborationOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${opportunity.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <opportunity.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-foreground group-hover:text-brand transition-colors">
                    {opportunity.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    {opportunity.description}
                  </p>
                  <ul className="mb-6 space-y-2">
                    {opportunity.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                  >
                    Explore Partnership
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Partners */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Institutional Partners
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Leading institutions supporting our mission to advance brain
              health research
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {partners.map((partner, index) => (
              <motion.a
                key={partner.name}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5">
                  <div className="mb-4 flex h-24 w-full items-center justify-center rounded-xl bg-linear-to-br from-slate-50 to-slate-100 p-3 transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={partner.image}
                      alt={`${partner.name} logo`}
                      width={160}
                      height={100}
                      className="h-full w-full object-contain"
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                    {partner.name}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {partner.type}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-brand transition-opacity duration-300">
                    <span>Visit Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Major Funding Support */}
      <section className="py-16 sm:py-24 bg-linear-to-br from-slate-50 to-background">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Award className="h-4 w-4" />
              Major Funding Support
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Prestigious Funding Recognition
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We gratefully acknowledge the generous support of our funding
              partners
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {funders.map((funder, index) => (
              <motion.div
                key={funder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5 flex flex-col">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-consciousness to-care transition-transform duration-300 group-hover:scale-110">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    {funder.amount && (
                      <div className="rounded-lg bg-brand/10 px-3 py-1 text-right">
                        <p className="text-xs font-medium text-muted-foreground">
                          Funding
                        </p>
                        <p className="text-sm font-bold text-brand">
                          {funder.amount}
                        </p>
                      </div>
                    )}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-brand transition-colors">
                    {funder.name}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {funder.type}
                  </p>
                  {funder.announcement && (
                    <a
                      href={funder.announcement}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand hover:bg-brand/20 transition-colors mb-4"
                    >
                      <span>View Award Announcement</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <div className="mt-auto">
                    <a
                      href={funder.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/50 transition-colors group"
                    >
                      <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                        Visit Website
                      </span>
                      <div className="flex items-center gap-1 rounded-lg bg-brand px-2 py-1 text-white group-hover:bg-brand-deep transition-colors">
                        <span className="text-xs font-medium">Explore</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-background to-muted/30 shadow-xl">
              <div className="bg-linear-to-br from-brand to-cognition p-8 text-white">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4" />
                  Let's Collaborate
                </div>
                <h2 className="mb-4 text-3xl font-bold">
                  Ready to Shape the Future of Brain Health?
                </h2>
                <p className="text-lg leading-relaxed">
                  Join us in our mission to predict and protect brain function
                  in critically ill patients. We welcome collaborations from
                  clinicians, researchers, institutions, and industry partners
                  who share our passion for advancing neurocritical care.
                </p>
              </div>

              <div className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <h3 className="mb-6 text-xl font-bold text-foreground">
                      Get in Touch
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                          <Mail className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Email
                          </p>
                          <a
                            href="mailto:rishi.ganesan@lhsc.on.ca"
                            className="text-brand hover:text-brand-deep transition-colors"
                          >
                            rishi.ganesan@lhsc.on.ca
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                          <Phone className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Phone
                          </p>
                          <p className="text-muted-foreground">
                            +1 (519) 685-8500 Ext. 74702
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                          <MapPin className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Location
                          </p>
                          <p className="text-muted-foreground">
                            London Health Sciences Centre
                            <br />
                            London, ON N6A 5W9
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-6 text-xl font-bold text-foreground">
                      Research Focus Areas
                    </h3>
                    <div className="space-y-3">
                      {researchAreas.map((area, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10">
                            <Target className="h-3 w-3 text-brand" />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {area}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="mb-2 font-semibold text-foreground">
                        Connect With Our Research
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Follow our latest discoveries and publications
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href="https://scholar.google.com/citations?user=iuxSVQwAAAAJ&hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-deep"
                      >
                        Google Scholar
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.researchgate.net/profile/Saptharishi-Lalgudi-Ganesan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
                      >
                        ResearchGate
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const collaborationOpportunities = [
  {
    title: "Clinical Research Partners",
    description:
      "Collaborate with healthcare institutions for patient recruitment and data collection",
    icon: Users,
    color: "bg-brand",
    benefits: [
      "Access to diverse patient populations",
      "Shared expertise in clinical protocols",
      "Joint publications and presentations",
      "Enhanced grant opportunities",
    ],
  },
  {
    title: "Industry Partnerships",
    description: "Partner with medical technology and pharmaceutical companies",
    icon: Handshake,
    color: "bg-cognition",
    benefits: [
      "Technology development and validation",
      "Real-world evidence generation",
      "Innovation in patient monitoring",
      "Commercialization opportunities",
    ],
  },
  {
    title: "Academic Collaborations",
    description: "Work with research institutions and universities worldwide",
    icon: Users,
    color: "bg-consciousness",
    benefits: [
      "Multi-center research studies",
      "Data sharing and analysis",
      "Student and researcher exchanges",
      "Combined grant applications",
    ],
  },
];

const partners = [
  {
    name: "London Health Sciences Centre Research Institute",
    type: "Research Institute",
    link: "https://www.lhscri.ca/",
    image: "/images/partners/LHSCRI.png",
  },
  {
    name: "Schulich School of Medicine & Dentistry",
    type: "Academic Partner",
    link: "https://www.schulich.uwo.ca/paediatrics/about_us/people/faculty/ganesan_rishi.html",
    image: "/images/partners/Schulich.png",
  },
  {
    name: "Western Institute for Neurosciences",
    type: "Research Institute",
    link: "https://win.uwo.ca/",
    image: "/images/partners/WesternIN.png",
  },
  {
    name: "Children's Health Research Institute",
    type: "Research Institute",
    link: "https://www.childhealthresearch.ca/",
    image: "/images/partners/childrenHRI.png",
  },
];

const researchAreas = [
  "Neuroprognostication after brain injury",
  "Covert consciousness detection",
  "ICU delirium and sleep deprivation",
  "Quantitative EEG monitoring",
  "Pediatric critical care research",
  "Machine learning in neurocritical care",
];

const funders = [
  {
    name: "CIHR",
    type: "Federal Funding Agency",
    amount: "Multiple Grants",
    link: "https://cihr-irsc.gc.ca/e/193.html",
  },
  {
    name: "Brain Canada",
    type: "National Foundation",
    amount: "$2M Future Leaders Award",
    announcement:
      "https://can01.safelinks.protection.outlook.com/?url=https%3A%2F%2Fbraincanada.ca%2Fannouncements%2F2m-to-support-bold-brain-science-in-canada%2F&data=05%7C02%7Cpranav.jha%40mail.concordia.ca%7C3055554703c14a56c7b408de06742e11%7C5569f185d22f4e139850ce5b1abcd2e8%7C0%7C0%7C638955293870740448%7CUnknown%7CTWFpbGZsb3d8eyJFbXB0eU1hcGkiOnRydWUsIlYiOiIwLjAuMDAwMCIsIlAiOiJXaW4zMiIsIkFOIjoiTWFpbCIsIldUIjoyfQ%3D%3D%7C0%7C%7C%7C&sdata=Ium8sr0n8w61sQZhk0jyllgqBMXKkBJ30gwon4wsoso%3D&reserved=0",
    link: "https://braincanada.ca/",
  },
  {
    name: "AMOSO",
    type: "Regional Foundation",
    amount: "Project Funding",
    link: "https://amosoweb.ca/",
  },
  {
    name: "Radboud-Western Collaboration",
    type: "International Partnership",
    amount: "Collaborative Grant",
    link: "https://www.ru.nl/en",
  },
];
