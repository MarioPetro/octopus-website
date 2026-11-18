import Link from "next/link";
import { Button } from "@/components/Button";
import type { Category } from "@/types";
import { MEDIA } from "@/utils/breakpoints";
import { MobileMenu, type NavLink } from "./MobileMenu";

export type HeaderProps = {
  categories: Category[];
};

// As in the Footer, only the categories come from the data; "Where to buy" is a fixed link.
const WHERE_TO_BUY: NavLink = { label: "Where to buy", href: "/where-to-buy" };

/**
 * The site header: a translucent pill that stays at the top of the window while the page
 * scrolls under it (Figma "Navbar", scroll position: Sticky).
 * From 1200px it shows the full navigation; below, the links collapse into a menu (MobileMenu).
 * Server Component: only the menu toggle needs JavaScript, so only MobileMenu is a Client Component.
 */
export function Header({ categories }: HeaderProps) {
  const links: NavLink[] = categories.map((category) => ({
    label: category.name,
    href: `/categories/${category.slug}`,
  }));

  return (
    // The header reserves a fixed height (h-header) in the page: when the menu opens, the pill
    // grows past it and covers the page instead of pushing it down, as in the Figma prototype.
    // The header box is see-through, so it lets clicks through and only the pill catches them.
    <header className="pointer-events-none sticky top-0 z-50 h-header px-gutter pt-2 tablet:pt-4">
      <div className="pointer-events-auto mx-auto flex max-w-content flex-wrap items-center justify-between gap-y-4 rounded-navbar bg-navbar px-4 py-2 shadow-navbar backdrop-blur-navbar desktop:py-3 desktop:pr-3 desktop:pl-5">
        <Link href="/" className="flex h-10.75 items-center desktop:h-10">
          {/* Mobile shows only the octopus mark; from tablet the mark with the "Octopus" type.
              <picture> downloads only the file whose media query matches. Being the link's only
              content, the alt text is the link's name. SVGs need no optimisation, so a plain <img>. */}
          <picture>
            <source media={MEDIA.tablet} srcSet="/images/brand/logo-large-red.svg" width={108} height={32} />
            <img src="/images/brand/logo-mark-red.svg" alt="Octopus home" width={32} height={32} />
          </picture>
        </Link>

        <nav aria-label="Main" className="hidden desktop:block">
          <ul className="flex items-center gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Button color="ghost-light" href={link.href}>
                  {link.label}
                </Button>
              </li>
            ))}
            <li>
              <Button href={WHERE_TO_BUY.href}>{WHERE_TO_BUY.label}</Button>
            </li>
          </ul>
        </nav>

        <MobileMenu links={links} cta={WHERE_TO_BUY} />
      </div>
    </header>
  );
}
