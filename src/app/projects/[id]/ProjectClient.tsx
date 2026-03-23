"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Tag,
  ExternalLink,
  ArrowLeft,
  Brain,
  Activity,
  Eye,
  BookOpen,
  Target,
  FileText,
  Share2,
} from "lucide-react";
import { type Project } from "@/data/projectsData";

const categoryIcons = {
  "Implementation Science": Brain,
  "Clinical Research": Activity,
  "Clinical Trial": Eye,
  Registry: BookOpen,
};

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
  upcoming: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

interface ProjectClientProps {
  project: Project;
}

export default function ProjectClient({ project }: ProjectClientProps) {
  const CategoryIcon =
    categoryIcons[project.category as keyof typeof categoryIcons] || Brain;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src={project.images[0] || "/images/placeholder.jpg"}
          alt={project.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-start pt-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-white hover:text-white/90 mb-6 transition-colors bg-brand/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-brand/60 z-10 relative hover:bg-brand/90"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </Link>

              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[project.status]}`}
                >
                  {project.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {project.title}
              </h1>

              <p className="text-xl text-white/90 max-w-3xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-6 mt-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {new Date(project.startDate).getFullYear()} -{" "}
                    {project.endDate
                      ? new Date(project.endDate).getFullYear()
                      : "Present"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{project.teamMembers?.length || 0} Team Members</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Long Description */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Overview
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p>{project.longDescription || project.description}</p>
              </div>
            </motion.section>

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-brand" />
                  Objectives
                </h2>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-brand rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{objective}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            )}

            {/* Team Members */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-brand" />
                  Team Members
                </h2>
                <div className="grid gap-4">
                  {project.teamMembers.map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50"
                    >
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                      {member.image && (
                        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Publications */}
            {project.publications && project.publications.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-brand" />
                  Publications
                </h2>
                <div className="space-y-4">
                  {project.publications.map((publication, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="p-4 bg-muted/30 rounded-lg border border-border/50"
                    >
                      <h3 className="font-semibold text-foreground mb-2">
                        {publication.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {publication.date}
                        </p>
                        {publication.link && (
                          <a
                            href={publication.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:text-brand/80 flex items-center gap-1 text-sm"
                          >
                            View Publication
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4">
                Project Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">
                    {project.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground capitalize">
                    {project.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                {project.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {project.funding && (
                  <div>
                    <p className="text-sm text-muted-foreground">Funding</p>
                    <p className="font-medium text-foreground">
                      {project.funding}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Additional Info */}
            {project.additionalInfo && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Additional Information
                </h3>
                <p className="text-muted-foreground">
                  {project.additionalInfo}
                </p>
              </motion.div>
            )}

            {/* Share */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brand" />
                Share This Project
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="flex-1 px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  Copy Link
                </button>
                <button className="flex-1 px-4 py-2 bg-muted rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image Gallery */}
        {project.images.length > 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Project Gallery
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {project.images.slice(1).map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="relative aspect-video rounded-xl overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${project.title} - Image ${index + 2}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
