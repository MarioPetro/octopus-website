import type { ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
};

/** The site's content column: side margin outside, max-width column centred inside. */
export function Container({ children }: ContainerProps) {
  return (
    <div className="px-gutter">
      <div className="mx-auto max-w-content">{children}</div>
    </div>
  );
}
