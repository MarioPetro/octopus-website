import { render, screen } from "@testing-library/react";
import { getCategories } from "@/services";
import CategoryPage, { generateStaticParams } from "./page";

describe("Category placeholder page", () => {
  it("is generated for every category in the data", async () => {
    const [params, categories] = await Promise.all([generateStaticParams(), getCategories()]);
    expect(params.map(({ slug }) => slug)).toEqual(categories.map((category) => category.slug));
  });

  it("shows the category name", async () => {
    render(await CategoryPage({ params: Promise.resolve({ slug: "home-security" }) } as never));

    expect(screen.getByRole("heading", { level: 1, name: "Home Security" })).toBeInTheDocument();
  });

  it("is a 404 for a slug that is not a category", async () => {
    await expect(CategoryPage({ params: Promise.resolve({ slug: "garden" }) } as never)).rejects.toThrow();
  });
});
