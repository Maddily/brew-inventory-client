import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Product from "./Product";
import { MemoryRouter } from "react-router";

vi.mock("../../../../utils/utils", () => ({
  formatPrice: vi.fn(() => "$20.00"),
}));

vi.mock("../../../../hooks/useAvailability", () => ({
  default: vi.fn(() => ({
    availability: "In stock",
    availabilityClassName: "in-stock",
  })),
}));

describe("Product", () => {
  function renderWithCategory() {
    render(
      <MemoryRouter>
        <Product
          name="Brazil Santos"
          price="20"
          stockQuantity="50"
          category="Coffee"
          path="/products/1"
          state={{ from: "all" }}
        />
      </MemoryRouter>
    );
  }

  function renderWithoutCategory() {
    render(
      <MemoryRouter>
        <Product
          name="Brazil Santos"
          price="20"
          stockQuantity="50"
          path="/products/1"
          state={{ from: "all" }}
        />
      </MemoryRouter>
    );
  }

  it("renders a link pointing to the given path", () => {
    renderWithCategory();
    expect(
      screen.getByRole("link", { name: /brazil santos/i })
    ).toHaveAttribute("href", "/products/1");
  });

  it("renders the product name", () => {
    renderWithCategory();
    expect(screen.getByText("Brazil Santos")).toBeInTheDocument();
  });

  it("renders the category name when category is provided", () => {
    renderWithCategory();
    expect(screen.getByText("Coffee")).toBeInTheDocument();
  });

  it("does not render a category when category is falsy", () => {
    renderWithoutCategory();
    expect(screen.queryByText("Coffee")).not.toBeInTheDocument();
  });

  it("renders the formatted price", () => {
    renderWithCategory();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
  });

  it("renders the stock quantity", () => {
    renderWithCategory();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders the availability label", () => {
    renderWithCategory();
    expect(screen.getByText("In stock")).toBeInTheDocument();
  });

  it("renders an accessible label containing the name, category, price, quantity, and availability", () => {
    renderWithCategory();
    expect(
      screen.getByRole("link", {
        name: /brazil santos, coffee, 20 dollars, stock quantity 50, In stock/i,
      })
    ).toBeInTheDocument();
  });

  it("formats hyphenated category names in the accessible label", () => {
    render(
      <MemoryRouter>
        <Product
          name="Cold Brew"
          price="5"
          stockQuantity="10"
          category="Ready-to-Drink"
          path="/products/2"
          state={{ from: "all" }}
        />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("link", { name: /ready to drink/i })
    ).toBeInTheDocument();
  });
});
