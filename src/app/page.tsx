import { Button, type ButtonColor } from "@/components/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ChevronIcon } from "@/components/icons";
import { ImageFrame } from "@/components/ImageFrame";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/services";
import { ResponsivePicture } from "@/components/ResponsivePicture";

// Temporary component preview — replaced by the real homepage in a later step.
const COLORS: ButtonColor[] = ["primary", "secondary", "ghost-light", "ghost-dark"];

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = (slug: string) => products.find((product) => product.slug === slug)!;

  return (
    <main className="mx-auto flex max-w-content flex-col gap-6 px-gutter py-12">
      <h1 className="text-h3">Buttons</h1>
      {COLORS.map((color) => (
        <div
          key={color}
          className={`flex flex-wrap items-center gap-4 rounded-card p-4 ${color === "ghost-dark" ? "bg-footer" : ""}`}
        >
          <span className={`w-28 text-label ${color === "ghost-dark" ? "text-inverse" : ""}`}>{color}</span>
          <Button color={color} href="#">
            Learn more
          </Button>
          <Button color={color} disabled>
            Disabled
          </Button>
          <Button color={color} variant="icon" icon={<ChevronIcon />} aria-label="Next slide" />
          <Button
            color={color}
            variant="icon"
            icon={<ChevronIcon direction="left" />}
            aria-label="Previous slide"
            disabled
          />
        </div>
      ))}

      <h2 className="text-h3">SectionHeading</h2>
      <SectionHeading
        title="Kitchen"
        description="Powerful appliances for everyday cooking"
        cta={{ label: "Explore all products", href: "/categories/kitchen" }}
      />

      <h2 className="text-h3">ProductCard</h2>
      <div className="grid gap-2 tablet:grid-cols-2">
        <div className="tablet:col-span-2 desktop:h-[600px]">
          <ProductCard product={bySlug("kettle")} tabletLayout="horizontal" />
        </div>
        <div className="desktop:h-[880px]">
          <ProductCard product={bySlug("blender")} />
        </div>
        <div className="desktop:h-[880px]">
          <ProductCard product={bySlug("countertop-blender")} />
        </div>
      </div>
      <div className="grid gap-2 tablet:grid-cols-2 desktop:grid-rows-2">
        <div className="tablet:col-span-2 desktop:col-span-1 desktop:row-span-2">
          <ProductCard product={bySlug("indoor-camera")} tabletLayout="horizontal" desktopLayout="vertical" />
        </div>
        <ProductCard product={bySlug("outdoor-camera")} desktopLayout="horizontal" />
        <ProductCard product={bySlug("video-doorbell")} desktopLayout="horizontal" />
      </div>
      <div className="grid gap-2 tablet:grid-cols-3">
        <ProductCard product={bySlug("power-bank")} tabletLayout="media-top" />
        <ProductCard product={bySlug("power-board")} tabletLayout="media-top" />
        <ProductCard product={bySlug("magnetic-charging-station")} tabletLayout="media-top" />
      </div>
      <div className="desktop:h-[589px] desktop:w-[1048px]">
        <ProductCard product={bySlug("air-fryer")} tabletLayout="horizontal" category="Kitchen" />
      </div>

      <h2 className="text-h3">ImageFrame</h2>
      <div className="grid grid-cols-3 gap-4">
        <ImageFrame
          image={{ src: "/images/products/kettle.png", alt: "Octopus Kettle 1.7 L" }}
          sizes="33vw"
          fit="contain"
          className="aspect-square rounded-card"
        />
        <ImageFrame
          image={{ src: "/images/categories/kitchen-desktop.png", alt: "Woman using a blender" }}
          sizes="33vw"
          className="aspect-square rounded-card"
        />
        <ImageFrame image={{ alt: "Missing lifestyle photo" }} sizes="33vw" className="aspect-square rounded-card" />
      </div>

      <h2 className="text-h3">ResponsivePicture</h2>
      <ResponsivePicture
        image={{
          alt: "Woman drying her hair with the Octopus Ionic Hair Dryer",
          mobile: "/images/categories/hair-care-mobile.png",
          tablet: "/images/categories/hair-care-tablet.png",
          desktop: "/images/categories/hair-care-desktop.png",
        }}
        className="aspect-[3/4] rounded-card tablet:aspect-[5/2] desktop:aspect-[12/5]"
      />
    </main>
  );
}
