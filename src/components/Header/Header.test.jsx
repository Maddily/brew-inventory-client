import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import useIsWide from "../../hooks/useIsWide";
import { MemoryRouter } from "react-router";

vi.mock("../../hooks/useIsWide", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("Header", () => {
  describe("on mobile screens", () => {
    beforeEach(() => {
      useIsWide.mockReturnValue(false);
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
    });

    it("renders a logo link that redirects to the home page", () => {
      const logo = screen.getByRole("link", { name: /go to home page/i });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("does not render a navigation on mobile screens", () => {
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("on desktop screens", () => {
    beforeEach(() => {
      useIsWide.mockReturnValue(true);
      render(
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      );
    });

    it("renders a navigation on desktop screens", () => {
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders Categories link inside the navigation", () => {
      const categories = screen.getByRole("link", { name: /categories/i });
      expect(categories).toBeInTheDocument();
      expect(categories).toHaveAttribute("href", "/");
    });

    it("renders All products link inside the navigation", () => {
      const allProducts = screen.getByRole("link", { name: /all products/i });
      expect(allProducts).toBeInTheDocument();
      expect(allProducts).toHaveAttribute("href", "/products");
    });

    it("renders Add product link inside the navigation", () => {
      const addProduct = screen.getByRole("link", { name: /add product/i });
      expect(addProduct).toBeInTheDocument();
      expect(addProduct).toHaveAttribute("href", "/products/new");
    });
  });
});
