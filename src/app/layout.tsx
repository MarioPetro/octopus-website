import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories } from "@/services";
import "./globals.css";
import { baseOpenGraph } from "./shared-metadata";

// Satoshi's licence does not allow redistributing the file, so it comes from the Fontshare CDN.
// The variable font is needed for Figma's 470 weight.
const FONTSHARE_CSS = "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap";

const DESCRIPTION = "Octopus consumer electronics for the kitchen, home security, hair care and everyday accessories.";

// Open Graph needs absolute URLs.
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Octopus",
    template: "%s | Octopus",
  },
  description: DESCRIPTION,
  openGraph: {
    ...baseOpenGraph,
    url: "/",
    title: "Octopus",
    description: DESCRIPTION,
    images: [
      {
        url: "/images/og/home.jpg",
        width: 1200,
        height: 630,
        alt: "Woman drying her hair with the Octopus Ionic Hair Dryer",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const categories = await getCategories();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTSHARE_CSS} />
      </head>
      {/* A column at least as tall as the screen: the footer's mt-auto keeps it at the bottom of short pages. */}
      <body className="flex min-h-dvh flex-col">
        <Header categories={categories} />
        {children}
        <Footer categories={categories} />
      </body>
    </html>
  );
}
