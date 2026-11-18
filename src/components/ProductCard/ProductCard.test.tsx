import { render, screen } from "@testing-library/react";
import type { FeatureImage } from "@/types";
import { ProductCard } from ".";

const content = {
  title: "Octopus Outdoor Camera",
  description: "An outdoor camera that runs on solar power and records in 3K",
  href: "/products/outdoor-camera",
};

const packshot = {
  src: "/images/products/outdoor-camera.png",
  alt: "Octopus Outdoor Camera, white",
};

const photo: FeatureImage = {
  alt: "Outdoor Camera on a garden wall",
  mobile: "/images/m.png",
  tablet: "/images/t.png",
  desktop: "/images/d.png",
};

const card = (container: HTMLElement) => container.querySelector("article");

describe("ProductCard", () => {
  it("shows the title as a level-3 heading and the description", () => {
    render(<ProductCard {...content} image={packshot} />);

    expect(screen.getByRole("heading", { level: 3, name: "Octopus Outdoor Camera" })).toBeInTheDocument();
    expect(screen.getByText(content.description)).toBeInTheDocument();
  });

  it("links to the given page, with the title in the link's accessible name", () => {
    render(<ProductCard {...content} image={packshot} />);

    const link = screen.getByRole("link", {
      name: "Learn more about Octopus Outdoor Camera",
    });
    expect(link).toHaveAttribute("href", "/products/outdoor-camera");
    expect(link).toHaveTextContent("Learn more");
  });

  it("shows the packshot with its alt text", () => {
    render(<ProductCard {...content} image={packshot} />);

    expect(screen.getByRole("img", { name: "Octopus Outdoor Camera, white" })).toBeInTheDocument();
  });

  it("shows the tag only when one is given", () => {
    const { rerender } = render(<ProductCard {...content} image={packshot} />);
    expect(screen.queryByText("Home Security")).not.toBeInTheDocument();

    rerender(<ProductCard {...content} image={packshot} tag="Home Security" />);
    expect(screen.getByText("Home Security")).toBeInTheDocument();
  });

  describe("textPosition", () => {
    it("puts the texts at the top by default, at every breakpoint", () => {
      const { container } = render(<ProductCard {...content} image={packshot} />);

      expect(card(container)).toHaveClass("flex-col", "tablet:flex-col", "desktop:flex-col");
    });

    it("applies a single value to every breakpoint", () => {
      const { container } = render(<ProductCard {...content} image={packshot} textPosition="left" />);

      expect(card(container)).toHaveClass("flex-row", "tablet:flex-row", "desktop:flex-row");
    });

    it("lets a missing breakpoint inherit the smaller one", () => {
      const { container } = render(
        <ProductCard {...content} image={packshot} textPosition={{ base: "top", tablet: "left" }} />,
      );

      expect(card(container)).toHaveClass("flex-col", "tablet:flex-row", "desktop:flex-row");
    });

    it("can change at every breakpoint", () => {
      const { container } = render(
        <ProductCard {...content} image={packshot} textPosition={{ base: "top", tablet: "left", desktop: "bottom" }} />,
      );

      expect(card(container)).toHaveClass("flex-col", "tablet:flex-row", "desktop:flex-col");
    });

    it("puts the packshot before the texts when they are at the bottom or on the right", () => {
      render(<ProductCard {...content} image={packshot} textPosition={{ base: "bottom", tablet: "right" }} />);

      const frame = screen.getByRole("img", {
        name: "Octopus Outdoor Camera, white",
      }).parentElement;
      expect(frame).toHaveClass("order-first", "tablet:order-first");
    });

    it("centres the texts at the top and aligns them left elsewhere", () => {
      render(<ProductCard {...content} image={packshot} textPosition={{ base: "top", tablet: "bottom" }} />);

      const body = screen.getByRole("heading", { level: 3 }).parentElement?.parentElement;
      expect(body).toHaveClass("text-center", "tablet:text-left");
    });
  });

  describe("with a cover photo", () => {
    it("fills the card with the photo, behind the texts", () => {
      render(<ProductCard {...content} cover image={photo} />);

      const img = screen.getByRole("img", {
        name: "Outdoor Camera on a garden wall",
      });
      expect(img.closest(".absolute.inset-0")).not.toBeNull();
    });

    it("can place the texts in the middle of the photo", () => {
      const { container } = render(<ProductCard {...content} cover image={photo} textPosition="center" />);

      expect(card(container)).toHaveClass("justify-center", "tablet:justify-center", "desktop:justify-center");
    });

    it("flips the photo when the data marks it as mirrored", () => {
      render(<ProductCard {...content} cover image={{ ...photo, mirrored: true }} />);

      const img = screen.getByRole("img", {
        name: "Outdoor Camera on a garden wall",
      });
      expect(img.closest(".-scale-x-100")).not.toBeNull();
    });
  });
});
