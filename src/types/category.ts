import type { Image } from "./media";

export type CategorySlug = "kitchen" | "home-security" | "hair-care" | "accessories";

/**
 * A product category. Used by the navbar, the footer, the homepage galleries and the
 * "Explore all categories" tiles. Its page lives at `/categories/${slug}` (out of scope).
 */
export type Category = {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  /** Tile image in "Explore all categories". */
  image: Image;
};
