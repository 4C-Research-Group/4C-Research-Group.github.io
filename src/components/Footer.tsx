"use client";

import type { CSSProperties } from "react";
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

  /** Always dark footer with site brand colors (cognition / consciousness / care) in the gradient. */
  const linkClass =
    "text-[13px] font-medium tracking-tight text-zinc-400 transition-colors hover:text-brand";

  const sectionTitleClass =
    "mb-4 text-sm font-semibold tracking-tight text-zinc-100";

  const brandMeshStyle: CSSProperties = {
    backgroundImage: [
      "radial-gradient(ellipse 110% 90% at 0% 100%, color-mix(in srgb, var(--cognition) 58%, transparent), transparent 55%)",
      "radial-gradient(ellipse 100% 80% at 100% 0%, color-mix(in srgb, var(--consciousness) 52%, transparent), transparent 52%)",
      "radial-gradient(ellipse 85% 65% at 50% 100%, color-mix(in srgb, var(--care) 48%, transparent), transparent 50%)",
      "radial-gradient(ellipse 60% 50% at 40% 20%, color-mix(in srgb, var(--brand-default) 22%, transparent), transparent 60%)",
    ].join(", "),
    opacity: 0.92,
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-900 text-zinc-100">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-900 to-[rgb(15,23,42)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={brandMeshStyle}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-900/35 to-slate-900/50"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-cognition via-consciousness to-care opacity-90"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
          {/* Branding — matches Navbar lockup */}
          <div className="space-y-4">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 sm:gap-3"
            >
              <Image
                src="/logo.png"
                alt="4C Research Group logo"
                loading="eager"
                width={40}
                height={40}
                className="h-9 w-9 shrink-0 rounded-lg object-cover ring-1 ring-white/10 sm:h-10 sm:w-10"
              />
              <div className="min-w-max shrink-0 text-left">
                <span className="block whitespace-nowrap text-[15px] font-semibold uppercase tracking-tight sm:text-base">
                  <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                    4C Research
                  </span>
                </span>
                <span className="mt-0.5 block whitespace-nowrap text-[9px] font-medium uppercase leading-snug tracking-wider sm:text-[10px]">
                  <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text text-transparent">
                    Cognition · Consciousness · Critical Care
                  </span>
                </span>
              </div>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-zinc-400">
              Advancing research in cognition, consciousness, and critical care
              through innovative science and collaboration.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://x.com/Mission_FourC"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-brand"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-brand"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-brand"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://www.researchgate.net/lab/4C-Foresee-Research-Group-Cognition-Consciousness-Critical-Care-Saptharishi-Lalgudi-Ganesan"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-brand"
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
                  className="mt-0.5 h-4 w-4 shrink-0 text-cognition/80"
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-zinc-400">
                  800 Commissioners Rd E
                  <br />
                  London, ON N6A 5W9
                  <br />
                  Canada
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-consciousness/80"
                  aria-hidden
                />
                <a
                  href="mailto:rishi.ganesan@lhsc.on.ca"
                  className="text-sm text-zinc-400 transition-colors hover:text-brand"
                >
                  rishi.ganesan@lhsc.on.ca
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-care/80"
                  aria-hidden
                />
                <a
                  href="tel:+15196858000"
                  className="text-sm text-zinc-400 transition-colors hover:text-brand"
                >
                  +1 (519) 685-8500 Ext. 74702
                </a>
              </div>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
            <p className="text-center text-xs text-zinc-500 sm:text-left sm:text-[13px]">
              © {currentYear}{" "}
              <span className="bg-linear-to-r from-cognition via-consciousness to-care bg-clip-text font-medium uppercase tracking-wide text-transparent">
                4C Research Group
              </span>
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
