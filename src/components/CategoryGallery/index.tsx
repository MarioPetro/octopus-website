import { type PackshotTextPosition, ProductCard, type Responsive } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { Category, Product } from "@/types";

/**
 * Arrangement from tablet up; on mobile the cards are always one column.
 * `feature-tall` is like `feature-wide` on tablet.
 */
export type GalleryLayout = "feature-wide" | "feature-tall" | "row";

export type CategoryGalleryProps = {
  category: Category;
  /** The gallery shows the first three. */
  products: Product[];
  layout: GalleryLayout;
};

type Slot = {
  className: string;
  textPosition: Responsive<PackshotTextPosition>;
  imageSizes: string;
  /** Large first card only: shows the product's `featureImage`, when it has one, as a cover. */
  coverSizes?: string;
};

const WIDE_CARD = "h-[537px] tablet:col-span-2 tablet:h-[355px] desktop:h-[754px]";
const HALF_CARD = "h-[537px] tablet:h-[480px] desktop:h-[880px]";

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

/** A homepage category section: heading, then the first three products in a grid. */
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
