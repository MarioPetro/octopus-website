import { Button } from "@/components/Button";
import { ResponsivePicture } from "@/components/ResponsivePicture";

// One crop per breakpoint, as exported from Figma. The photo is decorative: the products are not
// named in the banner, so it has an empty alt and screen readers skip it.
const PHOTO = {
  alt: "",
  mobile: "/images/banners/warehouse-tall.png",
  tablet: "/images/banners/warehouse-small.png",
  desktop: "/images/banners/warehouse-wide.png",
};

// Colours of the left edge of the tablet photo, top to bottom (sampled from its pixels). The
// photo's red is darker than the brand red, so the fill uses the photo's own colours.
const PHOTO_EDGE_FILL = `linear-gradient(to bottom, rgb(207 23 29) 0%, rgb(206 22 29) 40%,
  rgb(211 25 30) 60%, rgb(216 25 30) 80%, rgb(216 30 33) 90%, rgb(215 52 48) 100%)`;

/**
 * The red banner pointing to the shops that sell Octopus products ("Find us at The Warehouse").
 * There is one of these on the site, so its texts and link are written here.
 * The Warehouse logo was not among the exported assets: its name is set as bold white text.
 */
export function StoreBanner() {
  return (
    <section className="relative h-[688px] text-inverse tablet:h-[500px] desktop:aspect-[12/5] desktop:h-auto">
      {/* How the photo fills the banner:
          - mobile: cover, anchored at 80% from the left so the blender is in the middle, as in
            Figma.
          - tablet (810-1199px): the banner keeps a 500px height while it widens, so a cover
            photo would lose its top and bottom. Instead the photo is never cropped (contain): it
            is as tall as the banner and sits on the right; the rest is the fill below, sampled
            from the photo's own red, and the photo's left edge fades into it.
          - desktop: cover. */}
      <div className="absolute inset-0" style={{ background: PHOTO_EDGE_FILL }}>
        <ResponsivePicture
          image={PHOTO}
          className="h-full w-full bg-transparent [&_img]:object-[80%_50%] tablet:[&_img]:object-contain tablet:[&_img]:object-right tablet:[&_img]:[mask-image:linear-gradient(to_right,transparent_calc(100%-810px),black_calc(100%-730px))] desktop:[&_img]:object-cover desktop:[&_img]:object-center desktop:[&_img]:[mask-image:none]"
        />
      </div>
      {/* The text lines up with the page content: side margin outside, 1344px column centred. */}
      <div className="relative h-full px-gutter">
        <div className="mx-auto flex h-full max-w-content flex-col items-center gap-6 pt-20 text-center tablet:items-start tablet:justify-center tablet:pt-0 tablet:text-left">
          <h2 className="flex flex-col">
            <span className="text-h3 font-book">Find us at</span>{" "}
            {/* The space keeps the accessible name "Find us at The Warehouse", not "atThe". */}
            <span className="text-h1">The Warehouse</span>
          </h2>
          {/* White focus ring: the blue one does not stand out enough on red (WCAG 1.4.11). */}
          <Button color="secondary" href="/where-to-buy" className="focus-visible:outline-inverse">
            Find your nearest store
          </Button>
        </div>
      </div>
    </section>
  );
}
