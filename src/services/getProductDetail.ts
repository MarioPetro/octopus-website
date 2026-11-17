import type { ProductDetail } from "@/types";
import { productDetailRecord } from "./source";

/**
 * Detail content for a product page.
 * MOCK: the demo has detail content for one product only (the Countertop Blender, as in
 * Figma), so every slug returns it. A real backend would return the requested product,
 * e.g. `fetch(`${API_URL}/products/${slug}`)`, and callers would not change.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the slug is part of the real contract
export async function getProductDetail(slug: string): Promise<ProductDetail> {
  // Cached per slug (arguments are part of the cache key) and prerendered at build time.
  "use cache";
  return productDetailRecord;
}
