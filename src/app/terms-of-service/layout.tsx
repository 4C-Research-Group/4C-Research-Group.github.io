import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | 4C Research Group",
  description:
    "Terms governing use of the 4C Research Group website and important disclaimers.",
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
