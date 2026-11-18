# Octopus Website — demo

Demo of two pages of the Octopus consumer electronics site, the Homepage and the Octopus Countertop
Blender product page, built from the Figma "Flows" page at three breakpoints: desktop ≥ 1200 px,
tablet 810–1199 px, mobile < 810 px.

**Live demo:** https://octopus-website-flame.vercel.app/

## Setup and run

Requires Node 24 (`.nvmrc`). Yarn 4 is pinned in `package.json` and activated through Corepack.

```bash
nvm use
corepack enable
yarn install
yarn playwright install chromium webkit
yarn dev
```

| Command | What it does |
| --- | --- |
| `yarn dev` | Dev server on http://localhost:3000 |
| `yarn build` / `yarn start` | Production build and server |
| `yarn test` | **All tests**: component tests, then end-to-end tests against a production build |
| `yarn test:unit` / `yarn test:e2e` | Component tests only / end-to-end tests only |
| `yarn lint` / `yarn typecheck` | ESLint / route types and `tsc` |

Component tests (Vitest + Testing Library) sit next to each component and cover, among others,
the carousel arrows, the accordion and the colour selector, with mouse and keyboard. The
end-to-end test (Playwright, desktop Chrome and mobile Safari) goes from the homepage card to the
Countertop Blender page, picks a colour, toggles a specification section and checks "Where to
buy"; another test checks that unknown slugs answer 404. `src/data/data-integrity.test.ts`
checks what TypeScript cannot check in JSON (unique slugs, known categories, existing images).

## Architecture

**Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4.

```
src/
  app/          routes: homepage, products/[slug], placeholder routes
  components/   one folder per component, with its test
  data/         categories.json, products.json, product-detail.json (mock API responses)
  services/     getCategories(), getProducts(), getProductDetail(slug)
  types/        typed models for categories, products and images
```

- **Data holds the content, code holds the structure.** Each `page.tsx` decides which sections a
  page has and in which order; products and categories come from the services. Adding a product
  to `products.json` shows it in its category gallery (first three of each category, in file
  order) and, with `bestSeller: true`, in the carousel.
- **Pages call services, components receive props.** Components never fetch, which keeps them
  simple to test. Services are `async` and use `"use cache"`, so moving to a headless CMS changes
  only their bodies.
- **Everything is prerendered at build time.** `generateStaticParams` generates every product
  page; unknown slugs return a real 404 (see trade-offs).
- **Design tokens are defined once** in `src/app/globals.css` (Tailwind `@theme`), each commented
  with its Figma token. The default Tailwind palette is removed; `text-h1`…`text-subtitle` and
  `px-gutter` are responsive tokens, so components write one class.
- **Only interactive parts are Client Components:** header menu, carousel, colour selector,
  accordion and the scroll reveal wrapper.
- **SEO:** title template, description and Open Graph in the root layout; per-product title,
  description, canonical URL and Open Graph image through `generateMetadata`; placeholder pages
  are `noindex`.

### Components

Reused across both pages: `Button`, `SectionHeading`, `ProductCard`, `ProductTile`,
`BestSellersCarousel`, `Accordion`, `ImageFrame`, `ResponsivePicture`, `Container`.

- **`ProductCard`** receives contents (`tag`, `title`, `description`, `href`, `image`), not a
  `Product`, so it also works for content that is not a catalogue product. One `textPosition` prop
  (`top`, `bottom`, `left`, `right`, `center`), as a single value or per breakpoint, replaces the
  Figma "Card Large / Medium / Small" variants: the image takes the opposite side, or fills the
  card behind the texts with `cover`. The card fills its grid cell; the parent decides its size.
- **`CategoryGallery`** takes a grid layout (`feature-wide`, `feature-tall`, `row`), not a
  category, so a new category reuses an existing grid.
- **`BestSellersCarousel`** uses native horizontal scrolling with CSS scroll snapping, no library:
  swipe, trackpad and keyboard work without JavaScript; the arrows call `scrollBy` and are
  disabled at the start and end. `variant="feature"` (homepage) shows `ProductCard`s,
  `variant="compact"` (product page) shows `ProductTile`s.
