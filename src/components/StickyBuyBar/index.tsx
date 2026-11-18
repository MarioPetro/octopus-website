import { Button } from "@/components/Button";

/**
 * "Where to buy" fixed at the bottom of the screen on mobile, where the product info has no
 * button. `data-buy-bar` lets globals.css keep room for it below the footer.
 */
export function StickyBuyBar() {
  return (
    <div
      data-buy-bar=""
      // The top border is Figma's Button/Primary/Stroke/Disabled, the same grey as `disabled`.
      className="fixed inset-x-0 bottom-0 z-40 flex h-buy-bar flex-col border-t border-disabled bg-main p-2.5 tablet:hidden"
    >
      <Button href="/where-to-buy">Where to buy</Button>
    </div>
  );
}
