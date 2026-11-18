import type { Category } from "@/types";
import { categoryRecords } from "./source";

/** All categories, in navigation order. MOCK: a real backend would `fetch` them. */
export async function getCategories(): Promise<Category[]> {
  // Layout and page share one call, and the data is prerendered at build time.
  "use cache";
  return categoryRecords;
}
