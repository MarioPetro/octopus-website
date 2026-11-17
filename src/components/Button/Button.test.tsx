import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChevronIcon } from "@/components/icons";
import { Button } from ".";

describe("Button", () => {
  it("renders a link when it has an href", () => {
    render(<Button href="/products/countertop-blender">Learn more</Button>);

    const link = screen.getByRole("link", { name: "Learn more" });
    expect(link).toHaveAttribute("href", "/products/countertop-blender");
  });

  it("renders a button, not a form submit, when it has no href", () => {
    render(<Button>Add</Button>);

    expect(screen.getByRole("button", { name: "Add" })).toHaveAttribute("type", "button");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Add</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Add
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("gives an icon-only button its accessible name from aria-label", () => {
    render(<Button variant="icon" color="secondary" icon={<ChevronIcon />} aria-label="Next slide" />);

    const button = screen.getByRole("button", { name: "Next slide" });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveTextContent(/./); // no visible text, only the icon
  });

  it("requires an aria-label for icon-only buttons (compile-time check)", () => {
    // If TypeScript ever stops rejecting this, `yarn typecheck` fails on the unused directive.
    // @ts-expect-error icon-only buttons must have an aria-label
    const element = <Button variant="icon" icon={<ChevronIcon />} />;
    expect(element).toBeDefined();
  });

  it("is reachable with the keyboard", async () => {
    render(<Button href="/where-to-buy">Where to buy</Button>);

    await userEvent.tab();

    expect(screen.getByRole("link", { name: "Where to buy" })).toHaveFocus();
  });
});
