import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Products from "./Products";
import { MemoryRouter, Route, Routes } from "react-router";
import useIsWide from "../../../../hooks/useIsWide";
import { filtersExist } from "../../../../utils/filterUtils";
import userEvent from "@testing-library/user-event";
import ProductEmptyState from "../ProductEmptyState/ProductEmptyState";

const mockSetSearchParams = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  };
});

vi.mock("../../../../hooks/useIsWide", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../SkeletonProducts/SkeletonProducts", () => ({
  default: () => <div data-testid="skeleton">loading...</div>,
}));

vi.mock("../../../error/components/ErrorState/ErrorState", () => ({
  default: ({ setRetryCount }) => (
    <div data-testid="error-state">
      <button onClick={() => setRetryCount((c) => c + 1)}>retry</button>
    </div>
  ),
}));

vi.mock("../../../../utils/filterUtils", async () => {
  const actual = await vi.importActual("../../../../utils/filterUtils");
  return {
    ...actual,
    filtersExist: vi.fn(),
  };
});

vi.mock("../ProductEmptyState/ProductEmptyState", () => ({
  default: vi.fn(() => <div data-testid="product-empty-state"></div>),
}));

function mockFetchSuccess(data) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockFetchFailure(errorMessage, status = 400) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: errorMessage }),
  });
}

function renderProducts({ route = "/products" } = {}) {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/categories/:category_id" element={<Products />} />
      </Routes>
    </MemoryRouter>
  );
}

const mockProductRows = [
  // Product 1 - Coffee
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description:
      "A bright, floral washed coffee with notes of jasmine and bergamot.",
    price: 18.0,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Origin",
    attribute_value: "Ethiopia",
  },
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description:
      "A bright, floral washed coffee with notes of jasmine and bergamot.",
    price: 18.0,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Roast Level",
    attribute_value: "Light",
  },
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description:
      "A bright, floral washed coffee with notes of jasmine and bergamot.",
    price: 18.0,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Format",
    attribute_value: "Whole Bean",
  },
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description:
      "A bright, floral washed coffee with notes of jasmine and bergamot.",
    price: 18.0,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Weight",
    attribute_value: "250",
  },

  // Product 2 - Tea
  {
    id: 2,
    name: "Japanese Sencha",
    description: "Grassy, vegetal green tea from Shizuoka.",
    price: 12.5,
    stock_quantity: 7,
    category_id: 2,
    category: "Tea",
    attribute_name: "Type",
    attribute_value: "Green",
  },
  {
    id: 2,
    name: "Japanese Sencha",
    description: "Grassy, vegetal green tea from Shizuoka.",
    price: 12.5,
    stock_quantity: 7,
    category_id: 2,
    category: "Tea",
    attribute_name: "Origin",
    attribute_value: "Japan",
  },
  {
    id: 2,
    name: "Japanese Sencha",
    description: "Grassy, vegetal green tea from Shizuoka.",
    price: 12.5,
    stock_quantity: 7,
    category_id: 2,
    category: "Tea",
    attribute_name: "Format",
    attribute_value: "Loose Leaf",
  },
  {
    id: 2,
    name: "Japanese Sencha",
    description: "Grassy, vegetal green tea from Shizuoka.",
    price: 12.5,
    stock_quantity: 7,
    category_id: 2,
    category: "Tea",
    attribute_name: "Caffeine Level",
    attribute_value: "Medium",
  },
  {
    id: 2,
    name: "Japanese Sencha",
    description: "Grassy, vegetal green tea from Shizuoka.",
    price: 12.5,
    stock_quantity: 7,
    category_id: 2,
    category: "Tea",
    attribute_name: "Weight",
    attribute_value: "100",
  },

  // Product 3 - Ready-to-Drink
  {
    id: 3,
    name: "Cold Brew Bottle",
    description: "Smooth, low-acid cold brew concentrate.",
    price: 5.0,
    stock_quantity: 0,
    category_id: 3,
    category: "Ready-to-Drink",
    attribute_name: "Base",
    attribute_value: "Coffee",
  },
  {
    id: 3,
    name: "Cold Brew Bottle",
    description: "Smooth, low-acid cold brew concentrate.",
    price: 5.0,
    stock_quantity: 0,
    category_id: 3,
    category: "Ready-to-Drink",
    attribute_name: "Volume",
    attribute_value: "355",
  },

  // Product 4 - Accessories
  {
    id: 4,
    name: "Hario V60 Dripper",
    description: "Classic ceramic pour-over dripper.",
    price: 22.0,
    stock_quantity: 15,
    category_id: 4,
    category: "Accessories",
    attribute_name: "Type",
    attribute_value: "Dripper",
  },
  {
    id: 4,
    name: "Hario V60 Dripper",
    description: "Classic ceramic pour-over dripper.",
    price: 22.0,
    stock_quantity: 15,
    category_id: 4,
    category: "Accessories",
    attribute_name: "Compatible With",
    attribute_value: "Coffee",
  },
];

