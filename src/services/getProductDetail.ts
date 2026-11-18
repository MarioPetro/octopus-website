import type { ProductDetail } from "@/types";
import { productDetailRecord } from "./source";

/** MOCK: the demo has detail content for the Countertop Blender only, so every slug returns it. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the slug is part of the real contract
export async function getProductDetail(slug: string): Promise<ProductDetail> {
  "use cache";
  return productDetailRecord;
}
