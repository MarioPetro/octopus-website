import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColourSelector } from ".";

const colours = [
  { name: "Black", hex: "#1B1B1B" },
  { name: "Silver", hex: "#C7C9CC" },
];

describe("ColourSelector", () => {
  it("selects the first colour and names it in the group label", () => {
    render(<ColourSelector colours={colours} />);

    expect(screen.getByRole("group", { name: "Colour - Black" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Black" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Silver" })).not.toBeChecked();
  });

  it("updates the selected state and the label on click", async () => {
    render(<ColourSelector colours={colours} />);

    await userEvent.click(screen.getByRole("radio", { name: "Silver" }));

    expect(screen.getByRole("radio", { name: "Silver" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Black" })).not.toBeChecked();
    expect(screen.getByRole("group", { name: "Colour - Silver" })).toBeInTheDocument();
  });

  it("can be used with the keyboard: Tab enters the group, arrows change colour", async () => {
    render(<ColourSelector colours={colours} />);

    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "Black" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Silver" })).toBeChecked();
  });

  it("renders nothing without colours", () => {
    const { container } = render(<ColourSelector colours={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
