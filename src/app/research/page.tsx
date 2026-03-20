"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  Eye,
  Users,
  Award,
  ExternalLink,
  Users2,
  BookOpen,
} from "lucide-react";

export default function Research() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Our Research</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Exploring the frontiers of neuroprognostication and brain
              monitoring in critical care
            </p>
          </motion.div>
        </div>
      </section>

      {/* Research Themes Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="space-y-16">
            {researchThemes.map((theme, themeIndex) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: themeIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div
                  className="bg-gradient-to-r p-8 text-white"
                  style={{ background: theme.gradient }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <theme.icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">{theme.title}</h2>
                  </div>
                  <p className="text-lg leading-relaxed">{theme.description}</p>
                </div>

                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    {theme.projects.map((project, projectIndex) => (
                      <div
                        key={project.title}
                        className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {project.title}
                          </h3>
                          {project.funder && (
                            <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              {project.funder}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-4">
                          {project.description}
                        </p>

                        {"publications" in project && project.publications && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Key Publications
                            </h4>
                            <ul className="space-y-1">
                              {project.publications.map(
                                (pub: any, i: number) => (
                                  <li
                                    key={i}
                                    className="text-sm text-gray-600 flex items-start"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-2 mt-1 flex-shrink-0 text-blue-600" />
                                    <a
                                      href={pub.link}
                                      className="hover:text-blue-600"
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
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                              <Users2 className="w-4 h-4 mr-2" />
                              Team Members
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {project.team.map((member, i) => (
                                <span
                                  key={i}
                                  className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {member}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-sm text-gray-500">
                            {project.status}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                            <span>Learn More</span>
                            <ExternalLink className="w-4 h-4" />
                          </button>
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

      {/* Multi-center Collaborations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Multi-center Collaborations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leading and participating in international research networks
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {collaborations.map((collab, index) => (
              <motion.div
                key={collab.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {collab.title}
                </h3>
                <p className="text-gray-600 mb-4">{collab.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-gray-800">
                    Role:
                  </span>
                  <p className="text-sm text-gray-600">{collab.role}</p>
                </div>
                <a
                  href={collab.link}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
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
    title: "Neuroprognostication in Acute Disorder of Consciousness",
    description:
      "Developing and validating methods to predict outcomes in patients with acquired brain injury and disorders of consciousness",
    icon: Brain,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    projects: [
      {
        title: "PREDICT ABI Project",
        description:
          "Evaluating functional neuroimaging (fNIRS, hdEEG and fMRI) as a tool to detect covert consciousness and improve accuracy of outcome prediction",
        funder: "AMOSO",
        status: "Ongoing",
        team: ["Dr. Karen C", "Dr. Femke Bekius", "Research Team"],
      },
      {
        title: "Systematic Reviews on Neuroprognostication",
        description:
          "Comprehensive meta-analyses on prediction of neurological outcomes after cardiac arrest and brain injury",
        status: "Published",
        publications: [
          {
            title:
              "Prediction of good neurological outcome after return of circulation following paediatric cardiac arrest: A systematic review and meta-analysis",
            link: "https://www.sciencedirect.com/science/article/pii/S0300985721000597",
          },
        ],
      },
      {
        title: "Common Data Elements for Disorders of Consciousness",
        description:
          "Developing standardized data collection protocols for pediatric disorders of consciousness research",
        status: "Active",
        publications: [
          {
            title:
              "Common Data Elements for Disorders of Consciousness: Recommendations from the Working Group in the Pediatric Population",
            link: "https://link.springer.com/article/10.1007/s12028-021-01248-9",
          },
        ],
      },
      {
        title: "GERMINAL Project",
        description:
          "Quality improvement project to improve caregiver satisfaction and reduce moral distress around complex decision making in children with devastating brain injuries",
        funder: "Radboud-Western Collaboration Fund",
        status: "Active",
        team: ["Dr. Femke Bekius", "Summer Students"],
      },
    ],
  },
  {
    title: "ICU Delirium & Sleep Deprivation",
    description:
      "Investigating brain connectivity changes and cognitive impacts of delirium and sleep deprivation in critical care",
    icon: Activity,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    projects: [
      {
        title: "TraNSIENCE",
        description:
          "Tracking brain connectivity in children at risk of delirium using advanced neuroimaging techniques",
        funder: "Brain Canada",
        status: "Active (70+ enrolments)",
        team: ["Srinidhi", "Brian", "Bobbi", "Research Team"],
      },
      {
        title: "BrainCASH Study",
        description:
          "Brain connectivity in Acutely Sleep deprived Health care providers - investigating cognitive impacts",
        status: "Published Abstracts",
        team: ["Dr. Stephanie Hosang", "Research Team"],
      },
      {
        title: "BrainCASH-2 Study",
        description:
          "Cognitive function assessment in Acutely Sleep deprived healthcare providers",
        status: "Underway",
        team: ["Dr. Sunny Kim", "Resident Research Project"],
      },
      {
        title: "EEG-based Machine Learning Framework",
        description:
          "Developing automated detection systems for acute sleep deprivation using quantitative EEG",
        status: "Under Review",
        team: ["Daya Kumar", "Dr. Narayan's IDSL Lab"],
      },
    ],
  },
  {
    title: "Quantitative EEG Guided Enhanced Neuromonitoring",
    description:
      "Advanced EEG monitoring and quantitative analysis for seizure detection and delirium assessment in critically ill children",
    icon: Eye,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    projects: [
      {
        title: "NuANCEd",
        description:
          "Nurse-led advanced monitoring for non-convulsive seizures in encephalopathic critically ill children",
        funder: "AMOSO Opportunities",
        status: "Ongoing",
      },
      {
        title: "Quantitative EEG in PICU Delirium",
        description:
          "Evaluating qEEG metrics such as ADR and RAV in children with and without PICU delirium",
        status: "Active",
        team: ["Hiruthika Ravi", "Research Team"],
      },
    ],
  },
  {
    title: "Pain and Comfort in Critical Care",
    description:
      "Optimizing sedation, analgesia, and comfort management for pediatric critically ill patients",
    icon: Users,
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
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
            link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8456789/",
          },
        ],
      },
      {
        title: "In-SYNCC",
        description:
          "International survey of neurocritical care practices in pediatric ICUs focusing on sedation, analgesia, delirium detection, TBI management and neuroprognostication",
        status: "Ongoing",
      },
    ],
  },
];

const collaborations = [
  {
    title: "POPCORN Project",
    description:
      "Pediatric Outcomes improvement through Coordination of Research Networks - improving pediatric critical care outcomes through collaborative research",
    role: "Scientific Committee Chair, Site PI, SnaCCC Sub-study Lead",
    link: "https://www.popcornnetwork.ca/",
  },
  {
    title: "PROBE Registry",
    description:
      "Pediatric Registry of Brain Death Practices - International registry of over 2000 children who underwent death declaration by neurologic criteria",
    role: "Collaborating Investigator",
    link: "#",
  },
  {
    title: "BOBBI Trial",
    description:
      "Better Outcomes in Babies with Bacterial meningitis - Randomized controlled trial for improving outcomes in pediatric bacterial meningitis",
    role: "Canada Lead Investigator",
    funder: "CIHR",
    link: "#",
  },
];
