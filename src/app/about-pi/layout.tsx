import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About the PI | 4C Research Group",
  description:
    "Principal investigator profile — Dr. Saptharishi (Rishi) Ganesan: appointments, training, research, and selected publications.",
};

export default function AboutPiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
