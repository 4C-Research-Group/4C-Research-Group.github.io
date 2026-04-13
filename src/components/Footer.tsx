"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { FaResearchgate } from "react-icons/fa";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "About PI", href: "/about-pi" },
  { name: "Research", href: "/research" },
  { name: "Projects", href: "/projects" },
  { name: "Team", href: "/team" },
  { name: "Publications", href: "/publications" },
  { name: "Gallery", href: "/gallery" },
  { name: "Blog", href: "/blog" },
  { name: "Join 4C Lab", href: "/join-4c-lab" },
  { name: "Contact", href: "/contact" },
  { name: "Collaborate", href: "/collaborate" },
  { name: "Knowledge Mobilization", href: "/knowledge-mobilization" },
] as const;

const socials = [
  {
    href: "https://x.com/Mission_FourC",
    label: "Twitter",
    Icon: Twitter,
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    Icon: Linkedin,
  },
  {
    href: "https://github.com",
    label: "GitHub",
    Icon: Github,
  },
  {
    href: "https://www.researchgate.net/lab/4C-Foresee-Research-Group-Cognition-Consciousness-Critical-Care-Saptharishi-Lalgudi-Ganesan",
    label: "ResearchGate",
    Icon: FaResearchgate,
  },
] as const;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border/60 bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand/70 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-muted/50 via-transparent to-muted/30"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] mask-[linear-gradient(180deg,black,transparent_75%)] bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-cognition/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-0 h-80 w-80 rounded-full bg-consciousness/8 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
          {/* Brand */}
          <div className="space-y-6 lg:col-span-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-2xl outline-none ring-offset-background transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
            >
              <span className="relative">
                <span className="absolute -inset-1 rounded-2xl bg-linear-to-br from-cognition/20 via-brand/15 to-care/20 opacity-0 blur-md transition group-hover:opacity-100" />
                <Image
                  src="/logo.png"
                  alt="4C Research Group logo"
                  loading="eager"
                  width={44}
                  height={44}
                  className="relative h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm ring-1 ring-border/80"
                />
              </span>
              <div className="min-w-0 text-left">
                <span className="block text-base font-semibold uppercase tracking-tight">
                  <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                    4C Research
                  </span>
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold uppercase leading-snug tracking-widest text-muted-foreground/90">
                  Cognition · Consciousness · Critical Care
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
              Advancing research in cognition, consciousness, and critical care
              through rigorous science and open collaboration.
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-card/60 text-muted-foreground shadow-sm backdrop-blur-sm transition hover:border-brand/35 hover:bg-brand/[0.06] hover:text-brand"
                  aria-label={label}
                >
                  <Icon
                    className={
                      label === "ResearchGate"
                        ? "h-[18px] w-[18px]"
                        : "h-4 w-4"
                    }
                    aria-hidden
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Site links */}
          <div className="lg:col-span-5">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 max-w-8 bg-linear-to-r from-brand/50 to-transparent" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Explore
              </h2>
            </div>
            <nav aria-label="Footer">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 sm:gap-y-0.5">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-0.5 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                      <span className="relative">
                        {item.name}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-linear-to-r from-brand to-care transition-all duration-300 group-hover:w-full" />
                      </span>
                      <ArrowUpRight
                        className="h-3 w-3 shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <div className="mb-5 flex items-center gap-3 lg:justify-end">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground lg:order-2">
                Contact
              </h2>
              <span className="h-px flex-1 bg-linear-to-l from-care/40 to-transparent lg:order-1 lg:max-w-12" />
            </div>
            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-md">
              <address className="not-italic space-y-4">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cognition/10 text-cognition">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    800 Commissioners Rd E
                    <br />
                    London, ON N6A 5W9
                    <br />
                    Canada
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-consciousness/10 text-consciousness">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  <a
                    href="mailto:rishi.ganesan@lhsc.on.ca"
                    className="text-sm font-medium text-foreground/90 underline decoration-border underline-offset-4 transition hover:text-brand hover:decoration-brand/40"
                  >
                    rishi.ganesan@lhsc.on.ca
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-care/10 text-care">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  <a
                    href="tel:+15196858000"
                    className="text-sm font-medium text-foreground/90 underline decoration-border underline-offset-4 transition hover:text-brand hover:decoration-brand/40"
                  >
                    +1 (519) 685-8500 Ext. 74702
                  </a>
                </div>
              </address>
              <Link
                href="/contact"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:bg-brand/[0.06] hover:text-brand"
              >
                Message the lab
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 sm:flex-row sm:gap-4">
          <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-sm">
            © {currentYear}{" "}
            <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text font-semibold uppercase tracking-wide text-transparent">
              4C Research Group
            </span>
            <span className="text-muted-foreground">. All rights reserved.</span>
          </p>
          <nav
            className="flex flex-wrap items-center justify-center gap-2 sm:justify-end"
            aria-label="Legal"
          >
            {(
              [
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Service", "/terms-of-service"],
                ["Accessibility", "/accessibility"],
              ] as const
            ).map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full border border-transparent px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border hover:bg-muted/50 hover:text-foreground sm:text-sm"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
