import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import BottomNav from "./BottomNav";

describe("BottomNav", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    );
  });

  it("renders Categories link", () => {
    const categories = screen.getByRole("link", { name: /categories/i });
    expect(categories).toBeInTheDocument();
    expect(categories).toHaveAttribute("href", "/");
  });

  it("renders All products link", () => {
    const allProducts = screen.getByRole("link", { name: /all products/i });
    expect(allProducts).toBeInTheDocument();
    expect(allProducts).toHaveAttribute("href", "/products");
  });

  it("renders Add product link", () => {
    const addProduct = screen.getByRole("link", { name: /add product/i });
    expect(addProduct).toBeInTheDocument();
    expect(addProduct).toHaveAttribute("href", "/products/new");
  });
});
