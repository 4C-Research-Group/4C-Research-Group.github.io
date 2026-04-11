"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import { contactPageContent } from "@/data/contact-page";

export default function ContactPage() {
  const contact = contactPageContent;

  return (
    <div className="min-h-screen bg-background">
      <PageHero
        compact
        title={contact.hero_title}
        subtitle={contact.hero_description}
      />

      <div className="border-t border-border/60 bg-muted/20">
        <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="space-y-10 lg:col-span-5">
              <section>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </h2>
                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 block text-lg font-medium text-brand underline-offset-4 hover:underline"
                >
                  {contact.email}
                </a>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  For questions about our research, partnerships, or the lab.
                </p>
              </section>

              <div className="h-px bg-border" />

              <section className="space-y-6 text-sm">
                <div className="flex gap-3">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {contact.address}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a
                      href="tel:+15196858500"
                      className="mt-1 block text-muted-foreground transition-colors hover:text-brand"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-foreground">Hours</p>
                    <p className="mt-1 text-muted-foreground">{contact.hours}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <User
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      Research coordinator
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {contact.research_coordinator_name}
                    </p>
                    <a
                      href={`mailto:${contact.research_coordinator_email}`}
                      className="mt-1 inline-block text-brand underline-offset-4 hover:underline"
                    >
                      {contact.research_coordinator_email}
                    </a>
                  </div>
                </div>
              </section>

              <div className="h-px bg-border" />

              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Students:</span>{" "}
                Interested in joining the team?{" "}
                <Link
                  href="/join-4c-lab"
                  className="font-medium text-brand underline-offset-4 hover:underline"
                >
                  Join 4C Lab
                </Link>
                .
              </p>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Map
              </h2>
              <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <iframe
                  src={contact.map_embed_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Victoria Hospital & Children's Hospital"
                  className="aspect-[4/3] min-h-[260px] w-full sm:min-h-[320px] lg:aspect-auto lg:min-h-[380px]"
                />
              </div>
              <a
                href="https://maps.app.goo.gl/NHAV4ZiR9p3aeGGW6"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                Open in Google Maps
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
