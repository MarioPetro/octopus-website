"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { MEDIA } from "@/utils/breakpoints";

export type NavLink = { label: string; href: string };

export type MobileMenuProps = {
  links: NavLink[];
  cta: NavLink;
};

/**
 * The navigation below 1200px. A disclosure, not a modal: as in Figma there is no backdrop and
 * the page stays usable. Closes on the toggle, Escape, a click outside or on a link, and at the
 * desktop breakpoint.
 */
export function MobileMenu({ links, cta }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const toggleId = useId();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

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
      if (panelRef.current?.contains(target) || toggle?.contains(target)) return;
      setOpen(false);
    }

    // Otherwise the menu would reopen when the window shrinks again.
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

      <div ref={panelRef} id={panelId} hidden={!open} className="basis-full desktop:hidden">
        <nav aria-label="Main">
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
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
