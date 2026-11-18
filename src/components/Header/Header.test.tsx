import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Category } from "@/types";
import { Header } from ".";

const CATEGORIES: Category[] = [
  { id: "c-1", slug: "kitchen", name: "Kitchen", description: "", image: { alt: "" } },
  { id: "c-2", slug: "hair-care", name: "Hair Care", description: "", image: { alt: "" } },
];

// jsdom applies no CSS, so both the desktop nav and the menu are in the DOM here; the closed
// menu panel is still left out by its `hidden` attribute.
const getToggle = () => screen.getByRole("button", { name: "Menu" });

describe("Header", () => {
  beforeAll(() => {
    // jsdom has no matchMedia; the menu uses it to close when the window reaches desktop width.
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it("links the logo to the homepage", () => {
    render(<Header categories={CATEGORIES} />);

    expect(screen.getByRole("link", { name: "Octopus home" })).toHaveAttribute("href", "/");
  });

  it("links to every category it receives, in order, then Where to buy", () => {
    render(<Header categories={CATEGORIES} />);

    const nav = screen.getByRole("navigation", { name: "Main" });
    const links = within(nav).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual(["Kitchen", "Hair Care", "Where to buy"]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/categories/kitchen",
      "/categories/hair-care",
      "/where-to-buy",
    ]);
  });

  it("starts with the menu closed", () => {
    render(<Header categories={CATEGORIES} />);

    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
    // Only the desktop nav is exposed: the closed panel is hidden.
    expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(1);
  });

  it("opens and closes the menu with the toggle", async () => {
    const user = userEvent.setup();
    render(<Header categories={CATEGORIES} />);

    await user.click(getToggle());
    expect(getToggle()).toHaveAttribute("aria-expanded", "true");
    const panel = document.getElementById(getToggle().getAttribute("aria-controls")!)!;
    expect(panel).toBeVisible();
    expect(within(panel).getByRole("link", { name: "Kitchen" })).toBeInTheDocument();

    await user.click(getToggle());
    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
    expect(panel).not.toBeVisible();
  });

  it("works with the keyboard and closes on Escape, giving focus back to the toggle", async () => {
    const user = userEvent.setup();
    render(<Header categories={CATEGORIES} />);

    getToggle().focus();
    await user.keyboard("{Enter}");
    expect(getToggle()).toHaveAttribute("aria-expanded", "true");

    // Tab moves into the panel: its first link follows the toggle.
    await user.tab();
    expect(screen.getAllByRole("link", { name: "Kitchen" }).at(-1)).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
    expect(getToggle()).toHaveFocus();
  });

  it("closes when a link in the menu is chosen", async () => {
    const user = userEvent.setup();
    render(<Header categories={CATEGORIES} />);

    await user.click(getToggle());
    const panel = document.getElementById(getToggle().getAttribute("aria-controls")!)!;
    // jsdom cannot load another page: stop the browser navigation, the menu still sees the click.
    panel.addEventListener("click", (event) => event.preventDefault());
    await user.click(within(panel).getByRole("link", { name: "Hair Care" }));

    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on a click outside the menu", async () => {
    const user = userEvent.setup();
    render(<Header categories={CATEGORIES} />);

    await user.click(getToggle());
    await user.click(document.body);

    expect(getToggle()).toHaveAttribute("aria-expanded", "false");
  });
});
