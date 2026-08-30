import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductsTable from "./ProductsTable";
import ProductRow from "../ProductRow/ProductRow";

vi.mock("../ProductRow/ProductRow", () => ({
  default: vi.fn((props) => (
    <div data-testid="product-row">{JSON.stringify(props)}</div>
  )),
}));

describe("ProductsTable", () => {
  const products = [
    {
      id: 3,
      name: "Brazil Santos",
      description:
        "A bold, full-bodied dark roast from São Paulo state. Rich cocoa and roasted walnut flavors with low acidity and a long, bittersweet finish.",
      price: "22.00",
      stock_quantity: 15,
      category_id: 1,
      category: "Coffee",
      attributes: {
        Origin: "Brazil",
        "Roast Level": "Dark",
        Format: "Whole Beans",
        Weight: "1000",
      },
    },
    {
      id: 10,
      name: "Moroccan Mint",
      description:
        "A caffeine-free herbal blend of spearmint and peppermint in the tradition of Moroccan tea culture. Refreshing, cooling, and naturally sweet.",
      price: "9.00",
      stock_quantity: 54,
      category_id: 2,
      category: "Tea",
      attributes: {
        Weight: "30",
        Type: "Herbal",
        Origin: "Morocco",
        Format: "Bagged",
        "Caffeine Level": "None",
      },
    },
    {
      id: 11,
      name: "Cold Brew Original",
      description:
        "Slow-steeped for 18 hours in cold water, this smooth cold brew delivers rich coffee flavor with low acidity and no bitterness. Best served over ice.",
      price: "5.00",
      stock_quantity: 0,
      category_id: 3,
      category: "Ready-to-Drink",
      attributes: {
        Volume: "330",
        Base: "Coffee",
      },
    },
    {
      id: 17,
      name: "Fellow Stagg Kettle",
      description:
        "A precision gooseneck kettle with a built-in thermometer and a counterbalanced handle for effortless, controlled pouring. Works on all stovetops.",
      price: "65.00",
      stock_quantity: 8,
      category_id: 4,
      category: "Accessories",
      attributes: {
        "Compatible With": "Both",
        Type: "Frother",
      },
    },
  ];

  function renderProductsTable(products, categoryId) {
    render(<ProductsTable products={products} categoryId={categoryId} />);
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders one row per product", () => {
    renderProductsTable(products, null);
    expect(screen.getAllByTestId("product-row")).toHaveLength(4);
  });

  it("renders the table headers: product, price, quantity, availability", () => {
    renderProductsTable(products, null);
    expect(
      screen.getByRole("columnheader", { name: /product/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /price/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /quantity/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /availability/i })
    ).toBeInTheDocument();
  });

  it("passes category as false to each row when categoryId is provided", () => {
    renderProductsTable(products, 1);
    ProductRow.mock.calls.forEach(([props]) => {
      expect(props.category).toBe(false);
    });
  });

  it("passes the product's category to each row when categoryId is not provided", () => {
    renderProductsTable(products, null);
    ProductRow.mock.calls.forEach(([props], index) => {
      expect(props.category).toBe(products[index].category);
    });
  });

  it("passes state with from: 'category' and the category name when categoryId is provided", () => {
    renderProductsTable(products, 1);
    ProductRow.mock.calls.forEach(([props]) => {
      expect(props.state).toEqual({
        from: "category",
        categoryId: 1,
        categoryName: products[0].category,
      });
    });
  });

  it("passes state with from: 'all' when categoryId is not provided", () => {
    renderProductsTable(products, null);
    ProductRow.mock.calls.forEach(([props]) => {
      expect(props.state).toEqual({
        from: "all",
      });
    });
  });

  it("passes the correct path prop to each row", () => {
    renderProductsTable(products, null);
    ProductRow.mock.calls.forEach(([props], index) => {
      expect(props.path).toBe(`/products/${products[index].id}`);
    });
  });

  it("renders no rows when products is empty", () => {
    renderProductsTable([], null);
    expect(screen.queryAllByTestId("product-row")).toHaveLength(0);
  });
});
