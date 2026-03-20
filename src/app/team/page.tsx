'use client';

import { motion } from 'framer-motion';
import { Users, GraduationCap, Award, Mail, ExternalLink } from 'lucide-react';

export default function Team() {
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
            <h1 className="text-5xl font-bold mb-6">Our Team</h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated researchers and clinicians advancing neuroprognostication and critical care
            </p>
          </motion.div>
        </div>
      </section>

      {/* Principal Investigator */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0"></div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Dr. [Principal Investigator]</h2>
                  <p className="text-lg text-gray-600 mb-4">Principal Investigator, 4C Research Group</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Neuroprognostication
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Critical Care
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      EEG Monitoring
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Leading research in covert consciousness detection and outcome prediction in critically ill patients. 
                    Expertise in functional neuroimaging, quantitative EEG, and machine learning applications in neurocritical care.
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Contact</span>
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-700 flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>Schulich Profile</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Team Members */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Team Members</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Dedicated researchers, clinicians, and students contributing to our mission
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTeam.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <Users className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-gray-600 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-500 mb-4">{member.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {member.expertise.map((skill, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{member.category}</span>
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Alumni */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lab Alumni</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Former members who have contributed significantly to our research
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {alumni.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2 text-center">{member.previousRole}</p>
                <p className="text-xs text-gray-500 text-center mb-3">{member.currentPosition}</p>
                <div className="flex justify-center">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {member.year}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Collaborators</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              International partners and institutions working with us
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collaborators.map((collab, index) => (
              <motion.div
                key={collab.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{collab.name}</h3>
                <p className="text-gray-600 mb-2">{collab.institution}</p>
                <p className="text-sm text-gray-500 mb-4">{collab.project}</p>
                <a href={collab.link} className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center space-x-1">
                  <span>Learn More</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const currentTeam = [
  {
    name: "Dr. Karen C",
    role: "Research Scientist",
    description: "Leading functional neuroimaging research and covert consciousness detection studies",
    expertise: ["fNIRS", "fMRI", "Neuroprognostication"],
    category: "Research Staff"
  },
  {
    name: "Dr. Femke Bekius",
    role: "Post-doctoral Fellow",
    description: "Complex decision making in neuroprognostication and ethical considerations in DoC research",
    expertise: ["Bioethics", "Decision Making", "Quality Improvement"],
    category: "Post-doc"
  },
  {
    name: "Hiruthika Ravi",
    role: "Graduate Student",
    description: "Quantitative EEG analysis in PICU delirium and seizure detection",
    expertise: ["qEEG", "Delirium", "PICU"],
    category: "PhD Student"
  },
  {
    name: "Daya Kumar",
    role: "Graduate Student",
    description: "EEG-based machine learning for acute sleep deprivation detection",
    expertise: ["Machine Learning", "EEG", "Sleep Research"],
    category: "MSc Student"
  },
  {
    name: "Srinidhi",
    role: "Research Coordinator",
    description: "Managing TraNSIENCE study and brain connectivity research in at-risk children",
    expertise: ["Study Coordination", "Data Management", "Neuroimaging"],
    category: "Research Staff"
  },
  {
    name: "Brian",
    role: "Research Assistant",
    description: "Supporting multiple projects including TraNSIENCE and ABOVE trial",
    expertise: ["Data Collection", "EEG", "Clinical Research"],
    category: "Research Staff"
  }
];

const alumni = [
  { name: "Hiruthika Ravi", previousRole: "Graduate Student", currentPosition: "Completed PhD", year: "2023" },
  { name: "Brian", previousRole: "Research Assistant", currentPosition: "Medical School", year: "2023" },
  { name: "Daniela", previousRole: "Research Coordinator", currentPosition: "Industry Position", year: "2022" },
  { name: "Sarah", previousRole: "Graduate Student", currentPosition: "Completed MSc", year: "2022" },
  { name: "Donna", previousRole: "Research Nurse", currentPosition: "Senior Clinical Role", year: "2021" },
  { name: "Hafsa", previousRole: "Research Assistant", currentPosition: "Medical School", year: "2021" },
  { name: "Julia", previousRole: "Data Analyst", currentPosition: "Health Tech Industry", year: "2020" },
  { name: "Megha Shetty", previousRole: "Graduate Student", currentPosition: "Completed PhD", year: "2020" },
  { name: "Brennan Donville", previousRole: "Research Assistant", currentPosition: "Medical School", year: "2020" },
  { name: "Hashmeet", previousRole: "Summer Student", currentPosition: "Medical School", year: "2019" },
  { name: "Saanvi Mittal", previousRole: "Undergraduate Student", currentPosition: "Graduate Studies", year: "2019" },
  { name: "Bobbi", previousRole: "Research Coordinator", currentPosition: "Clinical Research Position", year: "2023" }
];

const collaborators = [
  {
    name: "Dr. Matthew Kirschen",
    institution: "Children's Hospital of Philadelphia (CHOP)",
    project: "PROBE Registry - Pediatric Brain Death Practices",
    link: "#"
  },
  {
    name: "Dr. Manish Sadarangani",
    institution: "University of British Columbia",
    project: "BOBBI Trial - Bacterial Meningitis Outcomes",
    link: "#"
  },
  {
    name: "Dr. Barney Scholefield",
    institution: "University of Birmingham",
    project: "Neuroprognostication after Cardiac Arrest",
    link: "#"
  },
  {
    name: "Dr. Narayan's IDSL Lab",
    institution: "Western University",
    project: "Machine Learning Framework for Sleep Deprivation",
    link: "#"
  },
  {
    name: "Angela Jerath",
    institution: "University of Toronto",
    project: "ABOVE Trial - Volatile Anesthetic Agents",
    link: "#"
  },
  {
    name: "Nicole McKinnon",
    institution: "University of Toronto",
    project: "ABOVE Trial - Clinical Outcomes",
    link: "#"
  }
];
