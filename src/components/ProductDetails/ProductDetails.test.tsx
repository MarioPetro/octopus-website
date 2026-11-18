import { render, screen, within } from "@testing-library/react";
import { ProductDetails } from ".";

const specs = [
  { title: "Technical specifications", items: ["Power: 1500W", "Voltage: 220–240 V"] },
  { title: "Product information", items: ["Model: BL9023-CB"] },
];
const downloads = [{ label: "User manual", href: "/downloads/manual.pdf" }];

describe("ProductDetails", () => {
  it("shows each spec section in the accordion, as a list when it has several lines", () => {
    render(<ProductDetails specs={specs} downloads={downloads} />);

    const technical = screen.getByRole("region", { name: "Technical specifications" });
    expect(within(technical).getAllByRole("listitem")).toHaveLength(2);
    const information = screen.getByRole("region", { name: "Product information" });
    expect(within(information).queryByRole("list")).not.toBeInTheDocument();
    expect(information).toHaveTextContent("Model: BL9023-CB");
  });

  it("shows the downloads as links that do not collapse", () => {
    render(<ProductDetails specs={specs} downloads={downloads} />);

    expect(screen.getByRole("heading", { level: 3, name: "Downloads" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Downloads" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "User manual" })).toHaveAttribute("href", "/downloads/manual.pdf");
  });

  it("renders nothing without specs or downloads", () => {
    const { container } = render(<ProductDetails specs={[]} downloads={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
