import Link from "next/link";
import { useId } from "react";
import { ImageFrame } from "@/components/ImageFrame";
import type { Image } from "@/types";
import { cn } from "@/utils/cn";

export type ProductTileProps = {
  title: string;
  description?: string;
  href: string;
  image: Image;
  /** Rendered image width at each breakpoint, for `sizes`. */
  imageSizes: string;
  /**
   * `category`: square packshot, name centred below ("Explore all categories").
   * `product`: portrait packshot, bold title and description on the left (product page carousel).
   */
  variant: "category" | "product";
};

/**
 * A packshot on a grey box with its texts below, on white. The whole tile is one link and the
 * packshot zooms in on hover and keyboard focus (skipped for users who prefer reduced motion).
 */
export function ProductTile({ title, description, href, image, imageSizes, variant }: ProductTileProps) {
  const titleId = useId();
  const descriptionId = useId();
  const product = variant === "product";

  return (
    <Link
      href={href}
      // Named by the title alone; the description is read after it, as a description.
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className={cn("group flex flex-col gap-4", product ? "tablet:gap-8" : "text-center")}
    >
      <div
        className={cn(
          "overflow-hidden rounded-card bg-card",
          product ? "aspect-[179/258] px-6 py-10 tablet:aspect-[3/4]" : "aspect-square",
        )}
      >
        {/* Decorative: the title names the link. */}
        <ImageFrame
          image={{ ...image, alt: "" }}
          sizes={imageSizes}
          fit="contain"
          className="h-full motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-300 group-hover:[&_img]:scale-105 group-focus-visible:[&_img]:scale-105"
        />
      </div>
      <div className={cn("flex flex-col gap-2", product && "pr-6")}>
        {product ? (
          <h3 id={titleId} className="text-title font-bold">
            {title}
          </h3>
        ) : (
          <span id={titleId} className="text-title font-book">
            {title}
          </span>
        )}
        {description && (
          <p id={descriptionId} className="text-body font-book text-secondary">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
