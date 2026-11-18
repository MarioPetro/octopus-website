import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("has a single h1, the hero title", async () => {
    // Async Server Component: await it, then render the element.
    render(await HomePage());

    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Octopus Ionic Hair Dryer");
  });

  it("shows the sections in the Figma order", async () => {
    render(await HomePage());

    const titles = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    const sections = ["Best sellers", "Kitchen", "Home Security", "Accessories", "Explore all categories"];

    const positions = sections.map((section) => titles.indexOf(section));
    expect(positions).not.toContain(-1);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});
