import { notFound } from "next/navigation";
import { placeholderMetadata, PlaceholderPage } from "@/components/PlaceholderPage";
import { getCategories } from "@/services";

// Same settings as the product page: see the comments in app/products/[slug]/page.tsx.
export const instant = false;
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

async function categoryName(params: PageProps<"/categories/[slug]">["params"]) {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) notFound();
  return category.name;
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">) {
  return placeholderMetadata(await categoryName(params));
}

export default async function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  return <PlaceholderPage title={await categoryName(params)} />;
}
