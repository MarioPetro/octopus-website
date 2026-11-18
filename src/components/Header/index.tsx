import Link from "next/link";
import { Button } from "@/components/Button";
import type { Category } from "@/types";
import { MEDIA } from "@/utils/breakpoints";
import { MobileMenu, type NavLink } from "./MobileMenu";

export type HeaderProps = {
  categories: Category[];
};

const WHERE_TO_BUY: NavLink = { label: "Where to buy", href: "/where-to-buy" };

/** Sticky translucent navbar: full navigation from 1200px, MobileMenu below. */
export function Header({ categories }: HeaderProps) {
  const links: NavLink[] = categories.map((category) => ({
    label: category.name,
    href: `/categories/${category.slug}`,
  }));

  return (
    // Fixed height: the open menu grows over the page instead of pushing it down.
    // The transparent header lets clicks through; only the pill catches them.
    <header className="pointer-events-none sticky top-0 z-50 h-header px-gutter pt-2 tablet:pt-4">
      <div className="pointer-events-auto mx-auto flex max-w-content flex-wrap items-center justify-between gap-y-4 rounded-navbar bg-navbar px-4 py-2 shadow-navbar backdrop-blur-navbar desktop:py-3 desktop:pr-3 desktop:pl-5">
        <Link href="/" className="flex h-10.75 items-center desktop:h-10">
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
