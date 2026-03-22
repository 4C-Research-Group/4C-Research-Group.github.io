"use client";

import Link from "next/link";
import LegalPageShell, { LegalSection } from "@/components/LegalPageShell";

export default function AccessibilityPage() {
  return (
    <LegalPageShell
      title="Accessibility"
      subtitle="We aim to make our website usable for people with diverse abilities."
      lastUpdated="March 22, 2026"
    >
      <LegalSection title="Our commitment">
        <p>
          The 4C Research Group is committed to improving digital access to
          information about our research, team, and collaborations. We work toward
          conformance with the Web Content Accessibility Guidelines (WCAG) 2.1
          Level AA as a practical target, recognizing that accessibility is an
          ongoing effort.
        </p>
      </LegalSection>

      <LegalSection title="What we do">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Use semantic structure (headings, landmarks) where we control the
            markup.
          </li>
          <li>
            Provide text alternatives for meaningful images and labels for
            interactive controls where implemented.
          </li>
          <li>
            Consider colour contrast and readable typography in our design
            system.
          </li>
          <li>
            Test pages with keyboard navigation and common assistive
            technologies when we make substantive updates.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Known limitations">
        <p>
          Some content may be provided by third parties (embedded maps, external
          PDFs, or social links). We cannot always control the accessibility of
          those experiences. If you encounter a barrier, tell us and we will try
          to offer an alternative format or route to the same information.
        </p>
      </LegalSection>

      <LegalSection title="Feedback and requests">
        <p>
          We welcome feedback on accessibility. Please email{" "}
          <a href="mailto:rishi.ganesan@lhsc.on.ca">rishi.ganesan@lhsc.on.ca</a>{" "}
          with the page URL, a short description of the issue, and your browser
          or assistive technology if known. You can also reach us through the{" "}
          <Link href="/contact/">contact page</Link>.
        </p>
        <p>
          We will respond as promptly as we can and work with you on reasonable
          accommodations for accessing our public information.
        </p>
      </LegalSection>

      <LegalSection title="Formal complaints">
        <p>
          If you are not satisfied with our response, you may follow procedures
          offered by our affiliated institutions or applicable regulators in
          your jurisdiction.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