- **`Accordion`** follows the WAI-ARIA pattern (`<button>` in a heading, `aria-expanded`,
  labelled region); the colour selector is native radio buttons styled as swatches.
- **Images:** `ImageFrame` reserves space with the Figma aspect ratio and `next/image` fills it,
  so there is no layout shift; images are lazy except the LCP one, with `sizes` and AVIF/WebP.
  Banners whose crop changes per breakpoint use `<picture>`, so only one file is downloaded.

## Assumptions

Where the brief and Figma differ, or leave a gap:

- **Pagination dots in the carousel.** The brief asks for them on desktop, but no Figma frame
  shows them. The carousel follows Figma: arrows on desktop, swipe on touch devices.
- **Navigation on tablet.** The brief collapses the navigation into the menu below 1200 px, while
  the Figma tablet frame shows the full navigation. The menu follows the brief.
- **Missing assets.** Some images were not among the exported assets and were taken from
  screenshots of the Figma file; the hero video is missing and is replaced by a neutral
  placeholder of the same ratio. The retailer logo in the store banner is set as text.
- **Downloads is a row of links, not an accordion section:** in Figma it is a separate box with a
  single link, so there is nothing to collapse.
- **A second colour (Silver) is added to the Blender**, so the colour selector has a state to
  change; Figma shows Black only.
- **Texts hidden or missing in some Figma frames are shown at every breakpoint** (hero heading,
  feature card texts on mobile, product info on tablet and mobile), using the real data.
- Pages outside the demo (categories, where to buy, contact, policies) are placeholder routes.

## Trade-offs

- **Focus ring darker than Figma** (`#5B8EEE` instead of `#B1CAF7`) to reach the 3:1 contrast
  WCAG asks for focus indicators; white on red backgrounds.
- **One left padding (40 px) on horizontal cards**, instead of Figma's 64/80 px on the largest
  ones, to avoid a size prop on `ProductCard`.
- **Satoshi comes from the Fontshare CDN.** Its licence forbids redistributing the file through a
  repository. The extra connection is mitigated with `preconnect`, `font-display: swap` and an
  Arial fallback resized to Satoshi's metrics, which keeps layout shift near zero.
- **Unknown slugs are a 404 from the first request.** By default Next streams a 200 shell before
  `notFound()` runs; `ensureStatic = "navigation"` waits for the complete static render, so the
  status stays 404 and the build fails if the page ever reads request-time data.

## With more time

- `sitemap.ts`, `robots.ts` and `Product` JSON-LD structured data.
- Build the other pages.

## Lighthouse reports (mobile)

TODO <!-- screenshots or exported reports for the Homepage and the product page -->

## AI usage

- **Tools:** Claude Code (desktop app), with the Figma MCP server and Claude in Chrome to read the
  Figma file (the MCP refused the view-only file, so values were read from the browser). Commits
  written with it carry a `Co-Authored-By: Claude` trailer.
- **Which parts:**
  - Next.js configuration.
  - Extracting the CSS variables from the Figma design system.
  - Writing and running the tests.
  - Generating the components, following my directions on structure and props.
  - Reviewing SEO and accessibility.
- **How:** the directions, the structure and the decisions are mine. I defined the components,
  their props and the trade-offs above; Claude Code wrote the code following them, and I reviewed
  every change before committing it. Next.js 16 behaviour was checked against the docs shipped in
  `node_modules`, not taken from the model's memory.
- **Where I corrected or rewrote the output:**
  - **`ProductCard` structure.** The first version took a whole
    `Product` plus `tabletLayout` and `desktopLayout`, with three named layouts (`vertical`,
    `horizontal`, `media-top`). I proposed a simpler API: the card receives only its contents and
    a single `textPosition`, per breakpoint when needed, so it works outside the catalogue and the
    parent maps products to cards (commit `c648c64`).
