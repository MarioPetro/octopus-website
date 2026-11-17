import { render, screen } from "@testing-library/react";
import { StoreBanner } from ".";

describe("StoreBanner", () => {
  it("names the shop in a level-2 heading", () => {
    render(<StoreBanner />);

    expect(screen.getByRole("heading", { level: 2, name: "Find us at The Warehouse" })).toBeInTheDocument();
  });

  it("links to the store finder", () => {
    render(<StoreBanner />);

    expect(screen.getByRole("link", { name: "Find your nearest store" })).toHaveAttribute("href", "/where-to-buy");
  });

  it("keeps the decorative photo out of the accessibility tree", () => {
    render(<StoreBanner />);

    // An empty alt makes the image presentational, so it is not exposed as an image.
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
