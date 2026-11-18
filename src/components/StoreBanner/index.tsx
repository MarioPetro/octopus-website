import { Button } from "@/components/Button";
import { ResponsivePicture } from "@/components/ResponsivePicture";

// Decorative: the banner does not name the products in the photo.
const PHOTO = {
  alt: "",
  mobile: "/images/banners/warehouse-tall.png",
  tablet: "/images/banners/warehouse-small.png",
  desktop: "/images/banners/warehouse-wide.png",
};

// The photo's left-edge colours (darker than the brand red), so the photo blends into the fill.
const PHOTO_EDGE_FILL = `linear-gradient(to bottom, rgb(207 23 29) 0%, rgb(206 22 29) 40%,
  rgb(211 25 30) 60%, rgb(216 25 30) 80%, rgb(216 30 33) 90%, rgb(215 52 48) 100%)`;

/** "Find us at The Warehouse". The Warehouse logo was not exported: its name is set as text. */
export function StoreBanner() {
  return (
    <section className="relative h-[688px] text-inverse tablet:h-[500px] desktop:aspect-[12/5] desktop:h-auto">
      {/* On tablet the banner widens at a fixed height, so the photo is not cropped (contain):
          it sits on the right and its left edge fades into the fill. */}
      <div className="absolute inset-0" style={{ background: PHOTO_EDGE_FILL }}>
        <ResponsivePicture
          image={PHOTO}
          className="h-full w-full bg-transparent [&_img]:object-[80%_50%] tablet:[&_img]:object-contain tablet:[&_img]:object-right tablet:[&_img]:[mask-image:linear-gradient(to_right,transparent_calc(100%-810px),black_calc(100%-730px))] desktop:[&_img]:object-cover desktop:[&_img]:object-center desktop:[&_img]:[mask-image:none]"
        />
      </div>
      <div className="relative h-full px-gutter">
        <div className="mx-auto flex h-full max-w-content flex-col items-center gap-6 pt-20 text-center tablet:items-start tablet:justify-center tablet:pt-0 tablet:text-left">
          <h2 className="flex flex-col">
            <span className="text-h3 font-book">Find us at</span> {/* Keeps the space in the accessible name. */}
            <span className="text-h1">The Warehouse</span>
          </h2>
          {/* The blue focus ring lacks contrast on red (WCAG 1.4.11). */}
          <Button color="secondary" href="/where-to-buy" className="focus-visible:outline-inverse">
            Find your nearest store
          </Button>
        </div>
      </div>
    </section>
  );
}
