import { getImageProps } from "next/image";
import type { ResponsiveImage } from "@/types";
import { MEDIA } from "@/utils/breakpoints";
import { cn } from "@/utils/cn";

export type ResponsivePictureProps = {
  image: ResponsiveImage;
  /** Rendered width at each breakpoint; full-width banners use the default. */
  sizes?: string;
  /** For an image above the fold (the LCP element): loads it immediately, with high priority. */
  preload?: boolean;
  /** Sets the frame size, usually a different aspect ratio per breakpoint. */
  className?: string;
};

/**
 * Art direction: shows a different image file at each breakpoint (mobile, tablet, desktop),
 * each cropped by the designer for that format. The browser picks the first <source> whose
 * media query matches and downloads only that file. Like ImageFrame, the frame reserves its
 * space before the image loads, so there is no layout shift.
 */
export function ResponsivePicture({ image, sizes = "100vw", preload = false, className }: ResponsivePictureProps) {
  // getImageProps gives the optimised srcSet (AVIF/WebP, several widths) for each file,
  // which next/image cannot do across breakpoints on its own.
  const common = { alt: image.alt, fill: true, sizes };
  const desktop = getImageProps({ ...common, src: image.desktop }).props;
  const tablet = getImageProps({ ...common, src: image.tablet }).props;
  const { srcSet: mobileSrcSet, ...img } = getImageProps({ ...common, src: image.mobile }).props;

  return (
    <div className={cn("relative overflow-hidden bg-card", className)}>
      <picture>
        <source media={MEDIA.desktop} srcSet={desktop.srcSet} sizes={sizes} />
        <source media={MEDIA.tablet} srcSet={tablet.srcSet} sizes={sizes} />
        {/* The <img> is the mobile fallback and carries alt, sizing and loading behaviour. */}
        <img
          {...img}
          alt={image.alt}
          srcSet={mobileSrcSet}
          className="object-cover"
          loading={preload ? "eager" : "lazy"}
          fetchPriority={preload ? "high" : undefined}
        />
      </picture>
    </div>
  );
}
