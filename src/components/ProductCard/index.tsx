import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";

/**
 * - `vertical`: texts centred at the top, image below.
 * - `horizontal`: texts on the left, image on the right.
 * - `media-top`: image at the top, texts below aligned left (smaller title on desktop).
 */
export type CardLayout = "vertical" | "horizontal" | "media-top";

export type ProductCardProps = {
  product: Product;
  /** Layout from 810px. Mobile is always `vertical`. */
  tabletLayout?: CardLayout;
  /** Layout from 1200px. Defaults to the tablet layout. */
  desktopLayout?: CardLayout;
  /** Red label above the title, e.g. the category name in the best sellers carousel. */
  category?: string;
  /** Rendered image width at each breakpoint; depends on the grid the card is in. */
  imageSizes?: string;
};

// One entry per layout and breakpoint. Tailwind only generates classes it finds written out
// in full in the source, so the breakpoint prefixes cannot be built from a variable.
type LayoutClasses = { card: string; body: string; image: string; title?: string };

const TABLET: Record<CardLayout, LayoutClasses> = {
  vertical: {
    card: "tablet:flex-col tablet:px-10 tablet:pt-16 tablet:pb-0",
    body: "tablet:w-full tablet:items-center tablet:text-center",
    image: "tablet:order-none tablet:w-full tablet:flex-1 tablet:aspect-auto",
  },
  horizontal: {
    card: "tablet:flex-row tablet:items-center tablet:p-10 tablet:pr-0",
    body: "tablet:w-1/2 tablet:items-start tablet:text-left",
    image: "tablet:order-none tablet:w-1/2 tablet:flex-none tablet:self-stretch tablet:aspect-auto",
  },
  "media-top": {
    card: "tablet:flex-col tablet:p-10",
    body: "tablet:w-full tablet:items-start tablet:text-left",
    image: "tablet:order-first tablet:w-full tablet:flex-none tablet:aspect-square",
  },
};

const DESKTOP: Record<CardLayout, LayoutClasses> = {
  vertical: {
    card: "desktop:flex-col desktop:px-20 desktop:pt-16 desktop:pb-0",
    body: "desktop:w-full desktop:items-center desktop:text-center",
    image: "desktop:order-none desktop:w-full desktop:flex-1 desktop:aspect-auto",
    title: "desktop:text-h3",
  },
  horizontal: {
    card: "desktop:flex-row desktop:items-center desktop:p-10 desktop:pr-0",
    body: "desktop:w-1/2 desktop:items-start desktop:text-left",
    image: "desktop:order-none desktop:w-1/2 desktop:flex-none desktop:self-stretch desktop:aspect-auto",
    title: "desktop:text-h3",
  },
  "media-top": {
    card: "desktop:flex-col desktop:p-10",
    body: "desktop:w-full desktop:items-start desktop:text-left",
    image: "desktop:order-first desktop:w-full desktop:flex-none desktop:aspect-square",
  },
};

const DEFAULT_SIZES = "(min-width: 1200px) 33vw, (min-width: 810px) 50vw, 100vw";

/**
 * A product on a grey card: packshot, name, short description and a link to its page.
 * The card fills the space its parent gives it (a grid cell), and the image takes what the
 * texts leave free, so the same card works small in a row or large as a gallery's first item.
 */
export function ProductCard({
  product,
  tabletLayout = "vertical",
  desktopLayout = tabletLayout,
  category,
  imageSizes = DEFAULT_SIZES,
}: ProductCardProps) {
  const tablet = TABLET[tabletLayout];
  const desktop = DESKTOP[desktopLayout];

  return (
    <article
      className={cn(
        // Mobile: always vertical.
        "flex h-full flex-col gap-6 rounded-card bg-card px-6 pt-10 tablet:gap-8",
        tablet.card,
        desktop.card,
      )}
    >
      <div className={cn("flex w-full flex-col items-center gap-6 text-center tablet:gap-8", tablet.body, desktop.body)}>
        <div className="flex flex-col gap-4">
          {category && <p className="text-body-lg font-book text-accent">{category}</p>}
          {/* 24px bold on mobile and tablet (Figma H3/S); on desktop the larger cards use H3/L (32px). */}
          <h3 className={cn("text-title-lg font-bold leading-[1.1]", desktop.title)}>{product.name}</h3>
          <p className="text-body font-book text-secondary desktop:text-title">
            {product.shortDescription}
          </p>
        </div>
        {/* The visible text comes first in the accessible name (WCAG 2.5.3), and the product
            name tells screen reader users which of the many "Learn more" links this is. */}
        <Button href={`/products/${product.slug}`} aria-label={`Learn more about ${product.name}`}>
          Learn more
        </Button>
      </div>
      <ImageFrame
        image={product.image}
        sizes={imageSizes}
        fit="contain"
        className={cn("min-h-72 w-full flex-1", tablet.image, desktop.image)}
      />
    </article>
  );
}
