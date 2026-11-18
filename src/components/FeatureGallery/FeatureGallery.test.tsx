import { render, screen, within } from "@testing-library/react";
import { FeatureGallery } from ".";

const features = ["Powers through", "Skip the scrubbing", "Short bursts", "Presets"].map((title) => ({
  title,
  description: `${title} description`,
  image: { alt: `${title} photo` },
}));

describe("FeatureGallery", () => {
  it("shows every feature with its title, description and photo", () => {
    render(<FeatureGallery features={features} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(within(items[1]).getByRole("heading", { level: 3, name: "Skip the scrubbing" })).toBeInTheDocument();
    expect(within(items[1]).getByText("Skip the scrubbing description")).toBeInTheDocument();
    expect(within(items[1]).getByRole("img", { name: "Skip the scrubbing photo" })).toBeInTheDocument();
  });

  it("keeps the heading levels in order with a hidden section title", () => {
    render(<FeatureGallery features={features} />);

    expect(screen.getByRole("region", { name: "Features" })).toBeInTheDocument();
  });

  it("makes every third card wide on desktop, starting with the first", () => {
    render(<FeatureGallery features={features} />);

    const wide = screen.getAllByRole("listitem").map((item) => item.className.includes("desktop:col-span-2"));
    expect(wide).toEqual([true, false, false, true]);
  });

  it("renders nothing without features", () => {
    const { container } = render(<FeatureGallery features={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
