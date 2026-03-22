"use client";

import Link from "next/link";
import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";

export default function TermsOfServicePage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      subtitle="Rules for using this website and limitations that apply to site content."
      lastUpdated="March 22, 2026"
    >
      <LegalSection title="Agreement">
        <p>
          By accessing or using the 4C Research Group website, you agree to
          these terms. If you do not agree, please do not use the site.
        </p>
      </LegalSection>

      <LegalSection title="Permitted use">
        <p>
          You may use the site for lawful, non-commercial informational purposes
          unless we give written permission otherwise. You agree not to misuse
          the site (for example, by attempting to disrupt service, scrape
          content in violation of these terms, or infringe others’ rights).
        </p>
      </LegalSection>

      <LegalSection title="Not medical advice">
        <p>
          Content on this site is for general information about our research and
          team. It is{" "}
          <strong className="text-foreground">not medical advice</strong>, a
          substitute for professional judgment, or an invitation to
          self-diagnose or self-treat. Always seek advice from a qualified
          clinician for health decisions.
        </p>
      </LegalSection>

      <LegalSection title="Research and recruitment">
        <p>
          Descriptions of studies are summaries only. Eligibility, risks, and
          procedures are explained in approved consent and study materials.
          Nothing on this site replaces those documents or institutional
          oversight.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          Text, graphics, logos, and other materials on this site are owned by
          the 4C Research Group or its licensors unless otherwise noted. You may
          not copy, modify, or distribute them without permission, except as
          allowed by law (such as fair dealing or fair use).
        </p>
      </LegalSection>

      <LegalSection title="Third-party links">
        <p>
          The site may link to external websites. We are not responsible for
          their content, availability, or practices. Use of third-party sites is
          at your own risk.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          The site and its content are provided “as is” and “as available.” To
          the fullest extent permitted by law, we disclaim warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that the site will be uninterrupted
          or error-free.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by applicable law, the 4C Research
          Group and its affiliates will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or for loss
          of profits or data, arising from your use of the site.
        </p>
      </LegalSection>

      <LegalSection title="Indemnity">
        <p>
          You agree to indemnify and hold harmless the 4C Research Group from
          claims arising out of your violation of these terms or misuse of the
          site, to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="Governing law">
        <p>
          These terms are governed by the laws applicable in the Province of
          Ontario, Canada, without regard to conflict-of-law rules. Courts in
          Ontario may have exclusive jurisdiction, subject to mandatory consumer
          protections where they apply.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions:{" "}
          <a href="mailto:rishi.ganesan@lhsc.on.ca">rishi.ganesan@lhsc.on.ca</a>{" "}
          or the{" "}
          <Link href="/contact/">contact page</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms. Continued use after changes constitutes
          acceptance of the revised terms. Check the “Last updated” date above.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
