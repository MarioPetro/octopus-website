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
- **Layout**: `px-gutter` (16 / 32 / 48 px side margin) and `max-w-content` (1344 px). As in
  Figma, the margin goes on an outer element and the 1344 px column is centred inside it
  (`px-gutter` > `mx-auto max-w-content`), so on a 1600 px screen the content is 1344 px wide
  with 128 px on each side. Full-width sections (banners) sit outside the column.
- **Radius**: `rounded-card` is 16 px on mobile and 28 px from tablet, as in Figma.

## Content and data access

```
src/
  data/       categories.json, products.json, product-detail.json (mock API responses)
  types/      category.ts, product.ts, media.ts (+ index.ts re-exports)
  services/   mock data access: getCategories(), getProducts(), getProductDetail(slug)
```

- **Data holds the content, the code holds the structure.** Which sections a page has, their order
  and their layout are written in `page.tsx`; the categories and products they display come from
  the mock API. The galleries take their title and description from the category.
- **Who calls what.** The root layout calls `getCategories()` for the navbar and the footer, which
  appear on every page. The homepage calls `getProducts()` and `getCategories()` and filters the
  products for each component (by `category` for the galleries, by `bestSeller` for the carousel).
  Components never call services: they receive data as props, which keeps them simple to test.
- **When.** Pages are prerendered at build time, so the data is already in the HTML and the
  browser makes no data requests. Service functions use the `"use cache"` directive: the layout and
  the page share one `getCategories()` call, and the result stays part of the static page even
  once the mock becomes a `fetch` to a real backend.
- Pages never import the JSON files: they call the functions in `@/services`. `src/services` is a
  data access layer, not Next.js route handlers (pages are prerendered at build time, when no
  server is listening, so they read data directly instead of through HTTP).
- Every service function is `async` even though it reads local JSON today. Switching to a headless
  CMS or a backend changes only the body of these functions (`fetch` instead of a JSON import).
- **Links are built from slugs**: `/products/{slug}` and `/categories/{slug}`. Pages outside the
  scope of the demo (categories, where to buy, contact, policies, downloads) are not built, so
  their links land on the not-found page; building the page later needs no change to the links.
- Each homepage gallery shows the first three products of its category **in the order of
  `products.json`**, and the first one gets the large card. Adding a product to `products.json` is
  enough to show it in the right section; its position in the file decides whether it makes the
  top three.
- Every card links to `/products/{slug}`. The product page reads the slug from the URL and calls
  `getProductDetail(slug)`, which is a **mock**: the demo has detail content for the Countertop
  Blender only, so it returns that for any slug (the brief allows every card to open that page).
- Image sizes are not stored in the data: `ImageFrame` reserves space with a CSS aspect-ratio box
  taken from the Figma layout and `next/image` fills it (`fill` + `object-fit`), so any image fits
  without layout shift. Images are lazy-loaded except the LCP image (`preload`), each one declares
  its rendered width with `sizes`, and Next serves AVIF (WebP fallback): the 1.6 MB kitchen PNG
  arrives as a ~12 KB AVIF at card size. Missing assets render as a neutral box of the same size.
- Banners whose crop changes per breakpoint (Hair Dryer promo, store banner) use
  `ResponsivePicture`: a `<picture>` with one `<source media>` per breakpoint, built with Next's
  `getImageProps()` so each file is still optimised. The browser downloads only the file for the
  current breakpoint (checked with Playwright at 390, 900 and 1440 px).
- `src/data/data-integrity.test.ts` checks what TypeScript cannot check in JSON: unique ids and
  slugs, known categories, enough products for every gallery and the carousel, and that every image
  referenced in the data exists in `public/`.

## Assumptions

- **Hidden texts in Figma are used.** On desktop and tablet some titles and descriptions (e.g. the
  homepage hero heading) exist in the layers but are covered by images or video in the render.
  They are treated as part of the design and shown at every breakpoint.
- **Hair Care has a description in the data** even though Figma shows no Hair Care section (the
  homepage promotes the Ionic Hair Dryer instead). Every category has one, so the data stays uniform.
- **A second colour (Silver) is added to the Countertop Blender.** Figma only shows Black, but the
  brief asks for the colour selector to update its selected state, which needs at least two options.
- **The large gallery cards show the packshot.** In Figma the first card of the Kitchen and Home
  Security galleries (Kettle, Indoor Camera) uses a lifestyle photo, which was not part of the
  exported assets. These cards show the product packshot on the grey card instead, like the other
  cards, so the page has no empty boxes; adding the photos later is a data change.
- **Missing assets use neutral placeholders** of the right aspect ratio: the hero video and the
  product page gallery and feature images were not part of the exported assets. In the data these
  images have no `src`.
