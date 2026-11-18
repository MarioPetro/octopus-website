import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories } from "@/services";
import "./globals.css";

// Satoshi is served by the Fontshare CDN: its licence does not allow the font file
// to be redistributed through a repository, so it cannot be self-hosted from this repo.
// `satoshi@1` is the variable font (weights 300–900, needed for the 470 weight in Figma).
const FONTSHARE_CSS = "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap";

const DESCRIPTION = "Octopus consumer electronics for the kitchen, home security, hair care and everyday accessories.";

// Open Graph needs absolute URLs. On Vercel the production domain comes from its system
// environment variable; locally the dev server's address is enough.
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
  // Defaults for every page (the homepage uses them as they are). Next merges metadata shallowly,
  // so a page that sets its own `openGraph` (the product page) must repeat all of its fields.
  openGraph: {
    type: "website",
    siteName: "Octopus",
    locale: "en_GB",
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
  // The header and the footer are on every page, so the layout loads the categories once for both.
  const categories = await getCategories();

  return (
    <html lang="en">
      <head>
        {/* Open the connections early: the CSS comes from api.*, the font file from cdn.* */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTSHARE_CSS} />
      </head>
      <body>
        <Header categories={categories} />
        {children}
        <Footer categories={categories} />
      </body>
    </html>
  );
}
