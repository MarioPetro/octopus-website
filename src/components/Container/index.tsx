import type { ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
};

/**
 * The site's content column, as in Figma: the page side margin outside (16 → 32 → 48px) and a
 * column of at most 1344px centred inside. Full-bleed blocks (hero, banners) skip it.
 */
export function Container({ children }: ContainerProps) {
  return (
    <div className="px-gutter">
      <div className="mx-auto max-w-content">{children}</div>
    </div>
  );
}
