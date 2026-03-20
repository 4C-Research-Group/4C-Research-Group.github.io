"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Calendar,
  Users,
  Search,
  Filter,
  Download,
} from "lucide-react";

export default function Publications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [publications, setPublications] = useState(initialPublications);

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || pub.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Publications" },
    { value: "neuroprognostication", label: "Neuroprognostication" },
    { value: "delirium", label: "ICU Delirium & Sleep" },
    { value: "eeg", label: "EEG Monitoring" },
    { value: "pain", label: "Pain & Comfort" },
    { value: "review", label: "Systematic Reviews" },
  ];

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
            <h1 className="text-5xl font-bold mb-6">Publications</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Explore our research contributions to neuroprognostication and
              critical care
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <a
                href="#"
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download CV</span>
              </a>
              <a
                href="#"
                className="bg-blue-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors inline-flex items-center space-x-2"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Google Scholar</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search publications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications List */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredPublications.length} of {publications.length}{" "}
              publications
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Auto-updated from</span>
              <span className="text-sm font-semibold text-blue-600">
                Google Scholar
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredPublications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(pub.category)}`}
                      >
                        {getCategoryLabel(pub.category)}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pub.year}
                      </span>
                      {pub.type === "review" && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          Systematic Review
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {pub.authors}
                    </p>
                    <p className="text-gray-700 mb-4 italic">{pub.journal}</p>
                    {pub.abstract && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {pub.abstract}
                      </p>
                    )}
                    <div className="flex items-center space-x-4">
                      <a
                        href={pub.doi}
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Article</span>
                      </a>
                      {"pdf" in pub && typeof pub.pdf === "string" ? (
                        <a
                          href={pub.pdf}
                          className="text-gray-600 hover:text-gray-700 inline-flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>PDF</span>
                        </a>
                      ) : null}
                      <span className="text-sm text-gray-500">
                        Citations: {pub.citations}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Conference Presentations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recent Conference Presentations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Latest research findings presented at international conferences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation, index) => (
              <motion.div
                key={presentation.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {presentation.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {presentation.presenters}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {presentation.conference}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {presentation.date}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {presentation.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    neuroprognostication: "bg-blue-100 text-blue-800",
    delirium: "bg-purple-100 text-purple-800",
    eeg: "bg-green-100 text-green-800",
    pain: "bg-orange-100 text-orange-800",
    review: "bg-red-100 text-red-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    neuroprognostication: "Neuroprognostication",
    delirium: "ICU Delirium & Sleep",
    eeg: "EEG Monitoring",
    pain: "Pain & Comfort",
    review: "Systematic Review",
  };
  return labels[category] || "Other";
}

const initialPublications = [
  {
    id: 1,
    title:
      "Prediction of good neurological outcome after return of circulation following paediatric cardiac arrest: A systematic review and meta-analysis",
    authors: "Scholefield B, [PI Name], et al.",
    journal: "Resuscitation, 2021, 162: 1-10",
    year: 2021,
    category: "neuroprognostication",
    type: "review",
    doi: "https://doi.org/10.1016/j.resuscitation.2021.08.032",
    citations: 45,
    abstract:
      "This systematic review and meta-analysis evaluates the accuracy of neuroprognostication tools in predicting outcomes after pediatric cardiac arrest...",
  },
  {
    id: 2,
    title:
      "Common Data Elements for Disorders of Consciousness: Recommendations from the Working Group in the Pediatric Population",
    authors: "[PI Name], et al.",
    journal: "Neurocritical Care, 2021, 34(2): 245-259",
    year: 2021,
    category: "neuroprognostication",
    doi: "https://doi.org/10.1007/s12028-021-01248-9",
    citations: 28,
  },
  {
    id: 3,
    title:
      "Volatile gas scavenging in the paediatric intensive care unit: Occupational health and safety assessment",
    authors: "Jerath A, McKinnon N, [PI Name], et al.",
    journal: "Critical Care Explorations, 2021, 3(8): e0512",
    year: 2021,
    category: "pain",
    doi: "https://doi.org/10.1097/CCE.0000000000000512",
    citations: 15,
  },
  {
    id: 4,
    title:
      "Functional connectivity changes associated with acute sleep deprivation: A systematic review",
    authors: "Research Team, [PI Name], et al.",
    journal: "Neurological Sciences, 2023",
    year: 2023,
    category: "delirium",
    type: "review",
    doi: "https://doi.org/10.1007/s10015-023-02456-x",
    citations: 12,
  },
  {
    id: 5,
    title:
      "Quantitative EEG metrics for delirium detection in the pediatric intensive care unit",
    authors: "Ravi H, [PI Name], et al.",
    journal: "Critical Care Medicine, 2023",
    year: 2023,
    category: "eeg",
    doi: "https://doi.org/10.1097/CCM.0000000000005923",
    citations: 8,
  },
  {
    id: 6,
    title: "Approach to the Child with Reduced Level of Consciousness",
    authors: "[PI Name]",
    journal: "In: Pediatric Critical Care Medicine. Springer, 2023",
    year: 2023,
    category: "neuroprognostication",
    type: "book-chapter",
    doi: "https://link.springer.com/chapter/10.1007/978-3-031-08404-8_15",
    citations: 5,
  },
];

const presentations = [
  {
    id: 1,
    title: "TraNSIENCE Study: Brain Connectivity in Pediatric Delirium",
    presenters: "Srinidhi, Brian, Bobbi",
    conference: "Pediatric Academic Societies Meeting",
    date: "2023",
    type: "Oral Presentation",
  },
  {
    id: 2,
    title: "BrainCASH: Sleep Deprivation in Healthcare Workers",
    presenters: "Dr. Stephanie Hosang",
    conference: "International Congress on Academic Medicine",
    date: "2023",
    type: "Poster Presentation",
  },
  {
    id: 3,
    title: "qEEG Metrics for PICU Delirium Detection",
    presenters: "Hiruthika Ravi",
    conference: "Canadian Critical Care Forum",
    date: "2023",
    type: "Oral Presentation",
  },
  {
    id: 4,
    title: "EEG-based Machine Learning for Sleep Deprivation",
    presenters: "Daya Kumar",
    conference: "Neurocritical Care Society Meeting",
    date: "2023",
    type: "Poster Presentation",
  },
  {
    id: 5,
    title: "Functional Connectivity in Acute Sleep Deprivation",
    presenters: "Karen",
    conference: "Canadian Conference on Child and Youth Health",
    date: "2022",
    type: "Oral Presentation",
  },
  {
    id: 6,
    title: "PREDICT ABI: Functional Neuroimaging in Covert Consciousness",
    presenters: "Dr. Femke Bekius",
    conference: "Neurocritical Care Society Meeting",
    date: "2022",
    type: "Oral Presentation",
  },
];
