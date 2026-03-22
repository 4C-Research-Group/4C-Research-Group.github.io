import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility | 4C Research Group",
  description:
    "Our commitment to an accessible website and how to request accommodations or report barriers.",
};

export default function AccessibilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
