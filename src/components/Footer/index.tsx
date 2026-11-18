import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Category } from "@/types";
import { cn } from "@/utils/cn";

export type FooterProps = {
  categories: Category[];
};

type FooterLink = { label: string; href: string };

const LEARN_LINKS: FooterLink[] = [
  { label: "Where to buy", href: "/where-to-buy" },
  { label: "Contact us", href: "/contact" },
];

// Figma's text-only "Ghost white" buttons have no padding or fixed height: plain links styled as text.
// `block` makes the item as tall as the link's line, so the list gaps alone set the spacing.
const LINK = "block w-fit text-cta focus-visible:outline-inverse";

export function Footer({ categories }: FooterProps) {
  const categoryLinks = categories.map((category) => ({
    label: category.name,
    href: `/categories/${category.slug}`,
  }));

  return (
    <footer className="mt-auto bg-footer px-gutter pt-12 pb-6 text-inverse desktop:pt-15">
      <div className="mx-auto flex max-w-content flex-col gap-12 desktop:gap-15">
        <div className="flex flex-col gap-12 tablet:flex-row tablet:items-start tablet:justify-between">
          <Link href="/" className="self-start focus-visible:outline-inverse">
            <Image src="/images/brand/logo-small-white.svg" alt="Octopus home" width={94} height={100} />
          </Link>

          <nav aria-label="Footer" className="flex flex-col gap-12 tablet:flex-row tablet:gap-15">
            <LinkColumn
              title="Our Products"
              links={categoryLinks}
              // Fills the two columns top to bottom, so the visual order matches the reading order.
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

function LinkColumn({ title, links, listClassName, listStyle }: LinkColumnProps) {
  return (
    <div className="flex flex-col gap-10 tablet:gap-8">
      <h2 className="text-body font-bold">{title}</h2>
      {/* Figma trims text boxes to cap height: these gaps keep its distance between lines. */}
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
