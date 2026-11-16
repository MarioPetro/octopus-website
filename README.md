# Octopus Website — demo

Demo of two pages of the Octopus consumer electronics site (Homepage and the
Octopus Countertop Blender product page), built from the Figma "Flows" page at
three breakpoints: desktop ≥ 1200 px, tablet 810–1199 px, mobile < 810 px.

> Work in progress: architecture, trade-offs, AI usage and Lighthouse reports
> will be documented here as the project progresses.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4, with design tokens defined once as CSS variables
- Vitest + Testing Library for component tests
- Playwright for end-to-end tests (desktop Chrome and mobile Safari)

## Setup

Requires Node 24 (see `.nvmrc`). Yarn 4 is pinned in `package.json` and activated through Corepack.

```bash
nvm use
corepack enable
yarn install
yarn playwright install chromium webkit
yarn dev
```

## Scripts

| Command | What it does |
| --- | --- |
| `yarn dev` | Start the dev server |
| `yarn build` / `yarn start` | Production build and server |
| `yarn lint` | ESLint |
| `yarn typecheck` | Generate route types and run `tsc` |
| `yarn test` | **All tests**: component tests, then e2e against a production build |
| `yarn test:unit` | Component tests only |
| `yarn test:e2e` | End-to-end tests only |

## Design tokens

All design tokens live in [`src/app/globals.css`](src/app/globals.css), in Tailwind 4 `@theme`
blocks. Each token becomes both a CSS variable and a utility class, and its comment names the
Figma token it comes from (e.g. `--color-accent` ← `Alias tokens/Text/Accent`).

- **Breakpoints**: `tablet:` (≥ 810 px) and `desktop:` (≥ 1200 px); mobile is the default.
- **Colours**: the default Tailwind palette is removed, so only design-system colours can be used.
- **Typography**: `text-h1`, `text-h2`, `text-h3` and `text-subtitle` are responsive tokens. They
  hold the Figma "S" size and switch to "M" and "L" at the tablet and desktop breakpoints, so
  components write a single class.
- **Layout**: `px-gutter` (16 / 32 / 48 px side margin) and `max-w-content` (1344 px).

## Decisions and trade-offs

- **Satoshi is loaded from the Fontshare CDN, not self-hosted.** The ITF Free Font License allows
  self-hosting on your own site but forbids redistributing the font file, including through a
  repository, so the file cannot be committed. Serving it from the CDN costs an extra connection to
  a third-party domain. This is mitigated with `preconnect` hints, `font-display: swap` and an
  Arial fallback resized to Satoshi's metrics (`size-adjust` and the ascent, descent and line-gap
  overrides), which keeps layout shift close to zero while the font loads. The alternative was a
  script that downloads the font from Fontshare at install time and self-hosts it.
