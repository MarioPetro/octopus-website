import { render, screen } from "@testing-library/react";
import { ProductInfo } from ".";

describe("ProductInfo", () => {
  it("shows the product as the page title, with its description, colours and Where to buy", () => {
    render(
      <ProductInfo
        name="Octopus Countertop Blender"
        description="A powerful blender."
        colours={[{ name: "Black", hex: "#1B1B1B" }]}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Octopus Countertop Blender" })).toBeInTheDocument();
    expect(screen.getByText("A powerful blender.")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Black" })).toBeChecked();
    expect(screen.getByRole("link", { name: "Where to buy" })).toHaveAttribute("href", "/where-to-buy");
  });
});
