import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import type { FeatureImage, Image } from "@/types";
import { cn } from "@/utils/cn";

/**
 * Where the text block sits in the card. With a packshot the image takes the opposite side
 * (`top`: image below, `left`: image on the right…). With a cover photo the photo fills the card
 * anyway, and the position only moves the texts over it.
 */
export type TextPosition = "top" | "bottom" | "left" | "right" | "center";

/** `center` would put the texts over the packshot, so it is only allowed on a cover photo. */
export type PackshotTextPosition = Exclude<TextPosition, "center">;

/** One value for every breakpoint, or one per breakpoint: a missing one inherits the smaller. */
export type Responsive<T> = T | { base: T; tablet?: T; desktop?: T };

// `cover` decides which image the card accepts, and which text positions make sense with it.
type ImageProps =
  | {
      /** Packshot: the product alone, shown whole in the space the texts leave free. */
      cover?: false;
      image: Image;
      textPosition?: Responsive<PackshotTextPosition>;
    }
  | {
      /** Cover: a photo cropped per breakpoint that fills the whole card, behind the texts. */
      cover: true;
      image: FeatureImage;
      textPosition?: Responsive<TextPosition>;
    };

export type ProductCardProps = ImageProps & {
  /** Red label above the title, e.g. the category name in the best sellers carousel. */
  tag?: string;
  title: string;
  description: string;
  /** Where "Learn more" leads. */
  href: string;
  /** Rendered image width at each breakpoint; depends on the grid the card is in. */
  imageSizes?: string;
};

function resolve<T>(value: Responsive<T>): { base: T; tablet: T; desktop: T } {
  if (typeof value === "object" && value !== null) {
    const { base, tablet = base, desktop = tablet } = value as { base: T; tablet?: T; desktop?: T };
    return { base, tablet, desktop };
  }
  return { base: value, tablet: value, desktop: value };
}

// One set of classes per breakpoint and text position. Tailwind only generates classes it finds
// written out in full in the source, so the breakpoint prefixes cannot be built from a variable.
// Every entry sets all the properties it touches (direction, alignment, all four paddings), so
// a breakpoint never inherits a leftover from the smaller one.
type BreakpointClasses = {
  /** Text block: width and alignment. Shared by packshot and cover cards. */
  body: Record<TextPosition, string>;
  /** Title size, only where it changes. */
  title?: Partial<Record<TextPosition, string>>;
  /** Packshot card: direction and paddings of the card, size and order of the image. */
  packshot: Record<PackshotTextPosition, { card: string; image: string }>;
  /** Cover card: where the text block sits over the photo. */
  cover: Record<TextPosition, string>;
};

const BASE: BreakpointClasses = {
  body: {
    top: "w-full items-center text-center",
    center: "w-full items-center text-center",
    bottom: "w-full items-start text-left",
    left: "w-1/2 items-start text-left",
    right: "w-1/2 items-start text-left",
  },
  packshot: {
    top: {
      card: "flex-col items-stretch px-6 pt-10 pb-0",
      image: "order-none w-full flex-1 aspect-auto",
    },
    bottom: {
      card: "flex-col items-stretch p-6",
      image: "order-first w-full flex-none aspect-square",
    },
    left: {
      card: "flex-row items-center p-6 pr-0",
      image: "order-none w-1/2 flex-none self-stretch aspect-auto",
    },
    right: {
      card: "flex-row items-center p-6 pl-0",
      image: "order-first w-1/2 flex-none self-stretch aspect-auto",
    },
  },
  cover: {
    top: "flex-col items-stretch justify-start px-6 py-10",
    center: "flex-col items-stretch justify-center px-6 py-10",
    bottom: "flex-col items-stretch justify-end p-6",
    left: "flex-row items-center justify-start p-6",
    right: "flex-row items-center justify-end p-6",
  },
};

const TABLET: BreakpointClasses = {
  body: {
    top: "tablet:w-full tablet:items-center tablet:text-center",
    center: "tablet:w-full tablet:items-center tablet:text-center",
    bottom: "tablet:w-full tablet:items-start tablet:text-left",
    left: "tablet:w-1/2 tablet:items-start tablet:text-left",
    right: "tablet:w-1/2 tablet:items-start tablet:text-left",
  },
  packshot: {
    top: {
      card: "tablet:flex-col tablet:items-stretch tablet:px-10 tablet:pt-16 tablet:pb-0",
      image: "tablet:order-none tablet:w-full tablet:flex-1 tablet:aspect-auto",
    },
    bottom: {
      card: "tablet:flex-col tablet:items-stretch tablet:p-10",
      image: "tablet:order-first tablet:w-full tablet:flex-none tablet:aspect-square",
    },
    left: {
      card: "tablet:flex-row tablet:items-center tablet:p-10 tablet:pr-0",
      image: "tablet:order-none tablet:w-1/2 tablet:flex-none tablet:self-stretch tablet:aspect-auto",
    },
    right: {
      card: "tablet:flex-row tablet:items-center tablet:p-10 tablet:pl-0",
      image: "tablet:order-first tablet:w-1/2 tablet:flex-none tablet:self-stretch tablet:aspect-auto",
    },
  },
  cover: {
    top: "tablet:flex-col tablet:items-stretch tablet:justify-start tablet:px-10 tablet:py-16",
    center: "tablet:flex-col tablet:items-stretch tablet:justify-center tablet:px-10 tablet:py-16",
    bottom: "tablet:flex-col tablet:items-stretch tablet:justify-end tablet:p-10",
    left: "tablet:flex-row tablet:items-center tablet:justify-start tablet:p-10",
    right: "tablet:flex-row tablet:items-center tablet:justify-end tablet:p-10",
  },
};

