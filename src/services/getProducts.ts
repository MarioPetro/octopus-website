import type { Product } from "@/types";
import { productRecords } from "./source";

/**
 * All products, in data order. Pages filter them (by category, best seller) for each component.
 * MOCK: reads local JSON; a real backend would be `fetch(`${API_URL}/products`)`.
 */
export async function getProducts(): Promise<Product[]> {
  // Cached and prerendered at build time (see getCategories).
  "use cache";
  return productRecords;
}
