"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  GraduationCap,
  Users,
  Lightbulb,
  School,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { joinTestimonials } from "@/data/join-testimonials";

const CONTACT_EMAIL = "rishi.ganesan@lhsc.on.ca";
const MAILTO = `mailto:${CONTACT_EMAIL}`;

const joinContent = {
  hero_title: "Join 4C Research Group",
  hero_description:
    "We are always looking for passionate students to join our team. If you are interested in joining our team, please send your CV to:",
  intro_title:
    "Read more about previous students' experiences with the 4C Research Group below!",
  card1_title: "Research Excellence",
  card1_description:
    "Work on cutting-edge research in cognition, consciousness, and critical care. Gain hands-on experience with state-of-the-art methodologies and technologies.",
  card2_title: "Collaborative Environment",
  card2_description:
    "Join a diverse team of researchers, clinicians, and students. Learn from experts and contribute to meaningful research that makes a difference.",
  card3_title: "Innovation & Growth",
  card3_description:
    "Develop your skills in a supportive environment that encourages innovation and personal growth. Build your research portfolio and network.",
  cta_title: "Ready to Join Our Mission?",
  cta_description:
    "Send your CV today and take the first step towards contributing to groundbreaking research in cognition, consciousness, and critical care.",
  cta_button_text: "Send Your CV",
  cta_button_link: MAILTO,
};

export default function Join4CLabPage() {
  const testimonials = joinTestimonials;

  return (
    <div className="min-h-screen bg-background">
      <PageHero title={joinContent.hero_title} subtitle={joinContent.hero_description}>
        <div className="flex items-center justify-center gap-2 text-lg md:text-xl font-semibold text-brand">
          <Mail className="w-6 h-6 shrink-0" aria-hidden />
          <a href={MAILTO} className="hover:text-brand-deep transition-colors break-all">
            {CONTACT_EMAIL}
          </a>
        </div>
      </PageHero>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {joinContent.intro_title}
            </h2>
            <div className="w-32 h-1.5 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
              <div className="bg-cognition/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <School className="w-8 h-8 text-cognition" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {joinContent.card1_title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {joinContent.card1_description}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
              <div className="bg-consciousness/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-consciousness" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {joinContent.card2_title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {joinContent.card2_description}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
              <div className="bg-care/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lightbulb className="w-8 h-8 text-care" strokeWidth={1.75} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {joinContent.card3_title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {joinContent.card3_description}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl border border-border shadow-lg p-8 mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center">
              How to Apply
            </h2>
            <div className="w-32 h-1.5 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto mt-4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Required Documents
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {[
                    "Updated CV/Resume",
                    "Cover letter explaining your interest",
                    "Academic transcripts (if applicable)",
                    "References (upon request)",
                  ].map((text, i) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="bg-cognition text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Application Steps
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  {[
                    `Send your CV to ${CONTACT_EMAIL}`,
                    "Include a brief cover letter in the email",
                    "Wait for our team to review your application",
                    "We'll contact you for an interview if selected",
                  ].map((text, i) => (
                    <li key={text} className="flex items-start gap-3">
                      <span className="bg-consciousness text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Student Testimonials
              </h2>
              <div className="w-32 h-1.5 bg-linear-to-r from-cognition via-consciousness to-care rounded-full mx-auto" />
              <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                Hear from our previous students about their experiences with the
                4C Research Group
              </p>
            </div>

            {testimonials.length > 0 ? (
              <div className="space-y-8 max-w-5xl mx-auto">
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3 p-6 flex items-center justify-center bg-muted/50">
                        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-card shadow-lg bg-muted">
                          {testimonial.imageSrc ? (
                            <Image
                              src={testimonial.imageSrc}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 192px, 224px"
                            />
                          ) : (
                            <div className="w-full h-full bg-linear-to-br from-cognition to-brand-deep flex items-center justify-center">
                              <span className="text-5xl md:text-6xl text-primary-foreground font-bold">
                                {testimonial.name
                                  .split(/\s+/)
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:w-2/3 p-8">
                        <div className="relative pl-4 border-l-4 border-cognition mb-6">
                          <p className="text-foreground/90 italic pl-4 text-lg leading-relaxed">
                            &ldquo;{testimonial.quote}&rdquo;
                          </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-border">
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {testimonial.name}
                          </h3>
                          <p className="text-brand font-medium mb-4">
                            {testimonial.role}
                          </p>

                          <h4 className="font-semibold text-foreground mb-2">
                            Bio
                          </h4>
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {testimonial.bio}
                          </p>
                          <div className="flex items-start text-sm text-muted-foreground gap-2">
                            <GraduationCap className="mt-0.5 shrink-0 w-4 h-4" />
                            <span>{testimonial.education}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No testimonials available at the moment. Check back soon!
                </p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl shadow-xl p-8 text-center text-primary-foreground bg-linear-to-r from-cognition to-consciousness"
          >
            <h2 className="text-2xl font-bold mb-4">{joinContent.cta_title}</h2>
            <p className="text-lg mb-6 opacity-95 max-w-2xl mx-auto leading-relaxed">
              {joinContent.cta_description}
            </p>
            <a
              href={joinContent.cta_button_link}
              className="inline-flex items-center gap-2 bg-card text-brand hover:bg-brand-light font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              {joinContent.cta_button_text}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
