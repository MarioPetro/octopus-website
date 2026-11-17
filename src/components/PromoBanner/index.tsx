import { Button } from "@/components/Button";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import type { Link, ResponsiveImage } from "@/types";

export type PromoBannerProps = {
  title: string;
  description: string;
  cta: Link;
  /** A different crop per breakpoint, as exported from Figma. */
  image: ResponsiveImage;
  /**
   * CSS background for the parts of the banner the photo does not cover. Sample it from the
   * photo's own background (e.g. a gradient of its edge colours) so the photo blends into it.
   */
  background: string;
};

/**
 * A full-width banner promoting one product: a photo with a title, a short description and a
 * link on top of it. On mobile the text is centred at the top; from tablet it is on the left,
 * aligned with the page content and centred vertically.
 */
export function PromoBanner({ title, description, cta, image, background }: PromoBannerProps) {
  return (
    <section className="relative h-[709px] tablet:h-[500px] desktop:aspect-[12/5] desktop:h-auto">
      {/* The photo sits behind the text, placed as in Figma, on the `background` fill.
          - mobile: a 3:4 box resting on the bottom edge, as wide as the screen but at most
            402px (the Figma mobile frame) and centred, so the head stays below the text at any
            phone width. On screens wider than 402px its sides fade into the fill.
          - from tablet: the photo fills the banner and is shifted right by 13% of the width, so
            the subject clears the text; its left edge fades into the fill. */}
      <div className="absolute inset-0" style={{ background }}>
        <div className="absolute bottom-0 left-1/2 aspect-[3/4] w-full max-w-[402px] -translate-x-1/2 min-[403px]:[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] tablet:inset-0 tablet:aspect-auto tablet:max-w-none tablet:translate-x-0 tablet:[mask-image:none]">
          <ResponsivePicture
            image={image}
            className="h-full w-full bg-transparent tablet:[&_img]:[object-position:13vw_0] tablet:[&_img]:[mask-image:linear-gradient(to_right,transparent_13vw,black_calc(13vw+80px))]"
          />
        </div>
      </div>
      {/* The text lines up with the page content: side margin outside, 1344px column centred. */}
      <div className="relative h-full px-gutter">
        <div className="mx-auto flex h-full max-w-content flex-col items-center gap-8 pt-20 text-center tablet:items-start tablet:justify-center tablet:pt-0 tablet:text-left">
          {/* Widths from Figma: on mobile and tablet the title wraps earlier than the
              description; on tablet the text also stops before the product. */}
          <div className="flex max-w-[550px] flex-col gap-4 tablet:max-w-[380px] desktop:max-w-[550px]">
            <h2 className="mx-auto max-w-[240px] text-h2 tablet:mx-0 tablet:max-w-[300px] desktop:max-w-none">
              {title}
            </h2>
            <p className="max-w-[450px] text-subtitle font-book">{description}</p>
          </div>
          <Button href={cta.href}>{cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
