import { render, screen } from "@testing-library/react";
import { SectionHeading } from ".";

const props = {
  title: "Kitchen",
  description: "Powerful appliances for everyday cooking",
  cta: { label: "Explore all products", href: "/categories/kitchen" },
};

describe("SectionHeading", () => {
  it("renders the title as a level-2 heading", () => {
    render(<SectionHeading {...props} />);

    expect(screen.getByRole("heading", { level: 2, name: "Kitchen" })).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<SectionHeading {...props} />);

    expect(screen.getByText("Powerful appliances for everyday cooking")).toBeInTheDocument();
  });

  it("links the call to action to its page", () => {
    render(<SectionHeading {...props} />);

    expect(screen.getByRole("link", { name: "Explore all products" })).toHaveAttribute(
      "href",
      "/categories/kitchen",
    );
  });
});
