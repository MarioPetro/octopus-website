import { render, screen } from "@testing-library/react";
import { ProductTile } from ".";

const image = { src: "/images/products/air-fryer.png", alt: "Octopus Air Fryer" };

describe("ProductTile", () => {
  it("is one link named by the title, with the description as its description", () => {
    render(
      <ProductTile
        variant="product"
        title="Octopus Air Fryer"
        description="Cooks a full family meal"
        href="/products/air-fryer"
        image={image}
        imageSizes="264px"
      />,
    );

    const link = screen.getByRole("link", { name: "Octopus Air Fryer" });
    expect(link).toHaveAttribute("href", "/products/air-fryer");
    expect(link).toHaveAccessibleDescription("Cooks a full family meal");
    expect(screen.getByRole("heading", { level: 3, name: "Octopus Air Fryer" })).toBeInTheDocument();
  });

  it("keeps the packshot decorative, since the title already names the link", () => {
    render(<ProductTile variant="product" title="Octopus Air Fryer" href="/" image={image} imageSizes="264px" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("shows a category as a name, not a heading", () => {
    render(<ProductTile variant="category" title="Kitchen" href="/categories/kitchen" image={image} imageSizes="25vw" />);

    expect(screen.getByRole("link", { name: "Kitchen" })).toBeInTheDocument();
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
