import { ImageFrame } from "@/components/ImageFrame";
import { Reveal } from "@/components/Reveal";
import type { Feature } from "@/types";
import { cn } from "@/utils/cn";

export type FeatureGalleryProps = {
  features: Feature[];
};

/**
 * The product's features as photo cards. Stacked on mobile and tablet; on desktop a wide card
 * and two half cards take turns (wide, half, half, wide…), as in the Figma bento.
 */
export function FeatureGallery({ features }: FeatureGalleryProps) {
  if (features.length === 0) return null;

  return (
    <section aria-labelledby="features-title">
      {/* Figma shows no title here; this one keeps the heading levels in order for screen readers. */}
      <h2 id="features-title" className="sr-only">
        Features
      </h2>
      <ul className="grid grid-cols-1 gap-4 desktop:grid-cols-2">
        {features.map((feature, index) => {
          const wide = index % 3 === 0;
          return (
            // Each card is its own scroll reveal: stacked on mobile, they enter the screen one by one.
            <Reveal as="li" key={feature.title} travel="media" className={cn(wide && "desktop:col-span-2")}>
              <FeatureCard feature={feature} wide={wide} />
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

type FeatureCardProps = {
  feature: Feature;
  /** Desktop only: a landscape card with the texts on the left. */
  wide: boolean;
};

function FeatureCard({ feature, wide }: FeatureCardProps) {
  return (
    <article
      className={cn(
        // Mobile and tablet: portrait card, texts centred at the top.
        "relative flex aspect-[3/4] flex-col items-center overflow-hidden rounded-card px-8 pt-8 text-center tablet:px-12 tablet:pt-10",
        wide
          ? "desktop:aspect-[709/324] desktop:items-start desktop:justify-center desktop:pt-0 desktop:pr-0 desktop:pl-10 desktop:text-left"
          : "desktop:aspect-[347/456] desktop:items-start desktop:px-8 desktop:pt-10 desktop:text-left",
      )}
    >
      {/* The photo fills the card, behind the texts. */}
      <div className="absolute inset-0">
        <ImageFrame
          image={feature.image}
          sizes={
            wide
              ? "(min-width: 1200px) 709px, (min-width: 810px) calc(100vw - 334px), calc(100vw - 32px)"
              : "(min-width: 1200px) 347px, (min-width: 810px) calc(100vw - 334px), calc(100vw - 32px)"
          }
          className="h-full"
        />
      </div>
      <div className={cn("relative flex flex-col gap-2", wide && "desktop:w-63")}>
        <h3 className="text-title font-bold tablet:text-h3 desktop:text-title">{feature.title}</h3>
        <p className="text-body font-book tablet:text-title desktop:text-body">{feature.description}</p>
      </div>
    </article>
  );
}
