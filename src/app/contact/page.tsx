"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Building2,
  Send,
  Loader2,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { contactPageContent } from "@/data/contact-page";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const contact = contactPageContent;
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const subject = encodeURIComponent(
        `[4C Website] ${formData.subject}`.slice(0, 200)
      );
      const body = encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\n` +
          `Reply-to: ${formData.email}\n\n` +
          `${formData.message}`
      );
      const mailto = `mailto:${contact.email}?subject=${subject}&body=${body}`;
      window.location.href = mailto;
      setSubmitStatus({
        type: "success",
        message:
          "Your email app should open with a draft to send. If it didn’t, email us directly at " +
          contact.email +
          ".",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please email us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand focus:bg-card transition-all text-sm";

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title={contact.hero_title}
        subtitle={contact.hero_description}
      />

      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch">
            <div className="flex flex-col gap-6 h-full min-h-0">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border shadow-lg p-6 lg:p-8 shrink-0"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We&apos;d love to hear from you. Fill out the form below
                    and we&apos;ll get back to you as soon as possible.
                  </p>
                </div>

                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-6 p-3 rounded-lg flex items-start gap-2 text-sm ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 text-green-800 border border-green-500/25"
                        : "bg-destructive/10 text-destructive border border-destructive/25"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{submitStatus.message}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                        placeholder="John"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-foreground mb-1"
                      >
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={inputClass}
                        placeholder="Doe"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                      placeholder="How can we help?"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className={`${inputClass} resize-none min-h-[120px]`}
                      placeholder="Tell us more about your inquiry..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand hover:bg-brand-deep disabled:opacity-60 text-primary-foreground font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Opening mail…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                viewport={{ once: true }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-1 flex flex-col items-center justify-center rounded-xl p-6 sm:p-8 text-center shadow-lg border border-brand/20 bg-linear-to-br from-brand-light/60 via-brand-light/30 to-consciousness/10">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Student Research Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed max-w-md">
                    If you are a student looking for opportunities to
                    participate in research, please do not hesitate to reach
                    out!
                  </p>
                  <Link
                    href="/join-4c-lab"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand hover:bg-brand-deep text-primary-foreground font-semibold rounded-lg shadow-sm transition-colors text-sm"
                  >
                    Join 4C Lab
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col gap-6 h-full min-h-0">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl border border-border shadow-lg p-6 shrink-0"
              >
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 bg-cognition/15 p-2 rounded-lg">
                      <MapPin className="text-cognition w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Location
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 bg-cognition/15 p-2 rounded-lg">
                      <Phone className="text-cognition w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Phone
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 bg-cognition/15 p-2 rounded-lg">
                      <Mail className="text-cognition w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Email
                      </h4>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-brand hover:text-brand-deep transition-colors text-sm"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 bg-cognition/15 p-2 rounded-lg">
                      <Clock className="text-cognition w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Hours
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {contact.hours}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="shrink-0 bg-cognition/15 p-2 rounded-lg">
                      <User className="text-cognition w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        Research Coordinator
                      </h4>
                      <p className="text-muted-foreground text-sm mb-1">
                        {contact.research_coordinator_name}
                      </p>
                      <a
                        href={`mailto:${contact.research_coordinator_email}`}
                        className="text-brand hover:text-brand-deep transition-colors text-sm"
                      >
                        {contact.research_coordinator_email}
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex-1 flex flex-col min-h-0 min-h-[280px] lg:min-h-0">
                <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden flex-1 flex flex-col min-h-[260px]">
                  <div className="p-4 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-cognition/15 p-2 rounded-lg">
                        <Building2 className="text-cognition w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Visit Us
                      </h3>
                    </div>
                  </div>
                  <div className="flex-1 min-h-[220px] w-full">
                    <iframe
                      src={contact.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Victoria Hospital & Children's Hospital"
                      className="w-full h-full min-h-[220px]"
                    />
                  </div>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/NHAV4ZiR9p3aeGGW6"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand hover:bg-brand-deep text-primary-foreground font-semibold rounded-lg transition-colors text-sm"
              >
                Open in Google Maps
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
