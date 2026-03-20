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
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <Sparkles className="w-16 h-16 text-blue-600" />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"></div>
              </motion.div>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              4C Research Group
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Covert Consciousness and Critical Care Research
            </p>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto shadow-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Advancing the detection and prediction of brain pathologies in
                critically ill patients through cutting-edge neuroimaging and
                machine learning technologies.
              </p>

              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <Activity className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Real-time Detection
                    </h3>
                    <p className="text-gray-600">
                      Understanding what's happening in the brain right now
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Eye className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Future Prediction
                    </h3>
                    <p className="text-gray-600">
                      Forecasting brain function and patient outcomes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <p className="text-lg text-gray-700 mb-4">
                We invite collaborators and industry partners interested in
                advancing disorders of cognition and consciousness research in
                critical care.
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                <span>Collaborate With Us</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Research Themes */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Research Themes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-lg ${theme.color} flex items-center justify-center mb-4`}
                >
                  <theme.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {theme.title}
                </h3>
                <p className="text-gray-600 mb-4">{theme.description}</p>
                <ul className="space-y-2">
                  {theme.projects.map((project, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-500 flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
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
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <Brain className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {project.funder}
                    </span>
                    <span className="text-sm text-gray-500">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"
                        ></div>
                      ))}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
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
    color: "bg-blue-600",
    projects: ["PREDICT ABI", "Common Data Elements", "GERMINAL Project"],
  },
  {
    title: "ICU Delirium & Sleep",
    description: "Tracking brain connectivity in at-risk children",
    icon: Activity,
    color: "bg-purple-600",
    projects: ["TraNSIENCE", "BrainCASH", "Sleep Deprivation Studies"],
  },
  {
    title: "EEG Monitoring",
    description: "Quantitative EEG for enhanced neuromonitoring",
    icon: Eye,
    color: "bg-green-600",
    projects: ["NuANCEd", "qEEG Metrics", "Machine Learning Framework"],
  },
  {
    title: "Pain & Comfort",
    description: "Advancing outcomes in pediatric critical care",
    icon: Users,
    color: "bg-orange-600",
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
