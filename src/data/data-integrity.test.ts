import { existsSync } from "node:fs";
import path from "node:path";
import { categoryRecords, productDetailRecord, productRecords } from "@/services/source";
import type { CategorySlug } from "@/types";

/*
 * TypeScript cannot check JSON files against our types, so these tests do it:
 * they catch broken data and missing files before they reach the page.
 */

const categorySlugs = categoryRecords.map((category) => category.slug);

/** The homepage galleries (Kitchen, Home Security, Accessories) are designed for three products. */
const GALLERY_CATEGORIES: CategorySlug[] = ["kitchen", "home-security", "accessories"];
const PRODUCTS_PER_GALLERY = 3;

/** Collects every `src` field found anywhere inside a value. */
function collectImageSources(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(collectImageSources);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      key === "src" && typeof child === "string" ? [child] : collectImageSources(child),
    );
  }
  return [];
}

describe("categories.json", () => {
  it("has unique ids and slugs", () => {
    const ids = categoryRecords.map((category) => category.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(categorySlugs).size).toBe(categorySlugs.length);
  });

  it("gives every category a name and a description", () => {
    for (const category of categoryRecords) {
      expect(category.name.length, `${category.slug} has no name`).toBeGreaterThan(0);
      expect(category.description.length, `${category.slug} has no description`).toBeGreaterThan(0);
    }
  });
});

describe("products.json", () => {
  it("has unique ids and slugs", () => {
    const ids = productRecords.map((product) => product.id);
    const slugs = productRecords.map((product) => product.slug);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("only uses categories that exist in categories.json", () => {
    for (const product of productRecords) {
      expect(categorySlugs, `${product.slug} has an unknown category`).toContain(product.category);
    }
  });

  it("has enough products to fill every homepage gallery", () => {
    for (const category of GALLERY_CATEGORIES) {
      const count = productRecords.filter((p) => p.category === category).length;
      expect(count, `${category} has only ${count} products`).toBeGreaterThanOrEqual(
        PRODUCTS_PER_GALLERY,
      );
    }
  });

  it("has enough best sellers to fill the carousel", () => {
    expect(productRecords.filter((product) => product.bestSeller).length).toBeGreaterThanOrEqual(3);
  });

  it("gives every product image an alt text", () => {
    for (const product of productRecords) {
      expect(product.image.alt.length, `${product.slug} has no alt text`).toBeGreaterThan(0);
    }
  });

  it("gives every feature photo an alt text and a file for each breakpoint", () => {
    for (const { slug, featureImage } of productRecords) {
      if (!featureImage) continue;
      expect(featureImage.alt.length, `${slug} feature photo has no alt text`).toBeGreaterThan(0);
      for (const src of [featureImage.mobile, featureImage.tablet, featureImage.desktop]) {
        expect(existsSync(path.join(process.cwd(), "public", src)), `missing image ${src}`).toBe(true);
      }
    }
  });
});

describe("product-detail.json", () => {
  it("describes a product that exists in products.json", () => {
    const product = productRecords.find((p) => p.id === productDetailRecord.id);
    expect(product?.slug).toBe(productDetailRecord.slug);
  });

  it("has at least two colours, so the selector can change selection", () => {
    expect(productDetailRecord.colours.length).toBeGreaterThanOrEqual(2);
  });
});

describe("images", () => {
  it("exist in public/ for every src used in the data", () => {
    const sources = collectImageSources([categoryRecords, productRecords, productDetailRecord]);
    expect(sources.length).toBeGreaterThan(0);
    for (const src of sources) {
      const file = path.join(process.cwd(), "public", src);
      expect(existsSync(file), `missing image ${src}`).toBe(true);
    }
  });
});
