import { type PackshotTextPosition, ProductCard, type Responsive } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Category, Product } from "@/types";

/**
 * How the three cards are arranged from tablet up (on mobile they are always one column):
 * - `feature-wide`: a wide first card, two cards below it (Kitchen).
 * - `feature-tall`: on desktop a tall first card on the left and two stacked on the right;
 *   on tablet like `feature-wide` (Home Security).
 * - `row`: three equal cards side by side (Accessories).
 */
export type GalleryLayout = "feature-wide" | "feature-tall" | "row";

export type CategoryGalleryProps = {
  category: Category;
  /** Products of this category, in display order. The gallery shows the first three. */
  products: Product[];
  layout: GalleryLayout;
};

/** One position in the grid: its size and how the card placed there arranges its contents. */
type Slot = {
  className: string;
  textPosition: Responsive<PackshotTextPosition>;
  /** Rendered width of the packshot, for `sizes`. */
  imageSizes: string;
  /**
   * Only on the large first card: the rendered width of the card. If the product has a lifestyle
   * photo (`featureImage`), it fills the whole card; otherwise the card shows the packshot.
   */
  coverSizes?: string;
};

// Card heights come from Figma; the width follows the grid. Every card is 537px tall on mobile.
const WIDE_CARD = "h-[537px] tablet:col-span-2 tablet:h-[355px] desktop:h-[754px]";
const HALF_CARD = "h-[537px] tablet:h-[480px] desktop:h-[880px]";

// Rendered image width, for `sizes`: full width on mobile, about half the page from tablet.
const HALF_WIDTH = "(min-width: 810px) 50vw, 100vw";

const SLOTS: Record<GalleryLayout, Slot[]> = {
  "feature-wide": [
    {
      className: WIDE_CARD,
      textPosition: { base: "top", tablet: "left" },
      imageSizes: HALF_WIDTH,
      coverSizes: "100vw",
    },
    { className: HALF_CARD, textPosition: "top", imageSizes: HALF_WIDTH },
    { className: HALF_CARD, textPosition: "top", imageSizes: HALF_WIDTH },
  ],
  "feature-tall": [
    {
      className:
        "h-[537px] tablet:col-span-2 tablet:h-[410px] desktop:col-span-1 desktop:row-span-2 desktop:h-[1038px]",
      textPosition: { base: "top", tablet: "left", desktop: "top" },
      imageSizes: HALF_WIDTH,
      // The card spans the page on mobile and tablet, half of it on desktop.
      coverSizes: "(min-width: 1200px) 50vw, 100vw",
    },
    {
      className: "h-[537px] tablet:h-[480px] desktop:h-[507px]",
      textPosition: { base: "top", desktop: "left" },
      imageSizes: "(min-width: 1200px) 25vw, (min-width: 810px) 50vw, 100vw",
    },
    {
      className: "h-[537px] tablet:h-[480px] desktop:h-[507px]",
      textPosition: { base: "top", desktop: "left" },
      imageSizes: "(min-width: 1200px) 25vw, (min-width: 810px) 50vw, 100vw",
    },
  ],
  row: Array.from({ length: 3 }, () => ({
    className: "h-[537px] tablet:h-[440px] desktop:h-[691px]",
    textPosition: { base: "top", tablet: "bottom" } as const,
    imageSizes: "(min-width: 810px) 33vw, 100vw",
  })),
};

const GRID: Record<GalleryLayout, string> = {
  "feature-wide": "tablet:grid-cols-2",
  "feature-tall": "tablet:grid-cols-2",
  row: "tablet:grid-cols-3",
};

/**
 * A homepage category section: the category heading with a link to the category page, then the
 * first three products of the category in one of three grid arrangements.
 */
export function CategoryGallery({ category, products, layout }: CategoryGalleryProps) {
  const slots = SLOTS[layout];

  return (
    <section className="flex flex-col gap-10 desktop:gap-20">
      <SectionHeading
        title={category.name}
        description={category.description}
        cta={{
          label: "Explore all products",
          href: `/categories/${category.slug}`,
        }}
      />
      <ul className={`grid gap-6 ${GRID[layout]}`}>
        {products.slice(0, slots.length).map((product, index) => {
          const { className, textPosition, imageSizes, coverSizes } = slots[index];
          const content = {
            title: product.name,
            description: product.shortDescription,
            href: `/products/${product.slug}`,
          };
          return (
            <li key={product.id} className={className}>
              {coverSizes && product.featureImage ? (
                <ProductCard
                  {...content}
                  cover
                  image={product.featureImage}
                  imageSizes={coverSizes}
                  textPosition={textPosition}
                />
              ) : (
                <ProductCard {...content} image={product.image} imageSizes={imageSizes} textPosition={textPosition} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
