"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { MEDIA } from "@/utils/breakpoints";

export type NavLink = { label: string; href: string };

export type MobileMenuProps = {
  links: NavLink[];
  /** The red button at the end of the menu ("Where to buy"). */
  cta: NavLink;
};

/**
 * The collapsed navigation below 1200px: a toggle button and the panel it opens.
 * It is a disclosure (WAI-ARIA pattern), not a modal: as in the Figma prototype the panel opens
 * inside the navbar pill, over the page, with no backdrop, and the rest of the page stays usable.
 * The panel closes with the toggle, Escape (focus goes back to the toggle), a click outside,
 * a click on a link, or when the window grows to the desktop layout.
 * It renders two siblings inside the Header's pill: the toggle sits next to the logo and the
 * panel wraps to a full-width row under them (basis-full), so the pill grows downwards.
 */
export function MobileMenu({ links, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleId = useId();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // While the menu is open, listen for the ways of closing it that happen outside React's tree.
  useEffect(() => {
    if (!open) return;

    const toggle = document.getElementById(toggleId);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle?.focus();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      // The toggle handles its own clicks; anything else outside the panel closes the menu.
      if (panelRef.current?.contains(target) || toggle?.contains(target)) return;
      setOpen(false);
    }

    // From 1200px the full navigation is back, so the menu must not reopen when the window shrinks.
    const desktop = window.matchMedia(MEDIA.desktop);
    function onBreakpointChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpointChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpointChange);
    };
  }, [open, toggleId]);

  const close = () => setOpen(false);

  return (
    <>
      {/* The label stays "Menu": aria-expanded already tells whether it is open or closed. */}
      <Button
        id={toggleId}
        color="ghost-light"
        variant="icon"
        icon={open ? <CloseIcon /> : <MenuIcon />}
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="desktop:hidden"
      />

      {/* `hidden` removes the closed panel from the page, the tab order and screen readers. */}
      <div ref={panelRef} id={panelId} hidden={!open} className="basis-full desktop:hidden">
        <nav aria-label="Main">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                {/* Figma: text-only ghost links, 37px tall, aligned to the pill's padding. */}
                <Link href={link.href} onClick={close} className="flex h-9.25 items-center text-cta">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button href={cta.href} onClick={close} className="w-full">
                {cta.label}
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