const DESKTOP: BreakpointClasses = {
  body: {
    top: "desktop:w-full desktop:items-center desktop:text-center",
    center: "desktop:w-full desktop:items-center desktop:text-center",
    bottom: "desktop:w-full desktop:items-start desktop:text-left",
    left: "desktop:w-1/2 desktop:items-start desktop:text-left",
    right: "desktop:w-1/2 desktop:items-start desktop:text-left",
  },
  // The large cards use H3/L (32px) on desktop; the small cards with the image on top keep H3/S.
  title: {
    top: "desktop:text-h3",
    center: "desktop:text-h3",
    left: "desktop:text-h3",
    right: "desktop:text-h3",
  },
  packshot: {
    top: {
      card: "desktop:flex-col desktop:items-stretch desktop:px-20 desktop:pt-16 desktop:pb-0",
      image: "desktop:order-none desktop:w-full desktop:flex-1 desktop:aspect-auto",
    },
    bottom: {
      card: "desktop:flex-col desktop:items-stretch desktop:p-10",
      image: "desktop:order-first desktop:w-full desktop:flex-none desktop:aspect-square",
    },
    left: {
      card: "desktop:flex-row desktop:items-center desktop:p-10 desktop:pr-0",
      image: "desktop:order-none desktop:w-1/2 desktop:flex-none desktop:self-stretch desktop:aspect-auto",
    },
    right: {
      card: "desktop:flex-row desktop:items-center desktop:p-10 desktop:pl-0",
      image: "desktop:order-first desktop:w-1/2 desktop:flex-none desktop:self-stretch desktop:aspect-auto",
    },
  },
  cover: {
    top: "desktop:flex-col desktop:items-stretch desktop:justify-start desktop:px-20 desktop:py-16",
    center: "desktop:flex-col desktop:items-stretch desktop:justify-center desktop:px-20 desktop:py-16",
    bottom: "desktop:flex-col desktop:items-stretch desktop:justify-end desktop:p-10",
    left: "desktop:flex-row desktop:items-center desktop:justify-start desktop:p-10",
    right: "desktop:flex-row desktop:items-center desktop:justify-end desktop:p-10",
  },
};

const DEFAULT_PACKSHOT_SIZES = "(min-width: 1200px) 33vw, (min-width: 810px) 50vw, 100vw";
const DEFAULT_COVER_SIZES = "100vw";

/**
 * A grey card with a tag, title, description, a "Learn more" link and an image. The card fills
 * the space its parent gives it (a grid cell): with a packshot the image takes what the texts
 * leave free; with a cover photo the photo fills the card and the texts sit over it.
 * `textPosition` places the texts, per breakpoint if needed; the text alignment follows from it
 * (centred at the top or in the middle, left-aligned elsewhere).
 */
export function ProductCard(props: ProductCardProps) {
  const { tag, title, description, href } = props;
  const position = resolve<TextPosition>(props.textPosition ?? "top");

  let cardClasses: string;
  let media: ReactNode;

  if (props.cover) {
    cardClasses = cn(BASE.cover[position.base], TABLET.cover[position.tablet], DESKTOP.cover[position.desktop]);
    media = (
      // The photo sits behind the texts and fills the card; each breakpoint gets its own crop.
      // `-scale-x-100` flips it horizontally when the data asks for it.
      <div className={cn("absolute inset-0", props.image.mirrored && "-scale-x-100")}>
        <ResponsivePicture
          image={props.image}
          sizes={props.imageSizes ?? DEFAULT_COVER_SIZES}
          className="h-full w-full"
        />
      </div>
    );
  } else {
    const packshot = resolve<PackshotTextPosition>(props.textPosition ?? "top");
    const base = BASE.packshot[packshot.base];
    const tablet = TABLET.packshot[packshot.tablet];
    const desktop = DESKTOP.packshot[packshot.desktop];
    cardClasses = cn(base.card, tablet.card, desktop.card);
    media = (
      <ImageFrame
        image={props.image}
        sizes={props.imageSizes ?? DEFAULT_PACKSHOT_SIZES}
        fit="contain"
        className={cn("min-h-40", base.image, tablet.image, desktop.image)}
      />
    );
  }

  return (
    <article
      className={cn(
        // `relative overflow-hidden` holds the cover photo inside the rounded card.
        "relative flex h-full gap-6 overflow-hidden rounded-card bg-card tablet:gap-8",
        cardClasses,
      )}
    >
      {props.cover && media}
      <div
        className={cn(
          // `relative` paints the texts above the absolutely positioned cover photo.
          "relative flex flex-col gap-6 tablet:gap-8",
          BASE.body[position.base],
          TABLET.body[position.tablet],
          DESKTOP.body[position.desktop],
        )}
      >
        <div className="flex flex-col gap-4">
          {tag && <p className="text-body-lg font-book text-accent">{tag}</p>}
          {/* 24px bold on mobile and tablet (Figma H3/S); larger on desktop for the big cards. */}
          <h3 className={cn("text-title-lg font-bold leading-[1.1]", DESKTOP.title?.[position.desktop])}>{title}</h3>
          <p className="text-body font-book text-secondary desktop:text-title">{description}</p>
        </div>
        {/* The visible text comes first in the accessible name (WCAG 2.5.3), and the title
            tells screen reader users which of the many "Learn more" links this is. */}
        <Button href={href} aria-label={`Learn more about ${title}`}>
          Learn more
        </Button>
      </div>
      {!props.cover && media}
    </article>
  );
}
