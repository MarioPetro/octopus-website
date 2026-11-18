import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("has a single h1, the hero title", async () => {
    // The page is an async Server Component: await it to get the element, then render that.
    render(await HomePage());

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Octopus Ionic Hair Dryer");
  });

  it("shows the sections in the Figma order", async () => {
    render(await HomePage());

    const titles = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    const sections = ["Best sellers", "Kitchen", "Home Security", "Accessories", "Explore all categories"];

    // Each section's title comes after the previous one (banners may sit in between).
    const positions = sections.map((section) => titles.indexOf(section));
    expect(positions).not.toContain(-1);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});
