import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories } from "@/services";
import "./globals.css";

// Satoshi is served by the Fontshare CDN: its licence does not allow the font file
// to be redistributed through a repository, so it cannot be self-hosted from this repo.
// `satoshi@1` is the variable font (weights 300–900, needed for the 470 weight in Figma).
const FONTSHARE_CSS = "https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap";

export const metadata: Metadata = {
  title: {
    default: "Octopus",
    template: "%s | Octopus",
  },
  description:
    "Octopus consumer electronics for the kitchen, home security, hair care and everyday accessories.",
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
