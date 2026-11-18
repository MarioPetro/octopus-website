import { Button } from "@/components/Button";
import { ColourSelector } from "@/components/ColourSelector";
import type { Colour } from "@/types";

export type ProductInfoProps = {
  name: string;
  description: string;
  colours: Colour[];
  /** Id of the title, for a section that wants to be labelled by it. */
  titleId?: string;
};

/** Title, description, colour selector and "Where to buy" at the top of a product page. */
export function ProductInfo({ name, description, colours, titleId }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <h1 id={titleId} className="text-h2">
          {name}
        </h1>
        <p className="text-body font-book text-secondary">{description}</p>
      </div>
      <ColourSelector colours={colours} />
      {/* On mobile the button moves to a bar fixed at the bottom of the screen. */}
      <div className="hidden tablet:flex tablet:flex-col">
        <Button href="/where-to-buy">Where to buy</Button>
      </div>
    </div>
  );
}
