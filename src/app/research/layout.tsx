import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research | 4C Research Group",
  description:
    "Research themes in neuroprognostication, ICU delirium, quantitative EEG, and pediatric critical care.",
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
