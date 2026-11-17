import type { SVGProps } from "react";

type ChevronIconProps = SVGProps<SVGSVGElement> & {
  direction?: "left" | "right" | "up" | "down";
};

const ROTATION = { right: 0, down: 90, left: 180, up: 270 } as const;

/**
 * Figma "General / Chevron-right / 24 px / Outline". Decorative: the control that
 * contains it provides the accessible name, so it is hidden from screen readers.
 */
export function ChevronIcon({ direction = "right", style, ...props }: ChevronIconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${ROTATION[direction]}deg)`, ...style }}
      {...props}
    >
      <path d="M9.5 6.5 15 12l-5.5 5.5" />
    </svg>
  );
}
