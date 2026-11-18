import categoriesJson from "@/data/categories.json";
import productDetailJson from "@/data/product-detail.json";
import productsJson from "@/data/products.json";
import type { Category, Product, ProductDetail } from "@/types";

// TypeScript does not check JSON imports against our types: data-integrity.test.ts does.
export const productRecords = productsJson as Product[];
export const productDetailRecord = productDetailJson as ProductDetail;
export const categoryRecords = categoriesJson as Category[];
