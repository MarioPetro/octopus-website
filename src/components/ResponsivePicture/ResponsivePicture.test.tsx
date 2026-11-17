import { render, screen } from "@testing-library/react";
import { MEDIA } from "@/utils/breakpoints";
import { ResponsivePicture } from ".";

const image = {
  alt: "Woman drying her hair",
  mobile: "/images/categories/hair-care-mobile.png",
  tablet: "/images/categories/hair-care-tablet.png",
  desktop: "/images/categories/hair-care-desktop.png",
};

describe("ResponsivePicture", () => {
  it("offers one source per breakpoint, desktop first", () => {
    const { container } = render(<ResponsivePicture image={image} />);

    const sources = container.querySelectorAll("picture > source");
    expect([...sources].map((source) => source.getAttribute("media"))).toEqual([
      MEDIA.desktop,
      MEDIA.tablet,
    ]);
    expect(sources[0].getAttribute("srcset")).toContain(encodeURIComponent(image.desktop));
    expect(sources[1].getAttribute("srcset")).toContain(encodeURIComponent(image.tablet));
  });

  it("uses the mobile image as the fallback <img>, with the alt text", () => {
    render(<ResponsivePicture image={image} />);

    const img = screen.getByRole("img", { name: "Woman drying her hair" });
    expect(img.getAttribute("srcset")).toContain(encodeURIComponent(image.mobile));
  });

  it("is lazy-loaded by default", () => {
    render(<ResponsivePicture image={image} />);

    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
  });

  it("loads eagerly with high priority when it is the LCP image", () => {
    render(<ResponsivePicture image={image} preload />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "eager");
    expect(img).toHaveAttribute("fetchpriority", "high");
  });
});
