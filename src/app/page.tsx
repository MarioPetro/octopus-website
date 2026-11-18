import { BestSellersCarousel } from "@/components/BestSellersCarousel";
import { Button, type ButtonColor } from "@/components/Button";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { CategoryGallery } from "@/components/CategoryGallery";
import { SectionHeading } from "@/components/SectionHeading";
import { Hero } from "@/components/Hero";
import { ChevronIcon } from "@/components/icons";
import { ImageFrame } from "@/components/ImageFrame";
import { PromoBanner } from "@/components/PromoBanner";
import { StoreBanner } from "@/components/StoreBanner";
import { getCategories, getProducts } from "@/services";
import type { CategorySlug } from "@/types";

// Temporary component preview — replaced by the real homepage in a later step.
const COLORS: ButtonColor[] = ["primary", "secondary", "ghost-light", "ghost-dark"];

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const byCategory = (slug: CategorySlug) => categories.find((category) => category.slug === slug)!;
  const productsOf = (slug: CategorySlug) => products.filter((product) => product.category === slug);

  return (
    // Content column as in Figma: side margin outside, 1344px column centred inside.
    // The hero and the promo banner sit outside the column because they span the full window width.
    // No top padding: the hero starts at the top of the window, under the sticky navbar.
    <main className="flex flex-col gap-6 pb-12">
      <Hero
        title="Octopus Ionic Hair Dryer"
        description="A powerful ionic hair dryer with a 110,000 RPM motor for fast drying and less frizz"
        cta={{ label: "Learn more", href: "/products/ionic-hair-dryer" }}
      />
      <div className="px-gutter">
        <div className="mx-auto flex max-w-content flex-col gap-6">
          <h2 className="text-h3">Buttons</h2>
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

          <h2 className="text-h3">CategoryGallery</h2>
          <CategoryGallery category={byCategory("kitchen")} products={productsOf("kitchen")} layout="feature-wide" />
          <CategoryGallery
            category={byCategory("home-security")}
            products={productsOf("home-security")}
            layout="feature-tall"
          />
          <CategoryGallery category={byCategory("accessories")} products={productsOf("accessories")} layout="row" />

          <BestSellersCarousel products={products.filter((product) => product.bestSeller)} categories={categories} />

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

          <CategoryExplorer categories={categories} />

          <h2 className="text-h3">PromoBanner</h2>
        </div>
      </div>
      <PromoBanner
        title="Octopus Ionic Hair Dryer"
        description="Dry your hair faster and with less frizz with this powerful ionic hair dryer"
        cta={{ label: "Learn more", href: "/products/ionic-hair-dryer" }}
        image={{
          alt: "Woman drying her hair with the Octopus Ionic Hair Dryer",
          mobile: "/images/categories/hair-care-mobile.png",
          tablet: "/images/categories/hair-care-tablet.png",
          desktop: "/images/categories/hair-care-desktop.png",
        }}
        // Colours of the photos' left edge, top to bottom (sampled from the image pixels).
        background="linear-gradient(to bottom, rgb(217 187 166) 0%, rgb(222 193 171) 20%, rgb(225 197 175) 40%, rgb(225 197 175) 60%, rgb(222 191 168) 80%, rgb(213 182 159) 100%)"
      />
      <StoreBanner />
    </main>
  );
}
