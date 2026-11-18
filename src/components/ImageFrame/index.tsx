import NextImage from "next/image";
import type { Image } from "@/types";
import { cn } from "@/utils/cn";

export type ImageFrameProps = {
  image: Image;
  /** Required: without it the browser assumes 100vw and downloads oversized files. */
  sizes: string;
  fit?: "contain" | "cover";
  /** Only for the LCP image above the fold. */
  preload?: boolean;
  /** Sets the frame size (an aspect ratio or a height): it is reserved before the image loads. */
  className?: string;
};

/** An image in a box sized by CSS, so nothing moves while it loads. Missing files show a placeholder. */
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
        // Keeps the alt text for screen readers; decorative images (alt="") stay hidden.
        <div
          className="absolute inset-0"
          {...(image.alt ? { role: "img", "aria-label": image.alt } : { "aria-hidden": true })}
          data-placeholder=""
        />
      )}
    </div>
  );
}
