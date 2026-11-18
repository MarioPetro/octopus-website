import { render, screen, within } from "@testing-library/react";
import type { Category } from "@/types";
import { CategoryExplorer } from ".";

const categories: Category[] = [
  {
    id: "c-001",
    slug: "kitchen",
    name: "Kitchen",
    description: "Powerful appliances for everyday cooking",
    image: { src: "/images/products/blender.png", alt: "" },
  },
  {
    id: "c-002",
    slug: "home-security",
    name: "Home Security",
    description: "Home feels safer when you're always in the loop",
    image: { src: "/images/products/indoor-camera.png", alt: "" },
  },
];

describe("CategoryExplorer", () => {
  it("is a section named by its heading", () => {
    render(<CategoryExplorer categories={categories} />);

    expect(screen.getByRole("region", { name: "Explore all categories" })).toBeInTheDocument();
  });

  it("links each category to its page, named by the category", () => {
    render(<CategoryExplorer categories={categories} />);

    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Kitchen" })).toHaveAttribute("href", "/categories/kitchen");
    expect(screen.getByRole("link", { name: "Home Security" })).toHaveAttribute(
      "href",
      "/categories/home-security",
    );
  });

  it("keeps the decorative packshots out of the accessibility tree", () => {
    render(<CategoryExplorer categories={categories} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
