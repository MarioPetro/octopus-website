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

Component tests sit next to each component (`*.test.tsx`), and cover for example the carousel
arrows, the accordion and the colour selector, with the mouse and the keyboard. The end-to-end
test (`e2e/product-page.spec.ts`) runs on desktop Chrome and mobile Safari: it opens the
Countertop Blender from its homepage card, picks a colour, closes and reopens a specification
section and checks where "Where to buy" is on each device; another test checks that unknown
product and category slugs answer 404.

> **Dev server and new design tokens.** After adding a token to an `@theme` block in
> `globals.css`, restart `yarn dev`: the running dev server can keep serving the old theme.

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
  A slug that is not in `products.json` is a 404.
- On the product page the structure is in `page.tsx` (packshot, info, photo, feature cards, photo,
  specifications, best sellers) and every content comes from the product detail: the packshot
  (`image`), the gallery photos, features, specs, downloads and colours. The best sellers are the products with `bestSeller`, as
  on the homepage.
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
- **Missing assets use neutral placeholders** of the right aspect ratio: the hero video was not part
  of the exported assets. An image with no `src` in the data renders as that placeholder.
- **The navigation collapses into the menu below 1200px, as the brief asks.** The Figma tablet
  frame still shows the full navigation; the brief's acceptance criterion wins here.
- **The best sellers carousel has no pagination dots, as in Figma.** The brief mentions dots, but
  no frame shows them; the arrows and swipe cover the navigation.
- **Downloads is a row of links, not an accordion section.** The brief lists it among the sections
  that expand and collapse; Figma shows it as a separate box whose only content is the "User
  manual" link, so there is nothing to hide.
- **The feature card texts are shown at every breakpoint.** The Figma mobile frame hides them,
  which is a mistake in the file, and the tablet frame shows placeholder copy ("Title feature 1"):
  both use the real texts from the data.
- **The product info texts are shown on tablet and mobile.** In the Figma prototype the title and
  description do not render there (Satoshi Variable is missing), but the layers exist with their
  content and styles (H2, Body).
- **The specification boxes use a 16px radius.** Figma names the radius "Specifics", whose value
  cannot be read with view-only access; 16px was measured on the prototype.
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
  the only Client Component of the homepage besides the scroll reveal wrapper (`Reveal`). Two quick clicks move one card, because the second
  click lands while the first scroll is still animating. The row also sets `overflow-y: hidden`:
  `overflow-x: auto` alone makes the other axis `auto` too, and the 2px of descenders below the
  last line of text were enough to let the row scroll vertically under the mouse.
- **The carousel has two variants, the cards stay two components.** `variant="feature"` (homepage)
  shows the large `ProductCard`s; `variant="compact"` (product page) shows `ProductTile`s, the
  small card with the texts below the packshot that "Explore all categories" also uses. Scrolling
  and arrows are shared. A `ProductTile` is not a `ProductCard` option because it differs in more
  than the text position: the grey box is only behind the image, the whole tile is the link (no
  "Learn more"), the image zooms on hover and the type sizes are smaller.
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
- **Tiles are one link each, with a decorative image.** In "Explore all categories" and in the
  product page carousel the packshot has an empty alt and the title names the link
  (`aria-labelledby`), so a screen reader announces "Kitchen, link" once instead of an image and a
  name; on product tiles the description is read after it, as the link's description. As in the Figma prototype, on hover the
  packshot zooms in by 5% inside its frame; keyboard focus does the same, and the animation is
  skipped for users who prefer reduced motion.
- **"Learn more" links carry hidden text, not an `aria-label`.** The homepage repeats "Learn more"
  (cards, hero, promo banner), so each link adds the product or section title in a visually
  hidden span ("Learn more about Octopus Blender").
  Screen readers announce the same name either way, but Lighthouse's SEO audit "Links do not have
  descriptive text" reads only the link's text, so with `aria-label` it flagged all 16 links.
- **Horizontal cards use one left padding (40px).** In Figma the large horizontal cards (best
  sellers, Kettle) have 64px on tablet and 80px on desktop; keeping a single value avoids a size
  prop on `ProductCard`, at the cost of the text starting slightly further left on those cards.

Product page:

- **One grid, the same HTML order at every breakpoint.** The page is a CSS grid: packshot, product
  info, then the gallery column. On mobile they stack in that order; from tablet the info sits in a
  right column that spans both rows and is `position: sticky`, so it stays on screen while the
  photos, feature cards and specifications scroll (as in the Figma prototype), and stops before the
  best sellers. Screen readers meet the title right after the packshot on every device. As in
  Figma, the packshot's grey background runs to the window's left edge; `overflow-x: clip` on
  `<main>` cuts the excess (`hidden` would break the sticky column).
