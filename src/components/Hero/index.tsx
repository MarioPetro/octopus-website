import { Button } from "@/components/Button";
import type { Link } from "@/types";

export type HeroProps = {
  title: string;
  description: string;
  cta: Link;
};

/** The homepage hero. The Figma background video was not exported: a grey placeholder stands in. */
export function Hero({ title, description, cta }: HeroProps) {
  return (
    // -mt-header slides the hero under the translucent navbar. The light grey behind the text
    // keeps the secondary text above 4.5:1.
    <section
      aria-labelledby="hero-title"
      className="-mt-header h-[820px] bg-[radial-gradient(ellipse_at_50%_25%,#dadada,#b3b3b3)] tablet:h-[1132px] desktop:aspect-video desktop:h-auto"
    >
      <div className="px-6 pt-26 tablet:px-gutter tablet:pt-45">
        <div className="mx-auto flex max-w-[1104px] flex-col items-center gap-6 text-center tablet:gap-8">
          <div className="flex flex-col items-center gap-2">
            <h1 id="hero-title" className="text-h1">
              {title}
            </h1>
            <p className="max-w-[550px] text-subtitle font-book text-secondary">{description}</p>
          </div>
          <Button href={cta.href}>{cta.label}</Button>
        </div>
      </div>
    </section>
  );
}
