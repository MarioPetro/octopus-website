import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BestSellersCarousel } from "@/components/BestSellersCarousel";
import { Container } from "@/components/Container";
import { FeatureGallery } from "@/components/FeatureGallery";
import { ImageFrame } from "@/components/ImageFrame";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductInfo } from "@/components/ProductInfo";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { getProductDetail, getProducts } from "@/services";
import { baseOpenGraph } from "../../shared-metadata";

// The page reads `params` before rendering, to answer 404 for unknown slugs, so a navigation to it
// may block: every real slug is prerendered anyway. Wrapping it in <Suspense> instead would bring
// back a 200 shell for unknown slugs.
export const instant = false;
// The page must be fully static. For a slug not generated at build time, the first request then
// waits for the complete render instead of streaming a 200 shell, so notFound() keeps the 404.
export const ensureStatic = "navigation";

// Width of the left column: 709 of 1344px on desktop, what the 238px sticky column leaves on tablet.
const COLUMN_SIZES = "(min-width: 1200px) 709px, (min-width: 810px) calc(100vw - 334px), 100vw";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

async function productDetail(params: PageProps<"/products/[slug]">["params"]) {
  const { slug } = await params;
  const products = await getProducts();
  if (!products.some((product) => product.slug === slug)) notFound();
  return getProductDetail(slug);
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = await productDetail(params);
  const url = `/products/${product.slug}`;
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: url },
    openGraph: {
      ...baseOpenGraph,
      url,
      title: product.name,
      description: product.shortDescription,
      images: product.image.src ? [{ url: product.image.src, alt: product.image.alt }] : undefined,
    },
  };
}

/** The structure of the product page; its contents come from the mock API. */
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const [product, products] = await Promise.all([productDetail(params), getProducts()]);
  const [packshot, ...photos] = product.gallery;

  return (
    // Clips the packshot background, which runs to the window's left edge on desktop.
    <main className="overflow-x-clip">
      <div className="-mt-header tablet:px-gutter">
        {/* One column on mobile (packshot, info, gallery); from tablet the info column sits on
            the right and sticks while the left column scrolls. */}
        <div className="mx-auto grid max-w-content grid-cols-1 gap-y-10 pb-10 tablet:grid-cols-[minmax(0,1fr)_238px] tablet:gap-x-8 tablet:gap-y-20 tablet:pb-30 desktop:grid-cols-[709fr_555fr] desktop:gap-x-20 desktop:pb-45">
          <div className="relative h-[590px] px-6 py-41 tablet:col-start-1 tablet:row-start-1 tablet:h-[733px] tablet:px-8 tablet:py-44 desktop:h-[900px] desktop:py-48">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-card tablet:-left-gutter tablet:rounded-b-[24px] desktop:-left-[100vw] desktop:rounded-none"
            />
            <ImageFrame
              image={packshot}
              sizes={COLUMN_SIZES}
              fit="contain"
              preload
              className="h-full"
            />
          </div>

          <section
            aria-labelledby="product-title"
            className="px-gutter tablet:sticky tablet:top-0 tablet:col-start-2 tablet:row-span-2 tablet:row-start-1 tablet:self-start tablet:px-0 tablet:pt-40"
          >
            <div className="desktop:w-[355px]">
              <ProductInfo
                titleId="product-title"
                name={product.name}
                description={product.description}
                colours={product.colours}
              />
            </div>
          </section>

          <div className="flex flex-col gap-10 px-gutter tablet:col-start-1 tablet:row-start-2 tablet:gap-20 tablet:px-0">
            {/* Figma's order: a photo, the feature cards, another photo. */}
            {photos[0] && <ImageFrame image={photos[0]} sizes={COLUMN_SIZES} className="aspect-[3/4] rounded-card" />}
            <FeatureGallery features={product.features} />
            {photos.slice(1).map((photo) => (
              <ImageFrame key={photo.alt} image={photo} sizes={COLUMN_SIZES} className="aspect-[3/4] rounded-card" />
            ))}
            <ProductDetails specs={product.specs} downloads={product.downloads} />
          </div>
        </div>
      </div>
      <div className="py-10 tablet:py-20">
        <Container>
          <BestSellersCarousel variant="compact" products={products.filter((item) => item.bestSeller)} />
        </Container>
      </div>
      <StickyBuyBar />
    </main>
  );
}
