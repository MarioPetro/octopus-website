"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { ChevronIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/types";

export type BestSellersCarouselProps = {
  /** The products to show, in order (the page passes the best sellers). */
  products: Product[];
  /** Used to show each product's category name above its title. */
  categories: Category[];
};

/**
 * A horizontal row of product cards that scrolls natively: swipe on touch screens, trackpad or
 * the arrow buttons. CSS scroll snapping stops every card aligned to the left edge.
 * Client Component: the arrows need the scroll position to know when to be disabled.
 */
export function BestSellersCarousel({ products, categories }: BestSellersCarouselProps) {
  const listRef = useRef<HTMLUListElement>(null);
  // Before the first measurement (server render) the row is at its start.
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Reads the scroll position. It runs on every scroll, so the arrows stay right whether the
  // user swipes, uses the trackpad, tabs through the links or clicks the arrows.
  const updateArrows = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    // 1px of tolerance: browsers can report fractional scroll positions.
    setAtStart(list.scrollLeft <= 1);
    setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    updateArrows();
    list.addEventListener("scroll", updateArrows, { passive: true });
    // The visible width changes with the window, and with it whether the end is reached.
    window.addEventListener("resize", updateArrows);
    return () => {
      list.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  // Scrolls by one card (its width plus the gap), so the next card snaps into place.
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

  const categoryName = (product: Product) =>
    categories.find((category) => category.slug === product.category)?.name;

  return (
    <section aria-labelledby="best-sellers-title" className="flex flex-col gap-8 tablet:gap-10">
      <h2 id="best-sellers-title" className="text-h3">
        Best sellers
      </h2>
      {/* The row reaches the edges of the window (negative margin over the page gutter), so the
          next card peeks in; scroll-padding keeps snapped cards aligned with the page content. */}
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
              product={product}
              category={categoryName(product)}
              tabletLayout="horizontal"
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
