import { BestSellersCarousel } from "@/components/BestSellersCarousel";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { CategoryGallery } from "@/components/CategoryGallery";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { PromoBanner } from "@/components/PromoBanner";
import { Reveal } from "@/components/Reveal";
import { StoreBanner } from "@/components/StoreBanner";
import { getCategories, getProducts } from "@/services";
import type { CategorySlug } from "@/types";

/** The structure of the page lives here; the categories and products come from the mock API. */
export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const byCategory = (slug: CategorySlug) => categories.find((category) => category.slug === slug)!;
  const productsOf = (slug: CategorySlug) => products.filter((product) => product.category === slug);

  return (
    // The hero and the banners are full-bleed, so they skip the Container. Each Reveal is the
    // scroll reveal trigger of a section (Figma "Motion Documentation"); the hero and the banners
    // are not in its list.
    <main className="flex flex-col gap-section">
      <Hero
        title="Octopus Ionic Hair Dryer"
        description="A powerful ionic hair dryer with a 110,000 RPM motor for fast drying and less frizz"
        cta={{ label: "Learn more", href: "/products/ionic-hair-dryer" }}
      />

      <Container>
        <Reveal>
          <BestSellersCarousel products={products.filter((product) => product.bestSeller)} categories={categories} />
        </Reveal>
      </Container>

      <Container>
        <Reveal>
          <CategoryGallery category={byCategory("kitchen")} products={productsOf("kitchen")} layout="feature-wide" />
        </Reveal>
      </Container>

      {/* Hair Care has no product section: in Figma it is promoted by this banner. */}
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
        // The photos' left-edge colours.
        background="linear-gradient(to bottom, rgb(217 187 166) 0%, rgb(222 193 171) 20%, rgb(225 197 175) 40%, rgb(225 197 175) 60%, rgb(222 191 168) 80%, rgb(213 182 159) 100%)"
      />

      <Container>
        <Reveal>
          <CategoryGallery
            category={byCategory("home-security")}
            products={productsOf("home-security")}
            layout="feature-tall"
          />
        </Reveal>
      </Container>

      <Container>
        <Reveal>
          <CategoryGallery category={byCategory("accessories")} products={productsOf("accessories")} layout="row" />
        </Reveal>
      </Container>

      <Container>
        <Reveal>
          <CategoryExplorer categories={categories} />
        </Reveal>
      </Container>

      <StoreBanner />
    </main>
  );
}
