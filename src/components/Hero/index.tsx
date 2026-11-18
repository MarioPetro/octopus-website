import { Button } from "@/components/Button";
import type { Link } from "@/types";

export type HeroProps = {
  title: string;
  description: string;
  cta: Link;
};

/**
 * The homepage hero: the page's h1, a short description and a link, centred near the top of a
 * full-bleed media block that starts at the top of the window, under the sticky navbar.
 *
 * In Figma the background is a video (16:9 on desktop and tablet, 9:16 on mobile). The file was
 * not part of the exported assets, so a neutral placeholder of the same size stands in for it.
 * The text is shown at once: it is the first thing users read and the page's LCP element.
 */
export function Hero({ title, description, cta }: HeroProps) {
  return (
    // -mt-header pulls the hero up by the height the sticky header takes, so it slides under
    // the translucent navbar as in Figma. Heights from the Figma frames: 820px mobile,
    // 1132px tablet, 16:9 on desktop (1600 × 900).
    // Placeholder fill: the video's grey, sampled from the Figma frames — light behind the text
    // (#dadada, which keeps the secondary text above 4.5:1) and darker towards the edges (#b3b3b3).
    <section
      aria-labelledby="hero-title"
      className="-mt-header h-[820px] bg-[radial-gradient(ellipse_at_50%_25%,#dadada,#b3b3b3)] tablet:h-[1132px] desktop:aspect-video desktop:h-auto"
    >
      {/* Text position from Figma, measured from the top of the hero (navbar included):
          104px on mobile with 24px sides, 180px from tablet within the page side margin. */}
      <div className="px-6 pt-26 tablet:px-gutter tablet:pt-45">
        <div className="mx-auto flex max-w-[1104px] flex-col items-center gap-6 text-center tablet:gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 id="hero-title" className="text-h1">
              {title}
            </h1>
            {/* In Figma the description wraps in two lines even where the title fits in one. */}
            <p className="max-w-[550px] text-subtitle font-book text-secondary">{description}</p>
          </div>
          <Button href={cta.href}>{cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
