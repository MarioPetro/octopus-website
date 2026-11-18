import { expect, test } from "@playwright/test";

test("goes from the homepage to the Countertop Blender page and uses it", async ({ page, isMobile }) => {
  await page.goto("/");

  // The Kitchen gallery card, rendered from the data.
  await page.getByRole("link", { name: "Learn more about Octopus Countertop Blender" }).click();

  await expect(page).toHaveURL("/products/countertop-blender");
  await expect(page).toHaveTitle("Octopus Countertop Blender | Octopus");
  await expect(page.getByRole("heading", { level: 1, name: "Octopus Countertop Blender" })).toBeVisible();

  // Colour selector: choosing Silver updates the selected state and the label.
  // The radio is visually hidden: click its swatch, as a user would.
  await page.locator("label", { has: page.getByRole("radio", { name: "Silver" }) }).click();
  await expect(page.getByRole("radio", { name: "Silver" })).toBeChecked();
  await expect(page.getByRole("group", { name: "Colour - Silver" })).toBeVisible();

  // Specifications accordion: open by default, closes and reopens.
  const specs = page.getByRole("button", { name: "Technical specifications" });
  const power = page.getByText("Power: 1500W");
  await expect(specs).toHaveAttribute("aria-expanded", "true");
  await expect(power).toBeVisible();
  await specs.click();
  await expect(specs).toHaveAttribute("aria-expanded", "false");
  await expect(power).toBeHidden();
  await specs.click();
  await expect(power).toBeVisible();

  // "Where to buy": in the info column on desktop, in the bar fixed at the bottom on mobile.
  const whereToBuy = page.getByRole("main").getByRole("link", { name: "Where to buy" });
  await expect(whereToBuy).toHaveCount(1);
  await expect(whereToBuy).toBeVisible();
  const box = await whereToBuy.boundingBox();
  const viewport = page.viewportSize();
  if (isMobile) expect(box!.y + box!.height).toBeGreaterThan(viewport!.height - 70);
  else expect(box!.y).toBeLessThan(viewport!.height);

  // The best sellers lead to other product pages.
  await expect(page.getByRole("region", { name: "Best sellers" }).getByRole("link")).not.toHaveCount(0);
});

// The first request is the one that matters: Next renders unknown slugs on demand.
test("answers 404 for a product or category that does not exist, from the first request", async ({
  page,
  browserName,
}) => {
  // A slug per project, so each test makes the first request for its own.
  const products = await page.goto(`/products/toaster-${browserName}`);
  expect(products?.status()).toBe(404);
  const categories = await page.goto(`/categories/garden-${browserName}`);
  expect(categories?.status()).toBe(404);
});
