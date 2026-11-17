import type { Category } from "@/types";
import { categoryRecords } from "./source";

/**
 * All categories, in navigation order. Called by the root layout (navbar, footer)
 * and by the homepage (galleries, "Explore all categories").
 * MOCK: reads local JSON; a real backend would be `fetch(`${API_URL}/categories`)`.
 */
export async function getCategories(): Promise<Category[]> {
  // Caches the result: layout and page share one call, and the data becomes part of
  // the page prerendered at build time (also once this function uses fetch).
  "use cache";
  return categoryRecords;
}