- **The Warehouse logo is set as text.** In the store banner Figma shows the retailer's logo, a
  vector that was not among the exported assets. Its name is written as bold white text instead
  ("Find us at / The Warehouse"), rather than redrawing another company's logo by hand.

## Decisions and trade-offs

- **Focus ring colour is darker than in Figma.** Figma's focus ring is a light blue (`#B1CAF7`,
  1.7:1 on white); WCAG 1.4.11 asks for 3:1 for focus indicators. The ring keeps the same shape and
  hue, darkened just enough to pass (`#5B8EEE`, 3.2:1). On red backgrounds (footer, store banner)
  the ring is white instead, since no blue passes there.
- **Button names.** Figma calls the white bordered button "Special"; in code it is `secondary`.
  `Button` takes a `color` (`primary`, `secondary`, `ghost-light`, `ghost-dark`) and a `variant`
  (`text`, or `icon` for the 40 px round icon-only button, which requires an `aria-label`). With an
  `href` it renders a link, otherwise a `<button>`.

- **One `ProductCard`, laid out by its parent.** Figma has "Card Large", "Card Medium" and "Card
  Small", but with packshots they share one structure: texts plus image, side by side
  (`horizontal`), stacked with the texts on top (`vertical`) or with the image on top
  (`media-top`). The layout often changes between breakpoints (the Indoor Camera card is
  horizontal on tablet and vertical on desktop), so the card takes `tabletLayout` and
  `desktopLayout`; on mobile every card is vertical. The card fills its grid cell, so its size is
  decided by the gallery, not by the card.
- **`CategoryGallery` takes a grid layout, not a category.** Kitchen, Home Security and
  Accessories are the same component with `layout="feature-wide"`, `"feature-tall"` and `"row"`.
  Each layout lists its three positions (card height per breakpoint, card layout, image `sizes`),
  so a new category can reuse an existing grid without changing the component. Card heights are
  fixed per breakpoint as in Figma, because the height decides how much room is left for the
  image; the tablet heights were measured from the Figma frame and are approximate.
- **The best sellers carousel uses native scrolling, no library.** The row is a list with
  `overflow-x: auto` and CSS scroll snapping, so swipe, trackpad and keyboard focus scroll it
  without JavaScript. The arrows only call `scrollBy` (one card at a time, without animation when
  the user prefers reduced motion) and read the scroll position on every `scroll` event: "previous"
  is disabled on the first product and "next" on the last, however the row was scrolled. It is
  the only Client Component of the homepage. Two quick clicks move one card, because the second
  click lands while the first scroll is still animating.
- **`PromoBanner` is generic; the homepage passes the Ionic Hair Dryer content.** Title,
  description, link, the three image crops and the `background` fill are props, so another
  product can be promoted with the same component. It uses the three Figma exports
  (`categories/hair-care-*.png`). As in the Figma prototype, from tablet the photo is shifted to
  the right by 13% of the width so the woman clears the text, and its left edge fades into the
  fill. On mobile it is a 3:4 box resting on the bottom edge, as wide as the screen but at most
  402px (the Figma mobile frame), so the head stays below the text at every phone width; on
  screens wider than 402px its sides fade into the fill. The fill is a gradient sampled from the
  photo's edge pixels, so it continues the photo's own background where the photo ends.
- **`StoreBanner` is separate from `PromoBanner`.** Both follow the same Figma "Banner" layout,
  but the store banner has white text, a logo instead of a title, no description and a white
  button. Rather than adding options to `PromoBanner`, `StoreBanner` has its texts, link and
  photos written in it (there is one on the site). Its button keeps the white focus ring used on
  red backgrounds. On tablet the banner keeps a 500px height while it widens up to 1199px, so the
  photo is shown whole (`object-fit: contain`) on the right instead of being cropped, over a fill
  sampled from the photo's own red (darker than the brand red), into which its left edge fades.
- **Horizontal cards use one left padding (40px).** In Figma the large horizontal cards (best
  sellers, Kettle) have 64px on tablet and 80px on desktop; keeping a single value avoids a size
  prop on `ProductCard`, at the cost of the text starting slightly further left on those cards.

- **Satoshi is loaded from the Fontshare CDN, not self-hosted.** The ITF Free Font License allows
  self-hosting on your own site but forbids redistributing the font file, including through a
  repository, so the file cannot be committed. Serving it from the CDN costs an extra connection to
  a third-party domain. This is mitigated with `preconnect` hints, `font-display: swap` and an
  Arial fallback resized to Satoshi's metrics (`size-adjust` and the ascent, descent and line-gap
  overrides), which keeps layout shift close to zero while the font loads. The alternative was a
  script that downloads the font from Fontshare at install time and self-hosts it.
