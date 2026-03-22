"use client";

import Link from "next/link";
import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      subtitle="How we handle information when you visit the 4C Research Group website."
      lastUpdated="March 22, 2026"
    >
      <LegalSection title="Overview">
        <p>
          This policy describes how the 4C Research Group (“we,” “us”) treats
          information collected through this public website. It is intended
          for a general audience. If you participate in research, clinical
          care, or employment with our affiliated institutions, separate privacy
          notices may apply.
        </p>
      </LegalSection>

      <LegalSection title="Information we may collect">
        <p>
          Depending on how you use the site, we may process limited technical
          and contact information, including:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Usage data:</strong> such as
            pages viewed, approximate region (from IP), browser type, and
            timestamps—often collected automatically by hosting or analytics
            tools.
          </li>
          <li>
            <strong className="text-foreground">Information you send us:</strong>{" "}
            for example, if you email us or use a contact form, we receive the
            content of your message and your email address.
          </li>
          <li>
            <strong className="text-foreground">Newsletter or updates:</strong> if
            we offer a mailing list, we collect the address you provide so we
            can send communications you have requested.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use information">
        <p>We use this information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Operate, secure, and improve the website;</li>
          <li>Respond to inquiries you send us;</li>
          <li>Send updates you have opted into, where applicable;</li>
          <li>Comply with law and protect our legitimate interests.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Cookies and similar technologies">
        <p>
          The site may use cookies or similar technologies to remember
          preferences or measure traffic. You can control cookies through your
          browser settings. Some features may not work if you disable cookies.
        </p>
      </LegalSection>

      <LegalSection title="Sharing">
        <p>
          We do not sell your personal information. We may share data with
          service providers who host or support the site (under contractual
          safeguards), or when required by law.
        </p>
      </LegalSection>

      <LegalSection title="Retention">
        <p>
          We keep information only as long as needed for the purposes above,
          unless a longer period is required by law.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You may contact us to ask about the personal information we hold, to
          correct inaccuracies, or to withdraw consent where processing is
          consent-based, subject to legal exceptions.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          This site is not directed at children under 13 for the collection of
          their personal information. If you believe we have received such
          information in error, please contact us so we can delete it where
          appropriate.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy:{" "}
          <a href="mailto:rishi.ganesan@lhsc.on.ca">rishi.ganesan@lhsc.on.ca</a>
          , or via our{" "}
          <Link href="/contact/">contact page</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update this policy from time to time. The “Last updated” date
          at the top reflects the latest revision.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
