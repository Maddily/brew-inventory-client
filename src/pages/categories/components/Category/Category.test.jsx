import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Category from "./Category";

describe("Category", () => {
  function MockIcon() {
    return <svg data-testid="mock-icon" />;
  }

  function renderCategory(props = {}) {
    const defaultProps = {
      icon: MockIcon,
      id: 1,
      name: "Coffee",
      description: "Single-origin and blended coffees.",
      productCount: "5",
      path: "/categories/1",
    };
    return render(
      <MemoryRouter>
        <Category {...defaultProps} {...props} />
      </MemoryRouter>
    );
  }

  it("renders the category name", () => {
    renderCategory();
    expect(screen.getByText("Coffee")).toBeInTheDocument();
  });
  it("renders the category description", () => {
    renderCategory();
    expect(
      screen.getByText(/single-origin and blended coffees/i)
    ).toBeInTheDocument();
  });
  it("links to the given path", () => {
    renderCategory();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/categories/1");
  });

  // Pluralization logic
  it("renders 'product' (singular) in the footer when productCount is '1'", () => {
    renderCategory({ productCount: "1" });
    expect(screen.getByText("1 product")).toBeInTheDocument();
  });
  it("renders 'products' (plural) in the footer when productCount is not '1'", () => {
    renderCategory();
    expect(screen.getByText("5 products")).toBeInTheDocument();
  });
  it("includes 'product' (singular) in the aria-label when productCount is '1'", () => {
    renderCategory({ productCount: "1" });
    expect(
      screen.getByRole("link", {
        name: "View the Coffee category containing 1 product",
      })
    ).toBeInTheDocument();
  });
  it("includes 'products' (plural) in the aria-label when productCount is not '1'", () => {
    renderCategory();
    expect(
      screen.getByRole("link", {
        name: "View the Coffee category containing 5 products",
      })
    ).toBeInTheDocument();
  });
});
