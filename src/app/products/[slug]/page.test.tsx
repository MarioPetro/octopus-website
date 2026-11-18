import { render, screen } from "@testing-library/react";
import { getProducts } from "@/services";
import ProductPage, { generateMetadata, generateStaticParams } from "./page";

const params = (slug: string) => ({ params: Promise.resolve({ slug }) }) as never;

describe("Product page", () => {
  it("is generated for every product in the data", async () => {
    const [staticParams, products] = await Promise.all([generateStaticParams(), getProducts()]);
    expect(staticParams.map(({ slug }) => slug)).toEqual(products.map((product) => product.slug));
  });

  it("has a single h1, the product name", async () => {
    render(await ProductPage(params("countertop-blender")));

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Octopus Countertop Blender");
  });

  it("sets the title, description and Open Graph tags from the product", async () => {
    const metadata = await generateMetadata(params("countertop-blender"));

    expect(metadata.title).toBe("Octopus Countertop Blender");
    expect(metadata.description).toMatch(/blender/i);
    expect(metadata.openGraph).toMatchObject({
      siteName: "Octopus",
      url: "/products/countertop-blender",
      title: "Octopus Countertop Blender",
    });
  });

  it("is a 404 for a slug that is not a product", async () => {
    await expect(ProductPage(params("toaster"))).rejects.toThrow();
  });
});
