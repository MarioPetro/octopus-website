import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Category } from "@/types";
import { cn } from "@/utils/cn";

export type FooterProps = {
  categories: Category[];
};

type FooterLink = { label: string; href: string };

// There is one footer on the site, so its fixed links are written here (as in StoreBanner).
// Only the categories come from the data: adding one to the JSON adds it to the footer too.
const LEARN_LINKS: FooterLink[] = [
  { label: "Where to buy", href: "/where-to-buy" },
  { label: "Contact us", href: "/contact" },
];

// In Figma the footer links are text-only "Ghost white" buttons. They have no padding and no
// 40px height, so they are plain links with the button's text style, not the Button component.
// As in the Figma prototype, they have no hover state.
// `block w-fit`: the list item is exactly as tall as the link's text line (not the body's taller
// line), so the list gaps below decide the spacing on their own.
const LINK = "block w-fit text-cta focus-visible:outline-inverse";

/**
 * The red site footer: logo, "Our Products" (one link per category) and "Learn" links, then the
 * copyright line. Mobile stacks everything in one column; from tablet the logo sits on the left
 * and the link columns on the right.
 */
export function Footer({ categories }: FooterProps) {
  const categoryLinks = categories.map((category) => ({
    label: category.name,
    href: `/categories/${category.slug}`,
  }));

  return (
    <footer className="bg-footer px-gutter pt-12 pb-6 text-inverse desktop:pt-15">
      {/* Same column as the page content: side margin outside, 1344px column centred inside. */}
      <div className="mx-auto flex max-w-content flex-col gap-12 desktop:gap-15">
        <div className="flex flex-col gap-12 tablet:flex-row tablet:items-start tablet:justify-between">
          <Link href="/" className="self-start focus-visible:outline-inverse">
            {/* The logo is the link's only content, so its alt text is the link's name. */}
            <Image src="/images/brand/logo-small-white.svg" alt="Octopus home" width={94} height={100} />
          </Link>

          <nav aria-label="Footer" className="flex flex-col gap-12 tablet:flex-row tablet:gap-15">
            <LinkColumn
              title="Our Products"
              links={categoryLinks}
              // From tablet the categories fill two 123px columns, top to bottom then left to
              // right (Kitchen, Home Security | Hair Care, Accessories), so the visual order is
              // the same as the reading order. The row count grows with the number of categories.
              listClassName="tablet:grid-flow-col tablet:grid-cols-[repeat(2,123px)] tablet:grid-rows-(--rows) tablet:gap-x-6"
              listStyle={{ "--rows": `repeat(${Math.ceil(categoryLinks.length / 2)}, auto)` } as CSSProperties}
            />
            <LinkColumn title="Learn" links={LEARN_LINKS} listClassName="tablet:w-[123px]" />
          </nav>
        </div>

        <div className="flex flex-col gap-4 text-label tablet:flex-row tablet:items-center tablet:justify-between">
          <p className="font-book">Copyright 2026 Octopus - All rights reserved</p>
          <Link href="/policies" className="self-start font-book focus-visible:outline-inverse">
            Policies &amp; Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

type LinkColumnProps = {
  title: string;
  links: FooterLink[];
  listClassName?: string;
  listStyle?: CSSProperties;
};

/** A titled list of links. The heading lets screen-reader users jump between the groups. */
function LinkColumn({ title, links, listClassName, listStyle }: LinkColumnProps) {
  return (
    <div className="flex flex-col gap-10 tablet:gap-8">
      <h2 className="text-body font-bold">{title}</h2>
      {/* Figma trims each link's box to the capital letters (12px) and spaces them 24px apart on
          mobile and 16px from tablet. Here a link's line is about 18px tall (16px × 1.1), so the
          gaps are 6px smaller to keep the same distance between lines (36px and 28px). */}
      <ul className={cn("grid gap-y-4.5 tablet:gap-y-2.5", listClassName)} style={listStyle}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={LINK}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
