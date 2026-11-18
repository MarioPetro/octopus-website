import { render, screen } from "@testing-library/react";
import { PromoBanner } from ".";

const props = {
  title: "Octopus Ionic Hair Dryer",
  description: "Dry your hair faster and with less frizz with this powerful ionic hair dryer",
  cta: { label: "Learn more", href: "/products/ionic-hair-dryer" },
  image: {
    alt: "Woman drying her hair with the Octopus Ionic Hair Dryer",
    mobile: "/images/categories/hair-care-mobile.png",
    tablet: "/images/categories/hair-care-tablet.png",
    desktop: "/images/categories/hair-care-desktop.png",
  },
  background: "rgb(222 193 171)",
};

describe("PromoBanner", () => {
  it("shows the title as a level-2 heading and the description", () => {
    render(<PromoBanner {...props} />);

    expect(screen.getByRole("heading", { level: 2, name: props.title })).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  it("links to the promoted page", () => {
    render(<PromoBanner {...props} />);

    expect(screen.getByRole("link", { name: `Learn more about ${props.title}` })).toHaveAttribute("href", "/products/ionic-hair-dryer");
  });

  it("shows the photo with its alt text", () => {
    render(<PromoBanner {...props} />);

    expect(screen.getByRole("img", { name: props.image.alt })).toBeInTheDocument();
  });

  it("fills the area the photo does not cover with the given background", () => {
    render(<PromoBanner {...props} />);

    const picture = screen.getByRole("img", { name: props.image.alt }).closest("picture");
    const fill = picture?.parentElement?.parentElement?.parentElement;
    expect(fill).toHaveStyle({ background: "rgb(222 193 171)" });
  });
});
