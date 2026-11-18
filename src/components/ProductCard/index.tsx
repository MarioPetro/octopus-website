import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { ImageFrame } from "@/components/ImageFrame";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import type { FeatureImage, Image } from "@/types";
import { cn } from "@/utils/cn";

/** Where the text block sits. A packshot takes the opposite side; a cover photo stays behind. */
export type TextPosition = "top" | "bottom" | "left" | "right" | "center";

export type PackshotTextPosition = Exclude<TextPosition, "center">;

/** One value, or one per breakpoint: a missing breakpoint inherits the smaller one. */
export type Responsive<T> = T | { base: T; tablet?: T; desktop?: T };

type ImageProps =
  | {
      cover?: false;
      image: Image;
      textPosition?: Responsive<PackshotTextPosition>;
    }
  | {
      /** The photo fills the whole card, behind the texts. */
      cover: true;
      image: FeatureImage;
      textPosition?: Responsive<TextPosition>;
    };

export type ProductCardProps = ImageProps & {
  tag?: string;
  title: string;
  description: string;
  href: string;
  /** Rendered image width at each breakpoint, for `sizes`. */
  imageSizes?: string;
};

function resolve<T>(value: Responsive<T>): { base: T; tablet: T; desktop: T } {
  if (typeof value === "object" && value !== null) {
    const { base, tablet = base, desktop = tablet } = value as { base: T; tablet?: T; desktop?: T };
    return { base, tablet, desktop };
  }
  return { base: value, tablet: value, desktop: value };
}

// Tailwind only generates classes written out in full, so each breakpoint has its own table.
// Every entry sets all the properties it touches, so nothing leaks from a smaller breakpoint.
type BreakpointClasses = {
  body: Record<TextPosition, string>;
  title?: Partial<Record<TextPosition, string>>;
  packshot: Record<PackshotTextPosition, { card: string; image: string }>;
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

/** A card that fills its parent: texts and a "Learn more" link, with a packshot or a cover photo. */
export function ProductCard(props: ProductCardProps) {
  const { tag, title, description, href } = props;
  const position = resolve<TextPosition>(props.textPosition ?? "top");

  let cardClasses: string;
  let media: ReactNode;

  if (props.cover) {
    cardClasses = cn(BASE.cover[position.base], TABLET.cover[position.tablet], DESKTOP.cover[position.desktop]);
    media = (
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
      className={cn("relative flex h-full gap-6 overflow-hidden rounded-card bg-card tablet:gap-8", cardClasses)}
    >
      {props.cover && media}
      <div
        className={cn(
          "relative flex flex-col gap-6 tablet:gap-8",
          BASE.body[position.base],
          TABLET.body[position.tablet],
          DESKTOP.body[position.desktop],
        )}
      >
        <div className="flex flex-col gap-4">
          {tag && <p className="text-body-lg font-book text-accent">{tag}</p>}
          <h3 className={cn("text-title-lg font-bold leading-[1.1]", DESKTOP.title?.[position.desktop])}>{title}</h3>
          <p className="text-body font-book text-secondary desktop:text-title">{description}</p>
        </div>
        {/* The hidden text tells the many "Learn more" links apart, and the name still starts with
            the visible text (WCAG 2.5.3). It is text, not aria-label, because Lighthouse's link
            text audit (SEO) reads only the link's text. */}
        <Button href={href}>
          {/* The space stays outside the span: a leading space inside it is dropped from the name. */}
          Learn more <span className="sr-only">about {title}</span>
        </Button>
      </div>
      {!props.cover && media}
    </article>
  );
}
