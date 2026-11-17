/**
 * Breakpoints as media queries, for the places CSS classes cannot reach (<picture>, <video>, sizes).
 * They must match --breakpoint-tablet and --breakpoint-desktop in src/app/globals.css.
 */
export const MEDIA = {
  tablet: "(min-width: 810px)",
  desktop: "(min-width: 1200px)",
} as const;
