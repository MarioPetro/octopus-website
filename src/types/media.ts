/** Without `src` (an asset missing from the Figma export) it renders as a placeholder. */
export type Image = {
  src?: string;
  alt: string;
};

/** One crop per breakpoint, with one alt text. */
export type ResponsiveImage = {
  alt: string;
  mobile: string;
  tablet: string;
  desktop: string;
};

export type Link = {
  label: string;
  href: string;
};
