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

type IconProps = SVGProps<SVGSVGElement>;

/** Shared frame of the 24px outline icons: decorative, the control around them names them. */
function OutlineIcon({ children, ...props }: IconProps) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Figma "General / Hamburger / 24 px / Outline": two 15.7px lines, 7.7px apart. */
export function MenuIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M4.15 8.15h15.7M4.15 15.85h15.7" />
    </OutlineIcon>
  );
}

/** Figma "General / Close / 24 px / Outline": a 13.7px cross. */
export function CloseIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M5.15 5.15l13.7 13.7M18.85 5.15 5.15 18.85" />
    </OutlineIcon>
  );
}
