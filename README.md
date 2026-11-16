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

