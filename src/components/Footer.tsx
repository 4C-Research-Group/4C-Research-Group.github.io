"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Research", href: "/research" },
    { name: "Team", href: "/team" },
    { name: "Publications", href: "/publications" },
    { name: "Collaborate", href: "/collaborate" },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Branding */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-3"
            >
              <img src="/logo.png" alt="4C Research Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold bg-linear-to-r from-brand to-consciousness bg-clip-text text-transparent">
                4C RESEARCH
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm text-muted-foreground"
            >
              Advancing research in cognition, consciousness, and critical care
              through innovative science and collaboration.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex space-x-4 pt-2"
            >
              <a
                href="https://x.com/Mission_FourC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-brand transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navItems.slice(0, 4).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-brand transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-brand mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  800 Commissioners Rd E<br />
                  London, ON N6A 5W9<br />
                  Canada
                </span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-brand mr-3" />
                <a
                  href="mailto:rishi.ganesan@lhsc.on.ca"
                  className="text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  rishi.ganesan@lhsc.on.ca
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-brand mr-3" />
                <a
                  href="tel:+15196858000"
                  className="text-sm text-muted-foreground hover:text-brand transition-colors"
                >
                  +1 (519) 685-8500 Ext. 74702
                </a>
              </div>
            </address>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest research updates and news.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-brand focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-brand hover:bg-brand-deep focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand transition-colors"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} 4C Research Group. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
