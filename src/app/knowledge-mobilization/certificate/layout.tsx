import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate | Knowledge Mobilization",
  description:
    "Download or print your certificate after completing all modules, or a micro-credential track from the hub.",
};

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
