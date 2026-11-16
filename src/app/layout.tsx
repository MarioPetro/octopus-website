import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Octopus",
    template: "%s | Octopus",
  },
  description:
    "Octopus consumer electronics for the kitchen, home security, hair care and everyday accessories.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
