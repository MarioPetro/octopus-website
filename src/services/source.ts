import categoriesJson from "@/data/categories.json";
import productDetailJson from "@/data/product-detail.json";
import productsJson from "@/data/products.json";
import type { Category, Product, ProductDetail } from "@/types";

/*
 * The mock data source: the only place that knows the data lives in local JSON files.
 * JSON imports are not checked against our types by TypeScript, so the types are
 * asserted here and verified by src/data/data-integrity.test.ts.
 */
export const productRecords = productsJson as Product[];
export const productDetailRecord = productDetailJson as ProductDetail;
export const categoryRecords = categoriesJson as Category[];
