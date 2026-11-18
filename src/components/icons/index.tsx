import type { SVGProps } from "react";

type ChevronIconProps = SVGProps<SVGSVGElement> & {
  direction?: "left" | "right" | "up" | "down";
};

const ROTATION = { right: 0, down: 90, left: 180, up: 270 } as const;

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

/** Decorative: the control around the icon gives the accessible name. */
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

export function MenuIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M4.15 8.15h15.7M4.15 15.85h15.7" />
    </OutlineIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <OutlineIcon {...props}>
      <path d="M5.15 5.15l13.7 13.7M18.85 5.15 5.15 18.85" />
    </OutlineIcon>
  );
}
