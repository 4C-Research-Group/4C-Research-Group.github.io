import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | 4C Research Group",
  description:
    "Learn about the 4C Research Group mission, our team, and our focus on cognition, consciousness, and pediatric critical care.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
