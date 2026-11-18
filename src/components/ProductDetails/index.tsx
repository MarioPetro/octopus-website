import { Accordion } from "@/components/Accordion";
import { Button } from "@/components/Button";
import { DownloadIcon } from "@/components/icons";
import type { Link, SpecSection } from "@/types";

export type ProductDetailsProps = {
  specs: SpecSection[];
  downloads: Link[];
};

/** The specification sections as an accordion, then the downloads, which do not collapse. */
export function ProductDetails({ specs, downloads }: ProductDetailsProps) {
  if (specs.length === 0 && downloads.length === 0) return null;

  return (
    <section aria-labelledby="product-details-title" className="flex flex-col gap-4">
      {/* Figma shows no title here; this one keeps the heading levels in order for screen readers. */}
      <h2 id="product-details-title" className="sr-only">
        Product details
      </h2>

      {specs.length > 0 && (
        <Accordion items={specs.map((section) => ({ title: section.title, content: <SpecItems items={section.items} /> }))} />
      )}

      {downloads.length > 0 && (
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 rounded-specifics bg-card px-5 py-2">
          <h3 className="text-body font-bold">Downloads</h3>
          <ul className="flex flex-wrap">
            {downloads.map((download) => (
              <li key={download.href}>
                {/* -mr-4 lines the label up with the box edge, as the Figma ghost button has no side padding. */}
                <Button color="ghost-light" href={download.href} className="-mr-4">
                  <DownloadIcon />
                  {download.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** A list when a section has several lines, plain text when it has one (as in Figma). */
function SpecItems({ items }: { items: string[] }) {
  if (items.length === 1) return <p>{items[0]}</p>;
  return (
    <ul className="list-disc pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
