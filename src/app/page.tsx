"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  Eye,
  Users,
  BookOpen,
  Award,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-brand-light">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Pexels Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/17483869/pexels-photo-17483869.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')",
          }}
        ></div>

        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-br from-brand/80 via-cognition/70 to-consciousness/80"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-consciousness/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-white/10 [background-size:50px_50px]"></div>

        {/* Content Container with z-index */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-5 gap-16 items-center relative z-10"
          >
            {/* Left Column - Content */}
            <div className="md:col-span-3 text-white relative z-10">
              <h1 className="text-5xl font-bold mb-6">4C Research Group</h1>
              <p className="text-2xl text-white/80 mb-8">
                Advancing Research in Cognition, Consciousness & Critical Care
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
                <p className="text-white/80 leading-relaxed mb-6">
                  Exploring the frontiers of neuroscience and critical care
                  through innovative research and collaboration.
                </p>

                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start space-x-3">
                    <Activity className="w-6 h-6 text-white mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold">Real-time Detection</h3>
                      <p className="text-white/70">
                        Understanding what's happening in the brain right now
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Eye className="w-6 h-6 text-white mt-1 shrink-0" />
                    <div>
                      <h3 className="font-semibold">Future Prediction</h3>
                      <p className="text-white/70">
                        Forecasting brain function and patient outcomes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-lg text-white/80 mb-4">
                  We invite collaborators and industry partners interested in
                  advancing disorders of cognition and consciousness research in
                  critical care.
                </p>
                <button className="bg-white text-brand px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors inline-flex items-center space-x-2">
                  <span>Collaborate With Us</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Column - Logo */}
            <div className="md:col-span-2 flex justify-center relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-10"
              >
                <img
                  src="/logo.png"
                  alt="4C Research Lab Logo"
                  className="w-96 h-96 lg:w-[420px] lg:h-[420px] rounded-2xl shadow-2xl bg-white/90"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Themes */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Research Themes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exploring the frontiers of neuroprognostication and brain
              monitoring in critical care
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchThemes.map((theme, index) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-linear-to-br from-muted to-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-border"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${theme.color} flex items-center justify-center mb-4`}
                >
                  <theme.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {theme.title}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {theme.description}
                </p>
                <ul className="space-y-2">
                  {theme.projects.map((project, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-brand rounded-full mr-2"></span>
                      {project}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-linear-to-br from-brand-light to-muted">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Highlighting our funded research initiatives and collaborations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border"
              >
                <div className="h-48 bg-linear-to-br from-brand to-consciousness flex items-center justify-center">
                  <Brain className="w-16 h-16 text-primary-foreground" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-brand bg-brand-light px-3 py-1 rounded-full">
                      {project.funder}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-muted rounded-full border-2 border-card"
                        ></div>
                      ))}
                    </div>
                    <button className="text-brand hover:text-brand-deep font-medium flex items-center space-x-1">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
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
    title: "Neuroprognostication",
    description: "Predicting outcomes in acquired brain injury",
    icon: Brain,
    color: "bg-cognition",
    projects: ["PREDICT ABI", "Common Data Elements", "GERMINAL Project"],
  },
  {
    title: "ICU Delirium & Sleep",
    description: "Tracking brain connectivity in at-risk children",
    icon: Activity,
    color: "bg-consciousness",
    projects: ["TraNSIENCE", "BrainCASH", "Sleep Deprivation Studies"],
  },
  {
    title: "EEG Monitoring",
    description: "Quantitative EEG for enhanced neuromonitoring",
    icon: Eye,
    color: "bg-care",
    projects: ["NuANCEd", "qEEG Metrics", "Machine Learning Framework"],
  },
  {
    title: "Pain & Comfort",
    description: "Advancing outcomes in pediatric critical care",
    icon: Users,
    color: "bg-brand",
    projects: ["ABOVE Trial", "In-SYNCC Survey", "Multi-center Studies"],
  },
];

const featuredProjects = [
  {
    title: "PREDICT ABI Project",
    description:
      "Evaluating functional neuroimaging to detect covert consciousness and improve outcome prediction accuracy",
    funder: "AMOSO",
    status: "Ongoing",
  },
  {
    title: "TraNSIENCE Study",
    description:
      "Tracking brain connectivity in children at risk of delirium with over 70 enrolments completed",
    funder: "Brain Canada",
    status: "Active",
  },
  {
    title: "ABOVE Trial",
    description:
      "Multicentre RCT advancing brain outcomes in pediatric patients with volatile anesthetic agents",
    funder: "CIHR",
    status: "Pilot Phase",
  },
];
