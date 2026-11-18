import type { CategorySlug } from "./category";
import type { Image, Link, ResponsiveImage } from "./media";

/** Its page lives at `/products/${slug}`. */
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  /** Packshot: the product alone on a plain background. */
  image: Image;
  /** Lifestyle photo for the large first card of a homepage gallery. */
  featureImage?: FeatureImage;
  bestSeller: boolean;
};

export type FeatureImage = ResponsiveImage & {
  /** Flips the photo, to move its subject to the other side of the card. */
  mirrored?: boolean;
};

export type Colour = {
  name: string;
  hex: string;
};

export type SpecSection = {
  title: string;
  items: string[];
};

export type Feature = {
  title: string;
  description: string;
  image: Image;
};

export type ProductDetail = Product & {
  description: string;
  colours: Colour[];
  specs: SpecSection[];
  downloads: Link[];
  gallery: Image[];
  features: Feature[];
};
