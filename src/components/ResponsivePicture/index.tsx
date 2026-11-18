import { getImageProps } from "next/image";
import type { ResponsiveImage } from "@/types";
import { MEDIA } from "@/utils/breakpoints";
import { cn } from "@/utils/cn";

export type ResponsivePictureProps = {
  image: ResponsiveImage;
  sizes?: string;
  /** Only for the LCP image above the fold. */
  preload?: boolean;
  className?: string;
};

/** Art direction: a different crop per breakpoint; the browser downloads only the matching one. */
export function ResponsivePicture({ image, sizes = "100vw", preload = false, className }: ResponsivePictureProps) {
  // next/image has no art direction: getImageProps gives an optimised srcSet for each file.
  const common = { alt: image.alt, fill: true, sizes };
  const desktop = getImageProps({ ...common, src: image.desktop }).props;
  const tablet = getImageProps({ ...common, src: image.tablet }).props;
  const { srcSet: mobileSrcSet, ...img } = getImageProps({ ...common, src: image.mobile }).props;

  return (
    <div className={cn("relative overflow-hidden bg-card", className)}>
      <picture>
        <source media={MEDIA.desktop} srcSet={desktop.srcSet} sizes={sizes} />
        <source media={MEDIA.tablet} srcSet={tablet.srcSet} sizes={sizes} />
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
