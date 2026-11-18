"use client";

import { type ElementType, type ReactNode, useEffect, useRef } from "react";

/** How far an element rises: `text` for text-only blocks (30px), `media` for cards and images (60px). */
export type RevealTravel = "text" | "media";

export type RevealProps = {
  children: ReactNode;
  /** The element to render, e.g. `li` when the group is an item of a list. */
  as?: ElementType;
  /** Animates the wrapper itself; otherwise only the descendants marked with `data-reveal` move. */
  travel?: RevealTravel;
  className?: string;
};

/**
 * Figma "Motion Documentation" scroll reveal. The wrapper is the trigger: when it enters the
 * screen, every element inside marked `data-reveal="text" | "media"` fades in and rises together,
 * once. The movement itself is CSS (globals.css); this component only sets `data-reveal-state`.
 *
 * The server HTML is fully visible: the content is hidden only after hydration, and only if it is
 * still below the screen, so there is no flash, nothing is lost without JavaScript and the
 * elements in view at load (the LCP) never wait.
 */
export function Reveal({ children, as: Tag = "div", travel, className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    // Already on screen, or scrolled past: it stays as it is.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    element.dataset.revealState = "pending";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.revealState = "shown";
        // Plays once: no exit animation, no replay when scrolling back.
        observer.disconnect();
      },
      // Fires when the top of the group is 10% of the screen above the bottom edge.
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal={travel} className={className}>
      {children}
    </Tag>
  );
}
