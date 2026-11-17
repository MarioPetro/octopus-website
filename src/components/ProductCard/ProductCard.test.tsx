import { render, screen } from "@testing-library/react";
import type { Product } from "@/types";
import { ProductCard } from ".";

const product: Product = {
  id: "p-007",
  slug: "outdoor-camera",
  name: "Octopus Outdoor Camera",
  category: "home-security",
  shortDescription: "An outdoor camera that runs on solar power and records in 3K",
  image: { src: "/images/products/outdoor-camera.png", alt: "Octopus Outdoor Camera, white" },
  bestSeller: false,
};

describe("ProductCard", () => {
  it("shows the product name as a level-3 heading and its short description", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByRole("heading", { level: 3, name: "Octopus Outdoor Camera" })).toBeInTheDocument();
    expect(screen.getByText(product.shortDescription)).toBeInTheDocument();
  });

  it("links to the product page, with the product name in the link's accessible name", () => {
    render(<ProductCard product={product} />);

    const link = screen.getByRole("link", { name: "Learn more about Octopus Outdoor Camera" });
    expect(link).toHaveAttribute("href", "/products/outdoor-camera");
    expect(link).toHaveTextContent("Learn more");
  });

  it("shows the packshot with its alt text", () => {
    render(<ProductCard product={product} />);

    expect(screen.getByRole("img", { name: "Octopus Outdoor Camera, white" })).toBeInTheDocument();
  });

  it("shows the category label only when one is given", () => {
    const { rerender } = render(<ProductCard product={product} />);
    expect(screen.queryByText("Home Security")).not.toBeInTheDocument();

    rerender(<ProductCard product={product} category="Home Security" />);
    expect(screen.getByText("Home Security")).toBeInTheDocument();
  });

  it("uses the tablet layout on desktop when no desktop layout is given", () => {
    const { container } = render(<ProductCard product={product} tabletLayout="horizontal" />);

    const card = container.querySelector("article");
    expect(card).toHaveClass("tablet:flex-row", "desktop:flex-row");
  });

  it("can switch layout between tablet and desktop", () => {
    const { container } = render(
      <ProductCard product={product} tabletLayout="horizontal" desktopLayout="vertical" />,
    );

    const card = container.querySelector("article");
    expect(card).toHaveClass("tablet:flex-row", "desktop:flex-col");
  });
});
