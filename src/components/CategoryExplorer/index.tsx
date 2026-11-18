import { ProductTile } from "@/components/ProductTile";
import type { Category } from "@/types";

export type CategoryExplorerProps = {
  categories: Category[];
};

export function CategoryExplorer({ categories }: CategoryExplorerProps) {
  return (
    <section aria-labelledby="explore-categories-title" className="flex flex-col gap-8 desktop:gap-12">
      <h2 id="explore-categories-title" data-reveal="text" className="text-center text-h3 tablet:text-left">
        Explore all categories
      </h2>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 tablet:grid-cols-4 desktop:gap-6">
        {categories.map((category) => (
          <li key={category.id} data-reveal="media">
            <ProductTile
              variant="category"
              title={category.name}
              href={`/categories/${category.slug}`}
              image={category.image}
              imageSizes="(min-width: 810px) 25vw, 50vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
