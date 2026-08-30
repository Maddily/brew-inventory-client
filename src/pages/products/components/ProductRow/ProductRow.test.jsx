import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductRow from "./ProductRow";

const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../../hooks/useAvailability", () => ({
  default: vi.fn(() => ({
    availability: "In stock",
    availabilityClassName: "in-stock",
  })),
}));

vi.mock("../../../../utils/utils", () => ({
  formatPrice: vi.fn(() => "$20.00"),
}));

describe("ProductRow", () => {
  let user;

  function renderWithCategory() {
    render(
      <ProductRow
        name="Brazil Santos"
        price="20"
        stockQuantity="50"
        category="Coffee"
        path="/products/1"
        state={{ from: "all" }}
      />
    );
  }

  function renderWithoutCategory() {
    render(
      <ProductRow
        name="Brazil Santos"
        price="20"
        stockQuantity="50"
        path="/products/1"
        state={{ from: "all" }}
      />
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  it("calls navigate with the given path and state object when clicked", async () => {
    renderWithCategory();
    await user.click(screen.getByRole("link", { name: /brazil santos/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/products/1", {
      state: { from: "all" },
    });
  });

  it("calls navigate with the given path and state object when the Enter key is pressed", async () => {
    renderWithCategory();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(mockNavigate).toHaveBeenCalledWith("/products/1", {
      state: { from: "all" },
    });
  });

  it("calls navigate with the given path and state object when the Space key is pressed", async () => {
    renderWithCategory();
    await user.tab();
    await user.keyboard(" ");
    expect(mockNavigate).toHaveBeenCalledWith("/products/1", {
      state: { from: "all" },
    });
  });

  it("does not call navigate when a key other than Enter or Space is pressed", async () => {
    renderWithCategory();
    await user.tab();
    await user.keyboard("{Escape}");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("renders an accessible label containing the name, category, price, quantity, and availability", () => {
    renderWithCategory();
    expect(
      screen.getByRole("link", {
        name: /brazil santos, coffee, 20 dollars, stock quantity 50, In stock/i,
      })
    ).toBeInTheDocument();
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

  it("formats hyphenated category names in the accessible label", () => {
    render(
      <ProductRow
        name="Cold Brew"
        price="5"
        stockQuantity="10"
        category="Ready-to-Drink"
        path="/products/2"
        state={{ from: "all" }}
      />
    );
    expect(
      screen.getByRole("link", { name: /ready to drink/i })
    ).toBeInTheDocument();
  });
});
