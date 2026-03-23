"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Activity,
  Eye,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  Mail,
  Twitter,
  ChevronDown,
  Mouse,
} from "lucide-react";
import { projects } from "@/data/projectsData";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-brand-light">
      {/* Hero Section */}
      <section className="relative min-h-screen lg:mt-[-4rem] flex items-center overflow-hidden">
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

        {/* Scroll to Explore Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <a
            href="#mission"
            className="group flex flex-col items-center text-white/80 hover:text-white transition-all duration-300"
          >
            <span className="text-sm font-medium mb-2 uppercase tracking-wider group-hover:translate-y-[-2px] transition-transform">
              Scroll to explore
            </span>
            <div className="group-hover:scale-110 transition-all duration-300">
              <Mouse className="w-5 h-5 animate-bounce text-white/80 group-hover:text-white" />
            </div>
          </a>
        </motion.div>
      </section>

      {/* Our Mission */}
      <section
        id="mission"
        className="py-20 bg-gradient-to-br from-slate-50 to-brand-light"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            {/* Left Column - Mission Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    We are dedicated to advancing the understanding and
                    treatment of cognitive and consciousness disorders in
                    critically ill children. Our multidisciplinary team combines
                    expertise in pediatric critical care, neuroscience, and
                    biomedical engineering to develop innovative solutions that
                    improve patient outcomes.
                  </p>
                  <p>
                    Through cutting-edge research and clinical collaboration, we
                    strive to make a meaningful difference in the lives of
                    children and their families.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3845988/pexels-photo-3845988.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop"
                  alt="Medical research team collaborating"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-md">
                    <p className="text-sm font-semibold text-brand">
                      Collaborative Research Excellence
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bringing together diverse expertise to transform pediatric
                      care
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-consciousness/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-r from-brand via-cognition to-consciousness text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Driving innovation in pediatric critical care through dedicated
              research and collaboration
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "12+", label: "Research Projects", icon: Brain },
              { number: "90+", label: "Publications", icon: BookOpen },
              { number: "10+", label: "Team Members", icon: Users },
              { number: "5+", label: "Institutions", icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/90" />
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-white/80 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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

      {/* Latest Research News */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cognition to-brand mb-6 shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Research News
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cognition via-consciousness to-care rounded-full mx-auto"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl border border-border/60 overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                      Researchers investigate a new method of sedation for
                      paediatric patients
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Scientists at Children&apos;s Health Research Institute (a
                      program of Lawson Health Research Institute), Sunnybrook
                      Research Institute and The Hospital for Sick Children
                      (SickKids) are working together to study the potential
                      benefits of inhaled sedation as an alternative to keep
                      critically ill children sedated and comfortable.
                    </p>
                    <a
                      href="https://www.sickkids.ca/en/news/archive/2023/researchers-investigate-a-new-method-of-sedation-for-paediatric-patients/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-cognition text-white px-6 py-3 rounded-full font-semibold hover:from-brand-deep hover:to-cognition-deep transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span>Read the full article on SickKids</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="md:w-48 flex-shrink-0">
                    <div className="relative">
                      <img
                        src="https://images.pexels.com/photos/3845988/pexels-photo-3845988.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Medical research collaboration"
                        className="w-full h-48 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full">
                          Research News
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-sm text-muted-foreground">
                Stay updated with the latest breakthroughs in pediatric critical
                care research
              </p>
            </motion.div>
          </motion.div>
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
            {projects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border group"
              >
                <div className="h-48 bg-linear-to-br from-brand to-consciousness flex items-center justify-center relative overflow-hidden">
                  <img
                    src={project.images[0] || "/images/placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-semibold text-white bg-brand/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-brand bg-brand-light px-3 py-1 rounded-full">
                      {project.funding || "Research"}
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        project.status === "active"
                          ? "bg-green-100 text-green-800"
                          : project.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{project.teamMembers?.length || 0} members</span>
                    </div>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-brand hover:text-brand-deep font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand to-cognition text-white px-8 py-3 rounded-full font-semibold hover:from-brand-deep hover:to-cognition-deep transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Join Our Research Community */}
      <section className="py-20 bg-gradient-to-br from-brand via-cognition to-consciousness text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Research Community
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12">
              We are always looking for passionate researchers, students, and
              collaborators to join us in advancing the frontiers of cognitive
              science and critical care research.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/join-4c-lab"
                className="inline-flex items-center gap-3 bg-white text-brand px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Users className="w-5 h-5" />
                <span>Join Our Team</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center gap-3 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-brand transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Us</span>
              </a>
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Stay Connected - Social Media */}
      <section className="py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-cognition mb-6 shadow-lg">
              <Twitter className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Follow Us on Social Media
            </p>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Stay updated with our latest research findings, team updates, and
              insights into pediatric critical care. Follow us on social media
              to be part of our research community.
            </p>

            <motion.a
              href="https://x.com/Mission_FourC"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Twitter className="w-5 h-5" />
              <span>Follow @Mission_FourC</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            {/* Animated social media elements */}
            <div className="mt-12 flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-brand to-cognition"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </motion.div>
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
