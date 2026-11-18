"use client";

import { type ReactNode, useId, useState } from "react";
import { ChevronIcon } from "@/components/icons";

export type AccordionItem = {
  title: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Which items start open: all of them (the Figma default) or none. */
  defaultOpen?: "all" | "none";
  /** Level of the heading around each toggle, to fit the page outline. */
  headingLevel?: 2 | 3 | 4;
};

/**
 * Independent sections that open and close (WAI-ARIA accordion pattern): each title is a button
 * inside a heading, with `aria-expanded`, and controls the panel below it.
 */
export function Accordion({ items, defaultOpen = "all", headingLevel = 3 }: AccordionProps) {
  const baseId = useId();
  const [open, setOpen] = useState<boolean[]>(() => items.map(() => defaultOpen === "all"));
  const Heading = `h${headingLevel}` as const;

  const toggle = (index: number) => setOpen((current) => current.map((value, i) => (i === index ? !value : value)));

  return (
    <div className="rounded-specifics bg-card px-5 py-1">
      {items.map((item, index) => {
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        const isOpen = open[index];
        return (
          <div key={item.title} className="border-b border-stroke-light py-4 last:border-b-0">
            <Heading>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 text-left text-body font-bold"
              >
                {item.title}
                <ChevronIcon
                  direction={isOpen ? "down" : "right"}
                  className="shrink-0 motion-safe:transition-transform motion-safe:duration-200"
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pt-2 text-body font-book text-secondary"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
