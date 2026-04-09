import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | 4C Research Group",
  description:
    "News, updates, and highlights from the 4C Research Group.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
