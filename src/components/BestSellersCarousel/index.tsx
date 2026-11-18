"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ChevronIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/types";

export type BestSellersCarouselProps = {
  products: Product[];
  /** To show each product's category name. */
  categories: Category[];
};

/** A natively scrolling row of cards with scroll snapping; the arrows track the scroll position. */
export function BestSellersCarousel({ products, categories }: BestSellersCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateArrows = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    // Browsers can report fractional scroll positions.
    setAtStart(list.scrollLeft <= 1);
    setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    updateArrows();
    list.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      list.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCard = (direction: 1 | -1) => {
    const list = listRef.current;
    const firstCard = list?.firstElementChild;
    if (!list || !firstCard) return;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const categoryName = (product: Product) => categories.find((category) => category.slug === product.category)?.name;

  return (
    <section aria-labelledby="best-sellers-title" className="flex flex-col gap-8 tablet:gap-10">
      <h2 id="best-sellers-title" className="text-h3">
        Best sellers
      </h2>
      {/* Bleeds to the window edges so the next card peeks in; scroll-padding keeps snapped
          cards aligned with the page content. */}
      <ul
        ref={listRef}
        className="-mx-gutter flex snap-x snap-mandatory scroll-px-gutter gap-4 overflow-x-auto px-gutter [scrollbar-width:none] desktop:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <li
            key={product.id}
            className="h-[512px] w-[320px] shrink-0 snap-start tablet:h-[413px] tablet:w-[688px] desktop:h-[589px] desktop:w-[1048px]"
          >
            <ProductCard
              tag={categoryName(product)}
              title={product.name}
              description={product.shortDescription}
              href={`/products/${product.slug}`}
              image={product.image}
              textPosition={{ base: "top", tablet: "left" }}
              imageSizes="(min-width: 1200px) 524px, (min-width: 810px) 344px, 320px"
            />
          </li>
        ))}
      </ul>
      <div className="flex justify-end gap-2">
        <Button
          color="secondary"
          variant="icon"
          icon={<ChevronIcon direction="left" />}
          aria-label="Previous product"
          disabled={atStart}
          onClick={() => scrollByCard(-1)}
        />
        <Button
          color="secondary"
          variant="icon"
          icon={<ChevronIcon />}
          aria-label="Next product"
          disabled={atEnd}
          onClick={() => scrollByCard(1)}
        />
      </div>
    </section>
  );
}
