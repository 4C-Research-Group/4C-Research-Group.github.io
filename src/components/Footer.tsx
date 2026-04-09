"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
  ];

  const linkClass =
    "text-[13px] font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground";

  const sectionTitleClass =
    "mb-4 text-sm font-semibold tracking-tight text-foreground";

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {/* Branding — matches Navbar lockup */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 sm:gap-3"
            >
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-black/5 sm:h-10 sm:w-10"
              />
              <div className="min-w-max shrink-0 text-left">
                <span className="block whitespace-nowrap text-[15px] font-semibold uppercase tracking-tight text-foreground sm:text-base">
                  <span className="text-brand">4C</span> Research
                </span>
                <span className="mt-0.5 block whitespace-nowrap text-[9px] font-medium uppercase leading-snug tracking-wider text-muted-foreground sm:text-[10px]">
                  Cognition · Consciousness · Critical Care
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Advancing research in cognition, consciousness, and critical care
              through innovative science and collaboration.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://x.com/Mission_FourC"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.researchgate.net/lab/4C-Foresee-Research-Group-Cognition-Consciousness-Critical-Care-Saptharishi-Lalgudi-Ganesan"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
                aria-label="ResearchGate"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={sectionTitleClass}>Quick links</h3>
            <ul className="space-y-2.5">
              {navItems.slice(0, 7).map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={sectionTitleClass}>More</h3>
            <ul className="space-y-2.5">
              {navItems.slice(7).map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className={linkClass}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className={sectionTitleClass}>Contact</h3>
            <address className="not-italic space-y-3">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  800 Commissioners Rd E
                  <br />
                  London, ON N6A 5W9
                  <br />
                  Canada
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <a
                  href="mailto:rishi.ganesan@lhsc.on.ca"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  rishi.ganesan@lhsc.on.ca
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <a
                  href="tel:+15196858000"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  +1 (519) 685-8500 Ext. 74702
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
            <p className="text-center text-xs text-muted-foreground sm:text-left sm:text-[13px]">
              © {currentYear}{" "}
              <span className="uppercase tracking-wide">4C Research Group</span>
              . All rights reserved.
            </p>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end"
              aria-label="Legal"
            >
              <Link href="/privacy-policy" className={linkClass}>
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className={linkClass}>
                Terms of Service
              </Link>
              <Link href="/accessibility" className={linkClass}>
                Accessibility
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
