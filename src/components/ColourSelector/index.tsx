"use client";

import { useId, useState } from "react";
import type { Colour } from "@/types";

export type ColourSelectorProps = {
  colours: Colour[];
};

/**
 * Native radio buttons styled as swatches: the browser handles arrow keys, Tab and the
 * "1 of 2" announcement. The legend names the selected colour.
 */
export function ColourSelector({ colours }: ColourSelectorProps) {
  const name = useId();
  const [selected, setSelected] = useState(colours[0]?.name);

  if (colours.length === 0) return null;

  return (
    <fieldset>
      {/* A legend ignores the parent's gap, so it carries its own margin. */}
      <legend className="mb-3 text-body font-book text-secondary">Colour - {selected}</legend>
      <div className="flex flex-wrap gap-2">
        {colours.map((colour) => (
          <label
            key={colour.name}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border-2 border-transparent has-checked:border-accent has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
          >
            <input
              type="radio"
              name={name}
              value={colour.name}
              checked={colour.name === selected}
              onChange={() => setSelected(colour.name)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className="size-7.5 rounded-full border border-swatch-stroke"
              style={{ backgroundColor: colour.hex }}
            />
            <span className="sr-only">{colour.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
