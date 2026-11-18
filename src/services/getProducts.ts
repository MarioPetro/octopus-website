import type { Product } from "@/types";
import { productRecords } from "./source";

/** All products, in data order. MOCK: a real backend would `fetch` them. */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  return productRecords;
}
