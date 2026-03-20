'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Users, Handshake, ArrowRight, ExternalLink } from 'lucide-react';

export default function Collaborate() {
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
            <h1 className="text-5xl font-bold mb-6">Collaborate With Us</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Join our mission to advance neuroprognostication and critical care research
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Opportunities */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Collaboration Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We welcome partnerships with researchers, clinicians, and industry partners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collaborationOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${opportunity.color} flex items-center justify-center mb-4`}>
                  <opportunity.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{opportunity.title}</h3>
                <p className="text-gray-600 mb-4">{opportunity.description}</p>
                <ul className="space-y-2 mb-6">
                  {opportunity.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Institutions and organizations we work with to advance research
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{partner.type}</p>
                <a href={partner.link} className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1">
                  <span>Visit</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-lg leading-relaxed">
                  Ready to collaborate? We'd love to hear from you. Contact us to discuss potential research partnerships, 
                  funding opportunities, or clinical collaborations.
                </p>
              </div>
              
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">research@4clab.ca</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">+1 (519) 123-4567</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">London Health Sciences Centre, London, ON</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Research Areas</h3>
                    <div className="space-y-2">
                      {researchAreas.map((area, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          <span className="text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Follow Our Research</h4>
                      <p className="text-gray-600 mb-4">
                        Stay updated with our latest publications and research findings
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2">
                        <span>Google Scholar</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a href="#" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors inline-flex items-center space-x-2">
                        <span>ResearchGate</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Funding Acknowledgments */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Funding Support</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We gratefully acknowledge the support of our funding partners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {funders.map((funder, index) => (
              <motion.div
                key={funder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{funder.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{funder.type}</p>
                {funder.amount && (
                  <p className="text-sm font-semibold text-blue-600">{funder.amount}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const collaborationOpportunities = [
  {
    title: "Clinical Research Partners",
    description: "Collaborate with healthcare institutions for patient recruitment and data collection",
    icon: Users,
    color: "bg-blue-600",
    benefits: [
      "Access to diverse patient populations",
      "Shared expertise in clinical protocols",
      "Joint publications and presentations",
      "Enhanced grant opportunities"
    ]
  },
  {
    title: "Industry Partnerships",
    description: "Partner with medical technology and pharmaceutical companies",
    icon: Handshake,
    color: "bg-purple-600",
    benefits: [
      "Technology development and validation",
      "Real-world evidence generation",
      "Innovation in patient monitoring",
      "Commercialization opportunities"
    ]
  },
  {
    title: "Academic Collaborations",
    description: "Work with research institutions and universities worldwide",
    icon: Users,
    color: "bg-green-600",
    benefits: [
      "Multi-center research studies",
      "Data sharing and analysis",
      "Student and researcher exchanges",
      "Combined grant applications"
    ]
  }
];

const partners = [
  {
    name: "London Health Sciences Centre",
    type: "Hospital Partner",
    link: "https://www.lhsc.on.ca/"
  },
  {
    name: "Schulich School of Medicine",
    type: "Academic Partner",
    link: "https://www.schulich.uwo.ca/"
  },
  {
    name: "Western Institute for Neurosciences",
    type: "Research Institute",
    link: "https://www.uwo.ca/brain/"
  },
  {
    name: "Brain Canada Foundation",
    type: "Funding Partner",
    link: "https://braincanada.ca/"
  }
];

const researchAreas = [
  "Neuroprognostication after brain injury",
  "Covert consciousness detection",
  "ICU delirium and sleep deprivation",
  "Quantitative EEG monitoring",
  "Pediatric critical care research",
  "Machine learning in neurocritical care"
];

const funders = [
  {
    name: "CIHR",
    type: "Federal Funding Agency",
    amount: "Multiple Grants"
  },
  {
    name: "Brain Canada",
    type: "National Foundation",
    amount: "$2M Future Leaders Award"
  },
  {
    name: "AMOSO",
    type: "Regional Foundation",
    amount: "Project Funding"
  },
  {
    name: "Radboud-Western Collaboration",
    type: "International Partnership",
    amount: "Collaborative Grant"
  }
];
