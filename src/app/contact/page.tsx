"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { contactPageContent } from "@/data/contact-page";

function InfoRow({
  icon: Icon,
  iconClass,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm ring-1 ring-black/[0.03]">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const contact = contactPageContent;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-linear-to-br from-slate-50 via-background to-brand-light/25">
        <div className="absolute inset-0 bg-grid-black/5 mask-[linear-gradient(to_bottom_right,white,transparent,white)]" />
        <div className="container relative mx-auto px-4 py-14 sm:px-6 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-medium text-brand">
              <Sparkles className="h-4 w-4" />
              Contact
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                {contact.hero_title}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {contact.hero_description}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-10 overflow-hidden rounded-2xl border border-brand/20 bg-linear-to-br from-brand/12 via-brand/5 to-care/10 p-8 shadow-lg sm:p-10 md:text-center"
        >
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Email the research group
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            For collaborations, media, or general questions, send a message to
            our lab inbox.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:mx-auto sm:inline-flex sm:flex-row sm:items-center sm:justify-center">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-brand-deep"
            >
              <Mail className="h-4 w-4 shrink-0" />
              {contact.email}
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground md:text-center">
            We aim to reply within a few business days.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-4 lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg font-bold tracking-tight text-foreground"
            >
              Lab details
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <InfoRow
                icon={MapPin}
                iconClass="bg-cognition/15 text-cognition"
                title="Location"
              >
                {contact.address}
              </InfoRow>
              <InfoRow
                icon={Phone}
                iconClass="bg-consciousness/15 text-consciousness"
                title="Phone"
              >
                <a
                  href="tel:+15196858500"
                  className="text-brand transition-colors hover:text-brand-deep"
                >
                  {contact.phone}
                </a>
              </InfoRow>
              <InfoRow
                icon={Clock}
                iconClass="bg-care/15 text-care"
                title="Hours"
              >
                {contact.hours}
              </InfoRow>
              <InfoRow
                icon={User}
                iconClass="bg-brand/12 text-brand"
                title="Research coordinator"
              >
                <p className="text-foreground">{contact.research_coordinator_name}</p>
                <a
                  href={`mailto:${contact.research_coordinator_email}`}
                  className="mt-1 inline-block font-medium text-brand transition-colors hover:text-brand-deep"
                >
                  {contact.research_coordinator_email}
                </a>
              </InfoRow>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="rounded-2xl border border-border bg-linear-to-br from-muted/40 to-card p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-foreground">
                Students
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Interested in research opportunities? Learn how to apply and
                hear from past trainees.
              </p>
              <Link
                href="/join-4c-lab"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-deep"
              >
                Join 4C Lab
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col lg:col-span-7"
          >
            <div className="flex items-center gap-3 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cognition/15">
                <Building2 className="h-5 w-5 text-cognition" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Visit us</h2>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
              <div className="min-h-[280px] w-full flex-1 sm:min-h-[320px] lg:min-h-[360px]">
                <iframe
                  src={contact.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Victoria Hospital & Children's Hospital"
                  className="h-full min-h-[280px] w-full sm:min-h-[320px] lg:min-h-[360px]"
                />
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/NHAV4ZiR9p3aeGGW6"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 sm:w-auto sm:self-start"
            >
              Open in Google Maps
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
