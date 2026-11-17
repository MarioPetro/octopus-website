import { render, screen } from "@testing-library/react";
import { Heading } from ".";

const props = {
  title: "Kitchen",
  description: "Powerful appliances for everyday cooking",
  cta: { label: "Explore all products", href: "/categories/kitchen" },
};

describe("Heading", () => {
  it("renders the title as a level-2 heading", () => {
    render(<Heading {...props} />);

    expect(screen.getByRole("heading", { level: 2, name: "Kitchen" })).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Heading {...props} />);

    expect(screen.getByText("Powerful appliances for everyday cooking")).toBeInTheDocument();
  });

  it("links the call to action to its page", () => {
    render(<Heading {...props} />);

    expect(screen.getByRole("link", { name: "Explore all products" })).toHaveAttribute(
      "href",
      "/categories/kitchen",
    );
  });
});
