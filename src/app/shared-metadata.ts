import type { Metadata } from "next";

// Metadata merges shallowly: a page that sets `openGraph` replaces the layout's whole object,
// so the fields every page shares live here and each page spreads them.
export const baseOpenGraph = {
  type: "website",
  siteName: "Octopus",
  locale: "en_GB",
} satisfies Metadata["openGraph"];
