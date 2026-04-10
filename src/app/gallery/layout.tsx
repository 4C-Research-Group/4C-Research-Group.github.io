import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | 4C Research Group",
  description:
    "Photos from the lab, events, workshops, and community — highlights from the 4C Research Group.",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
