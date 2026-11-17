/**
 * An image reference. Its size on screen is decided by the component that renders it
 * (an aspect-ratio box from the Figma layout), so any image fits without layout shift.
 * `src` is optional: assets missing from the Figma export render as a neutral placeholder.
 */
export type Image = {
  src?: string;
  alt: string;
};

export type Link = {
  label: string;
  href: string;
};
