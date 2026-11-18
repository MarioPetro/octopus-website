import { notFound } from "next/navigation";
import { placeholderMetadata, PlaceholderPage } from "@/components/PlaceholderPage";
import { getCategories } from "@/services";

// The page must be fully static. For a slug not generated at build time, the first request then
// waits for the complete render instead of streaming a 200 shell, so notFound() keeps the 404.
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