describe("Products", () => {
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    user = userEvent.setup();

    HTMLDialogElement.prototype.showModal = vi.fn(function () {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function () {
      this.removeAttribute("open");
    });
  });
  4;
  describe("loading and error states", () => {
    it("renders ErrorState when there's an error", async () => {
      mockFetchFailure("Failed to fetch data", 500);
      renderProducts();
      expect(await screen.findByTestId("error-state")).toBeInTheDocument();
    });
    it("renders SkeletonProducts when the data is loading", () => {
      globalThis.fetch = vi.fn(() => new Promise(() => {})); // never resolves
      renderProducts();
      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });
    it("renders the product list instead of the skeleton when searching, even while loading", async () => {
      useIsWide.mockReturnValue(false);
      mockSearchParams = new URLSearchParams("search=coffee");
      let resolveFetch;
      globalThis.fetch = vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          })
      );

      renderProducts({ route: "/products?search=coffee" });

      // While still loading, skeleton should not show
      expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();

      // Resolve the fetch and confirm the list renders
      resolveFetch({ ok: true, json: () => Promise.resolve(mockProductRows) });
      expect(await screen.findAllByRole("link")).toHaveLength(4);
    });
  });

  describe("heading", () => {
    it("renders the heading as the name of a category when categoryId param exists", async () => {
      mockFetchSuccess(mockProductRows);
      renderProducts({ route: "/categories/1" });

      expect(
        await screen.findByRole("heading", { name: "Coffee", level: 1 })
      ).toBeInTheDocument();
    });
    it("renders the heading as 'All products' when there is no categoryId param", async () => {
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(
        await screen.findByRole("heading", { name: "All Products", level: 1 })
      ).toBeInTheDocument();
    });
  });

  describe("header description", () => {
    it("renders the header description returned by getSearchResultDescription", async () => {
      mockFetchSuccess(mockProductRows);
      renderProducts();
      expect(await screen.findByText(/products across/)).toBeInTheDocument();
    });
  });

  describe("search bar", () => {
    it("renders SearchBar", async () => {
      mockFetchSuccess(mockProductRows);
      renderProducts();
      expect(
        await screen.findByLabelText(/search products/i)
      ).toBeInTheDocument();
    });
  });

  describe("filter button", () => {
    it("a filter button without the text 'Filter' on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(
        await screen.findByRole("button", { name: /filter products/i })
      ).toHaveTextContent("");
    });
    it("a filter button with the text 'Filter' on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(
        await screen.findByRole("button", { name: /filter products/i })
      ).toHaveTextContent("Filter");
    });
    it("adds the active class to the filter button when filters are currently applied", async () => {
      filtersExist.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(
        await screen.findByRole("button", { name: /filter products/i })
      ).toHaveClass(/active/i);
    });
    it("does not add the active class to the filter button when no filters are applied", async () => {
      filtersExist.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(
        await screen.findByRole("button", { name: /filter products/i })
      ).not.toHaveClass(/active/i);
    });
    it("sets aria-expanded to false on the filter button when the dropdown is closed", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(
        await screen.findByRole("button", { name: /filter products/i })
      ).toHaveAttribute("aria-expanded", "false");
    });
    it("sets aria-expanded to true on the filter button when the dropdown is open", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      const filterBtn = await screen.findByRole("button", {
        name: /filter products/i,
      });
      await user.click(filterBtn);

      expect(filterBtn).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("filter panel behavior", () => {
    it("opens the bottom sheet when the filter button is clicked on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      const filterBtn = await screen.findByRole("button", {
        name: /filter products/i,
      });
      await user.click(filterBtn);

      expect(await screen.findByRole("dialog")).toBeInTheDocument();
    });
    it("renders FilterDropdown when the filter button is clicked on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      const filterBtn = await screen.findByRole("button", {
        name: /filter products/i,
      });
      await user.click(filterBtn);

      expect(await screen.findByTestId("filter-dropdown")).toBeInTheDocument();
    });
    it("closes the filter dropdown when the filter button is clicked again while it's open on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      const filterBtn = await screen.findByRole("button", {
        name: /filter products/i,
      });

      await user.click(filterBtn);
      expect(await screen.findByTestId("filter-dropdown")).toBeInTheDocument();

      await user.click(filterBtn);
      expect(screen.queryByTestId("filter-dropdown")).not.toBeInTheDocument();
    });
    it("does not render FilterDropdown when the filter dropdown is not open on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(screen.queryByTestId("filter-dropdown")).not.toBeInTheDocument();
    });
  });

  describe("empty state", () => {
    it("renders ProductEmptyState when there are no products", async () => {
      mockFetchSuccess([]);
      renderProducts();

      expect(
        await screen.findByTestId("product-empty-state")
      ).toBeInTheDocument();
    });
    it("passes the correct title, subtitle and action object to ProductEmptyState when there are search parameters", async () => {
      mockSearchParams = new URLSearchParams("search=coffee");
      mockFetchSuccess([]);
      renderProducts();

      await screen.findByTestId("product-empty-state");

      expect(ProductEmptyState).toHaveBeenCalledWith(
        {
          title: "No products found",
          subtitle:
            "No products match your current filters. Try adjusting or clearing your filters.",
          action: {
            label: "Clear filters",
            onClick: expect.any(Function),
          },
        },
        undefined
      );
    });
    it("passes the correct title, subtitle and action object to ProductEmptyState when there are no search parameters and categoryId param exists", async () => {
      mockFetchSuccess([]);
      renderProducts({ route: "/categories/1" });

      await screen.findByTestId("product-empty-state");

      expect(ProductEmptyState).toHaveBeenCalledWith(
        {
          title: "No products in this category yet",
          subtitle: "Add the first product to this category to get started.",
          action: {
            label: "Add product",
            onClick: expect.any(Function),
          },
        },
        undefined
      );
    });
    it("passes the correct title, subtitle and action object to ProductEmptyState when there are no search parameters and no categoryId param", async () => {
      mockFetchSuccess([]);
      renderProducts();

      await screen.findByTestId("product-empty-state");

      expect(ProductEmptyState).toHaveBeenCalledWith(
        {
          title: "No products yet",
          subtitle:
            "This inventory is empty. Add your first product to get started.",
          action: {
            label: "Add product",
            onClick: expect.any(Function),
          },
        },
        undefined
      );
    });
    it("does not render Product list items when there are no products", async () => {
      mockFetchSuccess([]);
      renderProducts();

      await screen.findByTestId("product-empty-state");
      expect(screen.queryByTestId("product")).not.toBeInTheDocument();
    });
    it("does not render ProductsTable when there are no products", async () => {
      mockFetchSuccess([]);
      renderProducts();

      await screen.findByTestId("product-empty-state");
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("product list rendering", () => {
    it("renders Product for each product on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(await screen.findAllByTestId("product")).toHaveLength(4);
    });
    it("renders ProductsTable on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      renderProducts();

      expect(await screen.findByRole("table")).toBeInTheDocument();
    });
  });
});
