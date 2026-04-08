import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppChrome from "@/components/AppChrome";
import Head from "./head";
import { siteAsset } from "@/lib/site-path";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "4C Research Group - Advancing Research in Cognition, Consciousness & Critical Care",
  description:
    "Advancing the detection and prediction of brain pathologies in critically ill patients through cutting-edge neuroimaging and machine learning technologies.",
  icons: {
    icon: siteAsset("/favicon.ico"),
    shortcut: siteAsset("/favicon.ico"),
    apple: [
      {
        url: siteAsset("/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  manifest: siteAsset("/site.webmanifest"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0284C7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <Head />
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
