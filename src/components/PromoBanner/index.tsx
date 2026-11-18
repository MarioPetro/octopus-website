import { Button } from "@/components/Button";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import type { Link, ResponsiveImage } from "@/types";

export type PromoBannerProps = {
  title: string;
  description: string;
  cta: Link;
  image: ResponsiveImage;
  /** CSS background around the photo, sampled from its edges so the two blend. */
  background: string;
};

/** A full-width banner promoting one product, with its text over a photo. */
export function PromoBanner({ title, description, cta, image, background }: PromoBannerProps) {
  return (
    <section className="relative h-[709px] tablet:h-[500px] desktop:aspect-[12/5] desktop:h-auto">
      {/* Mobile: at most as wide as the Figma frame (402px), so the subject stays below the
          text; wider screens fade its sides. From tablet: shifted right to clear the text. */}
      <div className="absolute inset-0" style={{ background }}>
        <div className="absolute bottom-0 left-1/2 aspect-[3/4] w-full max-w-[402px] -translate-x-1/2 min-[403px]:[mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] tablet:inset-0 tablet:aspect-auto tablet:max-w-none tablet:translate-x-0 tablet:[mask-image:none]">
          <ResponsivePicture
            image={image}
            className="h-full w-full bg-transparent tablet:[&_img]:[object-position:13vw_0] tablet:[&_img]:[mask-image:linear-gradient(to_right,transparent_13vw,black_calc(13vw+80px))]"
          />
        </div>
      </div>
      <div className="relative h-full px-gutter">
        <div className="mx-auto flex h-full max-w-content flex-col items-center gap-8 pt-20 text-center tablet:items-start tablet:justify-center tablet:pt-0 tablet:text-left">
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
