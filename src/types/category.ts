import type { Image } from "./media";

export type CategorySlug = "kitchen" | "home-security" | "hair-care" | "accessories";

export type Category = {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  /** Tile image in "Explore all categories". */
  image: Image;
};
