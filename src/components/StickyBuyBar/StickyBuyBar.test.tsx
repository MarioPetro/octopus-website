import { render, screen } from "@testing-library/react";
import { StickyBuyBar } from ".";

describe("StickyBuyBar", () => {
  it("links to Where to buy and marks itself for the footer spacing", () => {
    const { container } = render(<StickyBuyBar />);

    expect(screen.getByRole("link", { name: "Where to buy" })).toHaveAttribute("href", "/where-to-buy");
    expect(container.querySelector("[data-buy-bar]")).toBeInTheDocument();
  });
});
