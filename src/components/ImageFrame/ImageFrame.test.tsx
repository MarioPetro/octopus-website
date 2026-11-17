import { render, screen } from "@testing-library/react";
import { ImageFrame } from ".";

describe("ImageFrame", () => {
  it("renders the image with its alt text, lazy-loaded by default", () => {
    render(
      <ImageFrame
        image={{ src: "/images/products/kettle.png", alt: "Octopus Kettle" }}
        sizes="100vw"
        className="aspect-square"
      />,
    );

    const img = screen.getByRole("img", { name: "Octopus Kettle" });
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("sizes", "100vw");
  });

  it("loads the image eagerly when preloaded (LCP image)", () => {
    render(
      <ImageFrame image={{ src: "/images/products/kettle.png", alt: "Octopus Kettle" }} sizes="100vw" preload />,
    );

    expect(screen.getByRole("img", { name: "Octopus Kettle" })).not.toHaveAttribute("loading", "lazy");
  });

  it("applies the frame size from className, so space is reserved before loading", () => {
    const { container } = render(
      <ImageFrame image={{ src: "/x.png", alt: "x" }} sizes="100vw" className="aspect-square" />,
    );

    expect(container.firstChild).toHaveClass("relative", "aspect-square");
  });

  it("shows a placeholder that keeps the description when the image is missing", () => {
    render(<ImageFrame image={{ alt: "Blender on a kitchen counter" }} sizes="100vw" />);

    expect(screen.getByRole("img", { name: "Blender on a kitchen counter" })).toHaveAttribute(
      "data-placeholder",
    );
  });

  it("hides a decorative placeholder from screen readers", () => {
    render(<ImageFrame image={{ alt: "" }} sizes="100vw" />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
