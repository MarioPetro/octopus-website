import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from ".";

const items = [
  { title: "Technical specifications", content: <p>Power: 1500W</p> },
  { title: "Dimensions & weight", content: <p>Weight: 4.2 kg</p> },
];

describe("Accordion", () => {
  it("starts with every section open, each title a button in a heading", () => {
    render(<Accordion items={items} />);

    const button = screen.getByRole("button", { name: "Technical specifications" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button.parentElement?.tagName).toBe("H3");
    expect(screen.getByRole("region", { name: "Technical specifications" })).toHaveTextContent("Power: 1500W");
    expect(screen.getByText("Weight: 4.2 kg")).toBeVisible();
  });

  it("closes and reopens one section without touching the others", async () => {
    render(<Accordion items={items} />);
    const button = screen.getByRole("button", { name: "Technical specifications" });

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Power: 1500W")).not.toBeVisible();
    expect(screen.getByText("Weight: 4.2 kg")).toBeVisible();

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Power: 1500W")).toBeVisible();
  });

  it("works with the keyboard", async () => {
    render(<Accordion items={items} />);

    await userEvent.tab();
    expect(screen.getByRole("button", { name: "Technical specifications" })).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getByText("Power: 1500W")).not.toBeVisible();

    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByText("Weight: 4.2 kg")).not.toBeVisible();
  });

  it("links each button to the panel it controls", () => {
    render(<Accordion items={items} />);

    const button = screen.getByRole("button", { name: "Dimensions & weight" });
    expect(document.getElementById(button.getAttribute("aria-controls")!)).toHaveTextContent("Weight: 4.2 kg");
  });

  it("can start closed and use another heading level", () => {
    render(<Accordion items={items} defaultOpen="none" headingLevel={4} />);

    const button = screen.getByRole("button", { name: "Technical specifications" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button.parentElement?.tagName).toBe("H4");
  });
});
