import { Button } from "@/components/Button";

export type SectionHeadingProps = {
  title: string;
  description: string;
  cta: { label: string; href: string };
};

/**
 * Header of the homepage category sections (Kitchen, Home Security, Accessories):
 * a centred title, a short description and a link to the full category.
 * Sections are direct children of the page, whose h1 is in the hero, so the title is an h2.
 */
export function SectionHeading({ title, description, cta }: SectionHeadingProps) {
  return (
    <header className="mx-auto flex max-w-[550px] flex-col items-center gap-8 text-center">
      <div className="flex flex-col gap-2">
        {/* Figma uses the H1 style for these titles on desktop: the size changes, not the level. */}
        <h2 className="text-h2 desktop:text-h1">{title}</h2>
        <p className="text-subtitle font-book text-secondary">{description}</p>
      </div>
      <Button color="secondary" href={cta.href}>
        {cta.label}
      </Button>
    </header>
  );
}
