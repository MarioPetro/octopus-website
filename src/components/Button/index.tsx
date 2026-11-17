import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/utils/cn";

/** The four button types of the Figma Design System ("Special" in Figma is our "secondary"). */
export type ButtonColor = "primary" | "secondary" | "ghost-light" | "ghost-dark";

type ButtonContent =
  /** A label, with an optional icon after it. */
  | { variant?: "text"; children: ReactNode; icon?: ReactNode }
  /** A 40px circle with only an icon: it has no visible text, so a label is required. */
  | { variant: "icon"; icon: ReactNode; "aria-label": string; children?: never };

/** With `href` it is a link (it navigates); without, a <button> (it does something). */
type ButtonElement =
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "color" | "children">)
  | ({ href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "children">);

export type ButtonProps = ButtonContent & ButtonElement & { color?: ButtonColor };

const BASE =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-button border " +
  "text-cta whitespace-nowrap transition-colors duration-150 disabled:cursor-not-allowed";

// `not-disabled:` keeps hover and pressed styles off disabled buttons, and still applies to links.
const COLORS: Record<ButtonColor, string> = {
  primary:
    "border-button-primary-stroke bg-button-primary text-inverse " +
    "not-disabled:hover:bg-button-primary-hover not-disabled:active:bg-button-primary-pressed " +
    "disabled:border-disabled disabled:bg-disabled disabled:text-disabled-foreground",
  secondary:
    "border-stroke bg-main text-primary " +
    "not-disabled:hover:bg-button-secondary-hover not-disabled:active:bg-button-secondary-pressed " +
    "disabled:bg-disabled disabled:text-disabled-foreground",
  "ghost-light": "border-transparent bg-transparent text-primary disabled:text-disabled-foreground",
  // Used on red or dark backgrounds, where the blue focus ring would not be visible.
  "ghost-dark":
    "border-transparent bg-transparent text-inverse focus-visible:outline-inverse " +
    "disabled:text-disabled-foreground",
};

const VARIANTS = {
  text: "px-4",
  icon: "w-10",
};

// In Figma only the icon-only ghost button shows a background on hover and press.
const GHOST_ICON_STATES =
  "not-disabled:hover:bg-button-secondary-hover not-disabled:active:bg-button-secondary-pressed";

export function Button(props: ButtonProps) {
  const { color = "primary", variant = "text", icon, children, className, ...rest } = props;

  const classes = cn(
    BASE,
    COLORS[color],
    VARIANTS[variant],
    variant === "icon" && color === "ghost-light" && GHOST_ICON_STATES,
    className,
  );
  const content = variant === "icon" ? icon : (
    <>
      {children}
      {icon}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link {...rest} className={classes}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {content}
    </button>
  );
}
