import NextImage from "next/image";
import type { Image } from "@/types";
import { cn } from "@/utils/cn";

export type ImageFrameProps = {
  image: Image;
  /**
   * How wide the image is on screen at each breakpoint, e.g. "(min-width: 1200px) 33vw, 100vw".
   * Required: without it the browser assumes full viewport width and downloads oversized files.
   */
  sizes: string;
  /** `contain` shows the whole image (packshots), `cover` fills the frame and crops (photos). */
  fit?: "contain" | "cover";
  /** Only for the main image above the fold (the LCP element): loads it before the others. */
  preload?: boolean;
  /** Sets the frame size, usually an aspect ratio (`aspect-square`) or `h-full` inside a card. */
  className?: string;
};

/**
 * A box of fixed proportions that the image fills. The box has its size before the image
 * loads, so nothing moves on the page (no layout shift), whatever the image's own dimensions.
 * Images are lazy-loaded by default; missing images show a neutral placeholder of the same size.
 */
export function ImageFrame({ image, sizes, fit = "cover", preload = false, className }: ImageFrameProps) {
  return (
    <div className={cn("relative overflow-hidden bg-card", className)}>
      {image.src ? (
        <NextImage
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          preload={preload}
          className={fit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : (
        // Placeholder for assets missing from the Figma export. It keeps the alt text, so
        // screen readers still get the description; decorative images (alt="") stay hidden.
        <div
          className="absolute inset-0"
          {...(image.alt ? { role: "img", "aria-label": image.alt } : { "aria-hidden": true })}
          data-placeholder=""
        />
      )}
    </div>
  );
}
