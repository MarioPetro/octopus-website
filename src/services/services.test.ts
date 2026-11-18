import { getCategories, getProductDetail, getProducts } from "./index";

describe("getCategories (mock)", () => {
  it("returns the categories in navigation order", async () => {
    const categories = await getCategories();
    expect(categories.map((category) => category.slug)).toEqual([
      "kitchen",
      "home-security",
      "hair-care",
      "accessories",
    ]);
  });
});

describe("getProducts (mock)", () => {
  it("returns every product in data order", async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThan(0);
    const kitchen = products.filter((product) => product.category === "kitchen");
    expect(kitchen.slice(0, 3).map((product) => product.slug)).toEqual(["kettle", "blender", "countertop-blender"]);
  });
});

describe("getProductDetail (mock)", () => {
  it("returns the Countertop Blender detail for any slug", async () => {
    for (const slug of ["countertop-blender", "kettle", "unknown"]) {
      const detail = await getProductDetail(slug);
      expect(detail.name).toBe("Octopus Countertop Blender");
    }
  });
});