- **The colour selector is native radio buttons.** They are visually hidden inside a `<fieldset>`
  and styled as swatches through their label (`has-checked:`, `has-focus-visible:`), so the
  browser handles Tab, the arrow keys and the "1 of 2" announcement. The legend names the selected
  colour ("Colour - Silver"). It is the only Client Component of the product info.
- **"Where to buy" moves to a fixed bar on mobile**, as in the Figma mobile frame. Pages that render
  the bar mark it with `data-buy-bar`, and one rule (`body:has([data-buy-bar])`) reserves its
  height under the footer, so the last links are not covered; the layout knows nothing about it.
- **The feature cards are their own component.** Their type (20/28px titles, black text), their
  alignment (centred on top up to tablet, left on desktop) and the missing link differ from
  `ProductCard` on almost every property. On desktop every third card is wide (wide, half, half,
  wide…), so more features in the data continue the Figma bento.
- **The accordion follows the WAI-ARIA pattern** rather than `<details>`: each title is a
  `<button>` in a heading with `aria-expanded` and `aria-controls`, and the panel is a labelled
  region. It takes the items, which ones start open and the heading level, so it is reusable
  outside the product page. All sections start open, as in the prototype.
- **Hidden section titles.** The feature cards and the specifications have no title in Figma; an
  `<h2>` visible only to screen readers keeps the heading levels in order (`h1` → `h2` → `h3`).
- **Unknown slugs are a 404 from the first request.** With Cache Components, a slug that was not
  generated at build time is rendered on its first visit, and by default Next starts streaming a
  200 page shell before `notFound()` runs. `ensureStatic = "navigation"` makes that first request
  wait for the complete static render, so the status stays 404; it also makes the build fail if the
  page ever reads request-time data. The pages also keep `instant = false`: they read `params`
  before rendering, so Next's instant-navigation check (dev only) would flag the navigation as
  blocking, and its suggested fix, `<Suspense>` around `params`, would bring back the 200 shell.
  Every real slug is prerendered, so the navigation does not wait in practice. The category
  placeholder pages use the same settings.
- **Shared Open Graph fields live in one module.** Metadata merges shallowly, so a page that sets
  `openGraph` replaces the layout's whole object; `shared-metadata.ts` holds the fields every page
  repeats.

Motion:

- **Scroll reveal from the Figma "Motion Documentation", without a library.** When a section
  enters the screen its elements fade in and rise together, once: 1.2s ease-out after 0.1s, 60px
  for cards and images, 30px for text-only blocks (headings), only the fade for users who prefer
  reduced motion. `Reveal` is a small Client Component that wraps a section and is the trigger:
  an `IntersectionObserver` sets `data-reveal-state` on it, and the elements inside marked
  `data-reveal="media"` or `"text"` move with a CSS transition (`globals.css`). The marks are plain
  attributes, so the cards and headings stay Server Components and no wrapper is added inside the
  lists. On the homepage each section is one group (heading and cards start together, as the
  Figma asks); on the product page, which has no section headings, each block of the left column
  and each feature card reveals on its own.
- **The content is visible without JavaScript and the top of the page never waits.** The server
  HTML has nothing hidden: after hydration `Reveal` hides only the groups still below the screen.
  So there is no flash, no layout shift (only `opacity` and `translate` change) and nothing to wait
  for when JavaScript fails.
- **Not every element in the Figma list is animated.** The homepage hero heading (H01) and the
  product info (P01) are on screen at load and are the largest elements there (the LCP): starting
  them invisible would delay them by 1.3s and lower the Lighthouse Performance score. The category
  page items (C01–C04) do not apply, since that page is a placeholder.

- **Satoshi is loaded from the Fontshare CDN, not self-hosted.** The ITF Free Font License allows
  self-hosting on your own site but forbids redistributing the font file, including through a
  repository, so the file cannot be committed. Serving it from the CDN costs an extra connection to
  a third-party domain. This is mitigated with `preconnect` hints, `font-display: swap` and an
  Arial fallback resized to Satoshi's metrics (`size-adjust` and the ascent, descent and line-gap
  overrides), which keeps layout shift close to zero while the font loads. The alternative was a
  script that downloads the font from Fontshare at install time and self-hosts it.
