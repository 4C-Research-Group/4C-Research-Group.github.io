"use client";

import { useState, useEffect } from "react";
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
  Microscope,
  Zap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { fallbackProjects } from "@/data/projectsData";
import { fetchPublishedProjectsFromSupabase } from "@/lib/projects/supabase-projects";
import { projectDetailHref } from "@/lib/projects/project-detail-href";

export default function Home() {
  const [featuredProjects, setFeaturedProjects] = useState(() =>
    fallbackProjects.slice(0, 3),
  );

  useEffect(() => {
    let alive = true;
    void (async () => {
      const list = await fetchPublishedProjectsFromSupabase();
      if (!alive || !list?.length) return;
      setFeaturedProjects(list.slice(0, 3));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero — light, fast (no remote image), clear hierarchy */}
      <section className="relative isolate flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center overflow-hidden border-b border-border/50 bg-linear-to-br from-slate-50 via-background to-brand-light/40">
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-tr from-brand/[0.04] via-transparent to-brand/[0.06]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-grid-black/[0.04] mask-[linear-gradient(to_bottom,white_0%,white_55%,transparent_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/3 h-[380px] w-[380px] rounded-full bg-brand/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-28 bottom-0 h-[340px] w-[340px] rounded-full bg-consciousness/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-56 w-[min(85%,44rem)] -translate-x-1/2 rounded-full bg-care/8 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand sm:text-[13px]">
                <Sparkles className="h-3.5 w-3.5 text-brand/80" aria-hidden />
                Pediatric neurocritical care research
              </div>

              <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="text-brand">4C</span> Research Group
              </h1>
              <p className="mt-2 text-sm font-medium leading-snug tracking-wide text-muted-foreground sm:text-base">
                Cognition · Consciousness · Critical Care
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[17px]">
                We study brain health in critically ill children—combining
                neuroimaging, bedside monitoring, and multicenter collaboration
                to improve outcomes.
              </p>

              <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href="/research/"
                  className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-background/90 px-3.5 py-1.5 text-sm font-medium text-cognition transition-colors hover:border-cognition/30 hover:bg-cognition/5"
                >
                  <Brain className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Cognition
                </Link>
                <Link
                  href="/research/"
                  className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-background/90 px-3.5 py-1.5 text-sm font-medium text-consciousness transition-colors hover:border-consciousness/30 hover:bg-consciousness/5"
                >
                  <Microscope className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Consciousness
                </Link>
                <Link
                  href="/research/"
                  className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-background/90 px-3.5 py-1.5 text-sm font-medium text-care transition-colors hover:border-care/30 hover:bg-care/5"
                >
                  <Zap className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                  Critical care
                </Link>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/research/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-brand-deep"
                >
                  Explore research
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/collaborate/"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-brand/35 hover:bg-brand/5"
                >
                  Collaborate
                </Link>
                <Link
                  href="/team/"
                  className="inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
                >
                  Meet the team
                </Link>
              </div>

              <p className="mt-8 max-w-lg border-l border-brand/25 pl-4 text-sm leading-relaxed text-muted-foreground">
                Interested in partnering? We work with clinicians, hospitals,
                and industry on studies from neuroprognostication to ICU
                delirium and quantitative EEG.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative lg:col-span-5"
            >
              <div className="absolute inset-0 -z-10 scale-[1.02] rounded-[2rem] bg-brand/8 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-10">
                <div
                  className="pointer-events-none absolute -right-12 top-1/4 h-40 w-40 rounded-full bg-brand/6 blur-2xl"
                  aria-hidden
                />
                <div className="relative mx-auto flex max-w-[260px] flex-col items-center text-center sm:max-w-[280px]">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-2xl bg-brand/5" />
                    <Image
                      src="/logo.png"
                      alt="4C Research Group logo"
                      width={240}
                      height={240}
                      className="relative h-44 w-44 rounded-2xl object-cover shadow-md ring-1 ring-black/5 sm:h-52 sm:w-52"
                      priority
                    />
                  </div>
                  <p className="mt-6 text-sm font-semibold text-foreground">
                    4C Research Group
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Clinical neurocritical care research and collaboration
                  </p>
                  <Link
                    href="/gallery/"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand/30 hover:bg-muted/50 hover:text-brand"
                  >
                    View gallery
                    <ArrowRight className="h-4 w-4 opacity-60" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
        >
          <a
            href="#mission"
            className="group flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
              Continue
            </span>
            <ChevronDown className="h-5 w-5 motion-safe:animate-bounce opacity-80 group-hover:opacity-100" aria-hidden />
          </a>
        </motion.div>
      </section>
      {/* Our Mission */}
      <section
        id="mission"
        className="py-20 bg-linear-to-br from-slate-50 to-brand-light"
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96">
                <Image
                  src="/images/lab.jpg"
                  alt="Medical research team collaborating"
                  fill
                  className="w-full h-96 object-cover"
                  loading="lazy"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
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
      {/* Ultra Modern Gallery Preview */}
      <section className="py-24 bg-linear-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Gallery
              </h2>
              <p className="text-muted-foreground mt-3 text-lg max-w-xl">
                Moments from our lab — research, collaboration, and
                breakthroughs.
              </p>
            </div>

            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] gap-5">
            {[
              { img: "20240423_095244.jpg", span: "col-span-2 row-span-2" },
              { img: "20230214_194648.jpg", span: "" },
              { img: "20230613_093841.jpg", span: "" },
              { img: "20231110_125703.jpg", span: "row-span-2" },
              { img: "20240408_120719.jpg", span: "" },
              { img: "20250520_184141.jpg", span: "col-span-2" },
              { img: "IMG-20240829-WA0035.jpg", span: "" },
            ].map((item, index) => (
              <motion.div
                key={item.img}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`relative group overflow-hidden rounded-3xl ${item.span}`}
              >
                {/* Image */}
                <Image
                  src={`/images/lab-images/${item.img}`}
                  alt="Lab preview"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  priority={false}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Glass hover overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>

                {/* Subtle gradient bottom */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60"></div>

                {/* Floating label */}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-white/80 backdrop-blur-md text-xs px-3 py-1 rounded-full shadow">
                    Lab Moment
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 bg-white border border-border px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <span className="font-semibold text-foreground">
                Explore Full Gallery
              </span>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-linear-to-r from-brand via-cognition to-consciousness text-white">
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
      <section className="py-20 bg-linear-to-br from-slate-50 to-muted/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-cognition to-brand mb-6 shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Latest Research News
              </h2>
              <div className="w-24 h-1 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto"></div>
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
                      className="inline-flex items-center gap-2 bg-linear-to-r from-brand to-cognition text-white px-6 py-3 rounded-full font-semibold hover:from-brand-deep hover:to-cognition-deep transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <span>Read the full article on SickKids</span>
                      <ArrowRight className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="md:w-48 shrink-0">
                    <div className="relative h-48">
                      <Image
                        src="https://images.pexels.com/photos/3845988/pexels-photo-3845988.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Medical research collaboration"
                        fill
                        className="w-full h-48 object-cover rounded-2xl"
                        loading="lazy"
                        priority={false}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl"></div>
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
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-border group"
              >
                <div className="h-48 bg-linear-to-br from-brand to-consciousness flex items-center justify-center relative overflow-hidden">
                  <Image
                    src={project.images[0] || "/images/placeholder.jpg"}
                    alt={project.title}
                    fill
                    className="w-full h-full object-cover"
                    loading="lazy"
                    priority={false}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
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
                      href={projectDetailHref(project.id)}
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
              href="/projects/"
              className="inline-flex items-center gap-2 bg-linear-to-r from-brand to-cognition text-white px-8 py-3 rounded-full font-semibold hover:from-brand-deep hover:to-cognition-deep transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Join Our Research Community */}
      <section className="py-20 bg-linear-to-br from-brand via-cognition to-consciousness text-white">
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
      <section className="py-16 bg-linear-to-b from-muted/50 to-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-brand to-cognition mb-6 shadow-lg">
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
                  className="w-2 h-2 rounded-full bg-linear-to-r from-brand to-cognition"
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
