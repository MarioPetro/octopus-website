import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Category, Product } from "@/types";
import { BestSellersCarousel } from ".";

const categories: Category[] = [
  { id: "c-001", slug: "kitchen", name: "Kitchen", description: "", image: { alt: "" } },
  { id: "c-002", slug: "home-security", name: "Home Security", description: "", image: { alt: "" } },
];

const product = (slug: string, name: string, category: Product["category"]): Product => ({
  id: slug,
  slug,
  name,
  category,
  shortDescription: `${name} description`,
  image: { src: `/images/products/${slug}.png`, alt: name },
  bestSeller: true,
});

const products = [
  product("air-fryer", "Octopus Air Fryer", "kitchen"),
  product("indoor-camera", "Octopus Indoor Camera", "home-security"),
  product("kettle", "Octopus Kettle", "kitchen"),
];

/**
 * jsdom does no layout, so scroll sizes are always 0. This gives the row a size: 3 cards of
 * 1000px in a 1000px window, scrolled to `scrollLeft`.
 */
function setScroll(list: HTMLElement, scrollLeft: number) {
  Object.defineProperty(list, "scrollWidth", { configurable: true, value: 3000 });
  Object.defineProperty(list, "clientWidth", { configurable: true, value: 1000 });
  Object.defineProperty(list, "scrollLeft", { configurable: true, value: scrollLeft });
  fireEvent.scroll(list);
}

function renderCarousel() {
  render(<BestSellersCarousel products={products} categories={categories} />);
  const list = screen.getByRole("list");
  return {
    list,
    prev: screen.getByRole("button", { name: "Previous product" }),
    next: screen.getByRole("button", { name: "Next product" }),
  };
}

describe("BestSellersCarousel", () => {
  it("is a section named by its 'Best sellers' heading", () => {
    renderCarousel();

    expect(screen.getByRole("region", { name: "Best sellers" })).toBeInTheDocument();
  });

  it("shows every product with its category name", () => {
    const { list } = renderCarousel();

    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(within(items[1]).getByText("Home Security")).toBeInTheDocument();
    expect(within(items[1]).getByRole("heading", { name: "Octopus Indoor Camera" })).toBeInTheDocument();
  });

  it("disables the previous arrow on the first product", () => {
    const { list, prev, next } = renderCarousel();
    setScroll(list, 0);

    expect(prev).toBeDisabled();
    expect(next).toBeEnabled();
  });

  it("enables both arrows in the middle of the row", () => {
    const { list, prev, next } = renderCarousel();
    setScroll(list, 1000);

    expect(prev).toBeEnabled();
    expect(next).toBeEnabled();
  });

  it("disables the next arrow on the last product", () => {
    const { list, prev, next } = renderCarousel();
    setScroll(list, 2000);

    expect(prev).toBeEnabled();
    expect(next).toBeDisabled();
  });

  describe("arrow clicks", () => {
    // jsdom has neither layout nor matchMedia: give the first card a width and fake the
    // "reduce motion" preference.
    function setUp(reduceMotion = false) {
      window.matchMedia = vi.fn().mockReturnValue({ matches: reduceMotion });
      const carousel = renderCarousel();
      const firstCard = within(carousel.list).getAllByRole("listitem")[0];
      firstCard.getBoundingClientRect = () => ({ width: 1000 }) as DOMRect;
      const scrollBy = vi.fn();
      carousel.list.scrollBy = scrollBy;
      setScroll(carousel.list, 1000);
      return { ...carousel, scrollBy };
    }

    it("scroll by one card forward and back, smoothly", async () => {
      const { prev, next, scrollBy } = setUp();

      await userEvent.click(next);
      await userEvent.click(prev);

      expect(scrollBy).toHaveBeenNthCalledWith(1, { left: 1000, behavior: "smooth" });
      expect(scrollBy).toHaveBeenNthCalledWith(2, { left: -1000, behavior: "smooth" });
    });

    it("scroll without animation when the user prefers reduced motion", async () => {
      const { next, scrollBy } = setUp(true);

      await userEvent.click(next);

      expect(scrollBy).toHaveBeenCalledWith({ left: 1000, behavior: "auto" });
    });
  });
});
