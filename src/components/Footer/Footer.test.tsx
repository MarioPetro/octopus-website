import { render, screen, within } from "@testing-library/react";
import type { Category } from "@/types";
import { Footer } from ".";

const CATEGORIES: Category[] = [
  { id: "c-1", slug: "kitchen", name: "Kitchen", description: "", image: { alt: "" } },
  { id: "c-2", slug: "hair-care", name: "Hair Care", description: "", image: { alt: "" } },
];

describe("Footer", () => {
  it("links to every category it receives, in order", () => {
    render(<Footer categories={CATEGORIES} />);

    const products = screen.getByRole("heading", { level: 2, name: "Our Products" }).nextElementSibling as HTMLElement;
    const links = within(products).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual(["Kitchen", "Hair Care"]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual(["/categories/kitchen", "/categories/hair-care"]);
  });

  it("groups the links in a navigation landmark named Footer", () => {
    render(<Footer categories={CATEGORIES} />);

    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(within(nav).getByRole("link", { name: "Where to buy" })).toHaveAttribute("href", "/where-to-buy");
    expect(within(nav).getByRole("link", { name: "Contact us" })).toHaveAttribute("href", "/contact");
  });

  it("links the logo to the homepage", () => {
    render(<Footer categories={CATEGORIES} />);

    expect(screen.getByRole("link", { name: "Octopus home" })).toHaveAttribute("href", "/");
  });

  it("shows the copyright and the policies link", () => {
    render(<Footer categories={CATEGORIES} />);

    expect(screen.getByText(/Copyright 2026 Octopus/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Policies & Terms" })).toHaveAttribute("href", "/policies");
  });
});
