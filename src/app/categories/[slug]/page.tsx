import { notFound } from "next/navigation";
import { placeholderMetadata, PlaceholderPage } from "@/components/PlaceholderPage";
import { getCategories } from "@/services";

// The page reads `params` before rendering anything, so navigating to it waits for the server
// instead of showing a shell first. That is fine for a placeholder, and it keeps a real 404
// status for a slug that is not a category (notFound() below).
export const instant = false;

// One page per category in the data, prerendered at build time.
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
