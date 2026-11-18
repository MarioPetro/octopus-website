import Link from "next/link";
import { ImageFrame } from "@/components/ImageFrame";
import type { Category } from "@/types";

export type CategoryExplorerProps = {
  categories: Category[];
};

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  return (
    <section aria-labelledby="explore-categories-title" className="flex flex-col gap-8 desktop:gap-12">
      <h2 id="explore-categories-title" className="text-center text-h3 tablet:text-left">
        Explore all categories
      </h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 tablet:grid-cols-4 desktop:gap-6">
        {categories.map((category) => (
          <li key={category.id}>
            <Link href={`/categories/${category.slug}`} className="group flex flex-col gap-4 text-center">
              <ImageFrame
                image={category.image}
                sizes="(min-width: 810px) 25vw, 50vw"
                fit="contain"
                className="aspect-square rounded-card motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-300 group-hover:[&_img]:scale-105 group-focus-visible:[&_img]:scale-105"
              />
              <span className="text-title font-book">{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
