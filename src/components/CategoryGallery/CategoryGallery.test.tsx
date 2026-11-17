import { render, screen, within } from "@testing-library/react";
import type { Category, Product } from "@/types";
import { CategoryGallery } from ".";

const category: Category = {
  id: "c-001",
  slug: "kitchen",
  name: "Kitchen",
  description: "Powerful appliances for everyday cooking",
  image: { src: "/images/products/blender.png", alt: "" },
};

const product = (slug: string, name: string): Product => ({
  id: slug,
  slug,
  name,
  category: "kitchen",
  shortDescription: `${name} description`,
  image: { src: `/images/products/${slug}.png`, alt: name },
  bestSeller: false,
});

const products = [
  product("kettle", "Octopus Kettle"),
  product("blender", "Octopus Blender"),
  product("countertop-blender", "Octopus Countertop Blender"),
  product("air-fryer", "Octopus Air Fryer"),
];

describe("CategoryGallery", () => {
  it("shows the category as the section heading, with a link to the category page", () => {
    render(<CategoryGallery category={category} products={products} layout="feature-wide" />);

    expect(screen.getByRole("heading", { level: 2, name: "Kitchen" })).toBeInTheDocument();
    expect(screen.getByText(category.description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore all products" })).toHaveAttribute(
      "href",
      "/categories/kitchen",
    );
  });

  it("shows only the first three products, in the given order", () => {
    render(<CategoryGallery category={category} products={products} layout="row" />);

    const items = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(items.map((item) => within(item).getByRole("heading", { level: 3 }).textContent)).toEqual([
      "Octopus Kettle",
      "Octopus Blender",
      "Octopus Countertop Blender",
    ]);
  });

  it("gives the first card the wide position in the feature-wide layout", () => {
    render(<CategoryGallery category={category} products={products} layout="feature-wide" />);

    const [first, second] = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(first).toHaveClass("tablet:col-span-2");
    expect(second).not.toHaveClass("tablet:col-span-2");
  });
});
