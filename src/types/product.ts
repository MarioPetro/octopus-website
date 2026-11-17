import type { CategorySlug } from "./category";
import type { Image, Link } from "./media";

/** A product as shown in cards and carousels. Its page lives at `/products/${slug}`. */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  image: Image;
  bestSeller: boolean;
};

export type Colour = {
  name: string;
  hex: string;
};

/** One accordion section of the specifications (e.g. "Dimensions & weight"). */
export type SpecSection = {
  title: string;
  items: string[];
};

/** A card of the "bento" grid on the product detail page. */
export type Feature = {
  title: string;
  description: string;
  image: Image;
};

/** Everything the product detail page needs, as a backend would return it for one product. */
export type ProductDetail = Product & {
  description: string;
  colours: Colour[];
  specs: SpecSection[];
  downloads: Link[];
  gallery: Image[];
  features: Feature[];
};
