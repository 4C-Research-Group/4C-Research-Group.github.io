"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Tag,
  ExternalLink,
  Filter,
  ChevronRight,
  Brain,
  Activity,
  Eye,
  BookOpen,
  Search,
  Grid3X3,
  Building,
  Target,
  Zap,
} from "lucide-react";
import { fallbackProjects, type Project } from "@/data/projectsData";
import { fetchPublishedProjectsFromSupabase } from "@/lib/projects/supabase-projects";
import { projectDetailHref } from "@/lib/projects/project-detail-href";

const statusColors = {
  active:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  completed:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  upcoming:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
};

const categoryIcons = {
  "Implementation Science": Brain,
  "Clinical Research": Activity,
  "Clinical Trial": Eye,
  Registry: BookOpen,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let alive = true;
    void (async () => {
      const remote = await fetchPublishedProjectsFromSupabase();
      if (!alive || !remote?.length) return;
      setProjects(remote);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return ["all", ...cats];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const categoryMatch =
        selectedCategory === "all" || project.category === selectedCategory;
      const statusMatch =
        selectedStatus === "all" || project.status === selectedStatus;
      const searchMatch =
        searchQuery === "" ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [projects, selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
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
              <Target className="h-4 w-4" />
              Active Research Projects
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Research Projects
              <span className="block text-3xl font-semibold text-muted-foreground sm:text-4xl lg:text-5xl">
                Advancing Pediatric Critical Care
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Exploring the frontiers of pediatric critical care through
              innovative research initiatives that predict outcomes and improve
              brain health in critically ill children.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 rounded-lg bg-cognition/10 px-4 py-2 text-cognition">
                <Brain className="h-4 w-4" />
                Implementation Science
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-consciousness/10 px-4 py-2 text-consciousness">
                <Activity className="h-4 w-4" />
                Clinical Research
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-care/10 px-4 py-2 text-care">
                <Eye className="h-4 w-4" />
                Clinical Trials
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 sm:px-6 lg:py-16">
        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-border bg-background pl-12 pr-4 py-4 text-foreground placeholder-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Category:
                </span>
              </div>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-brand text-white shadow-lg scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border hover:border-brand/30"
                  }`}
                >
                  {category === "all" ? "All Categories" : category}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              {["all", "active", "completed", "upcoming"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedStatus === status
                      ? "bg-brand text-white shadow-lg scale-105"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border hover:border-brand/30"
                  }`}
                >
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredProjects.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {projects.length}
              </span>{" "}
              projects
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-brand hover:text-brand-deep transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project, index) => {
              const CategoryIcon =
                categoryIcons[project.category as keyof typeof categoryIcons] ||
                Brain;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={projectDetailHref(project.id)}>
                    <article className="h-full flex flex-col bg-card rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:border-brand/20 transition-all duration-500 overflow-hidden">
                      {/* Project Image */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={project.images[0] || "/images/placeholder.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="eager"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${statusColors[project.status]}`}
                          >
                            {project.status}
                          </span>
                        </div>

                        {/* Category Icon */}
                        <div className="absolute bottom-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                            <CategoryIcon className="w-6 h-6 text-brand" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-xs font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-lg">
                            {project.category}
                          </span>
                          {project.funding && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                              <Building className="w-3 h-3" />
                              {project.funding}
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand transition-colors line-clamp-2">
                          {project.title}
                        </h3>

                        <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1.5 bg-muted/70 rounded-lg text-muted-foreground font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-xs px-3 py-1.5 bg-muted/70 rounded-lg text-muted-foreground font-medium">
                              +{project.tags.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(project.startDate).getFullYear()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>{project.teamMembers?.length || 0}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-brand group-hover:text-brand-deep transition-all">
                            <span className="text-sm font-medium">
                              View Details
                            </span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* No Results */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No projects found
              </h3>
              <p className="text-muted-foreground mb-4">
                No projects match your current filters or search criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-brand-deep transition-colors"
              >
                Reset all filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
