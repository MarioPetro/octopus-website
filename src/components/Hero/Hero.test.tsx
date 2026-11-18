import { render, screen } from "@testing-library/react";
import { Hero } from ".";

const PROPS = {
  title: "Octopus Ionic Hair Dryer",
  description: "A powerful ionic hair dryer",
  cta: { label: "Learn more", href: "/products/ionic-hair-dryer" },
};

describe("Hero", () => {
  it("shows the title as the page's h1", () => {
    render(<Hero {...PROPS} />);

    expect(screen.getByRole("heading", { level: 1, name: "Octopus Ionic Hair Dryer" })).toBeInTheDocument();
  });

  it("is a region named by its title", () => {
    render(<Hero {...PROPS} />);

    expect(screen.getByRole("region", { name: "Octopus Ionic Hair Dryer" })).toBeInTheDocument();
  });

  it("shows the description and links the call to action", () => {
    render(<Hero {...PROPS} />);

    expect(screen.getByText("A powerful ionic hair dryer")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Learn more about Octopus Ionic Hair Dryer" })).toHaveAttribute("href", "/products/ionic-hair-dryer");
  });
});
