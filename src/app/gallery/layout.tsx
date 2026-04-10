import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | 4C Research Group",
  description:
    "Photos from 4C research, knowledge mobilization, events, and lab life — cognition, consciousness, and pediatric critical care in pictures.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
