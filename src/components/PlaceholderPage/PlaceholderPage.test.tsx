import { render, screen } from "@testing-library/react";
import { placeholderMetadata, PlaceholderPage } from ".";

describe("PlaceholderPage", () => {
  it("names the requested page as the h1 and links back to the homepage", () => {
    render(<PlaceholderPage title="Where to buy" />);

    expect(screen.getByRole("heading", { level: 1, name: "Where to buy" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to the homepage" })).toHaveAttribute("href", "/");
  });

  it("keeps the page out of search results", () => {
    expect(placeholderMetadata("Contact us")).toEqual({ title: "Contact us", robots: { index: false } });
  });
});
