import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team | 4C Research Group",
  description:
    "Meet the 4C Research Group — principal investigator, students, and staff advancing pediatric critical care research.",
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
