import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterDropdown from "./FilterDropdown";
import { MemoryRouter } from "react-router";
import { SelectedChipsContext } from "../../../../contexts";
import {
  applyFilters,
  clearFilters,
  filtersExist,
} from "../../../../utils/filterUtils";
import { categoryNameToId } from "../../../../constants";

vi.mock("../../../../utils/filterUtils", () => ({
  applyFilters: vi.fn(),
  clearFilters: vi.fn(),
  filtersExist: vi.fn(() => false),
}));

vi.mock("../FilterEmptyState/FilterEmptyState", () => ({
  default: vi.fn(() => <div data-testid="empty-state"></div>),
}));

vi.mock("../FilterSection/FilterSection", () => ({
  default: vi.fn(() => <div data-testid="filter-section"></div>),
}));

describe("FilterDropdown", () => {
  const closeFilter = vi.fn();
  let user;
  let products;
  const selectedChips = {
    Category: [],
    Availability: [],
    Origin: [],
    "Roast Level": [],
    Format: [],
    Weight: [],
    Type: [],
    "Caffeine Level": [],
    Base: [],
    Volume: [],
    "Compatible With": [],
  };
  const setSelectedChips = vi.fn();

  function renderDropdown() {
    render(
      <MemoryRouter>
        <SelectedChipsContext value={[selectedChips, setSelectedChips]}>
          <FilterDropdown products={products} closeFilter={closeFilter} />
        </SelectedChipsContext>
      </MemoryRouter>
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    filtersExist.mockReturnValue(false);

    user = userEvent.setup();
    products = [
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
  });

  describe("empty vs populated product list", () => {
    it("renders FilterEmptyState when there are no products", () => {
      products = [];
      renderDropdown();
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });
    it("does not render FilterEmptyState when there are products", () => {
      renderDropdown();
      expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();
    });
    it("does not render the apply button when there are no products", () => {
      products = [];
      renderDropdown();
      expect(
        screen.queryByRole("button", { name: /apply/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("filter sections", () => {
    it("renders FilterSection for each section", () => {
      renderDropdown();
      expect(screen.getAllByTestId("filter-section")).toHaveLength(2);
    });
    it("renders exactly one fewer divider than filter sections", () => {
      renderDropdown();
      const sections = screen.getAllByTestId("filter-section");
      const dividers = screen.getAllByTestId("divider");
      expect(dividers).toHaveLength(sections.length - 1);
    });
  });

  describe("clear all button", () => {
    it("disables the clear all button when no chips are selected", () => {
      renderDropdown();
      const clearAllBtn = screen.getByRole("button", { name: /clear all/i });
      expect(clearAllBtn).toBeDisabled();
    });
    it("enables the clear all button when at least one chip is selected", () => {
      filtersExist.mockReturnValue(true);
      renderDropdown();
      const clearAllBtn = screen.getByRole("button", { name: /clear all/i });
      expect(clearAllBtn).toBeEnabled();
    });
    it("calls clearFilters and closeFilter when clicked", async () => {
      filtersExist.mockReturnValue(true);
      renderDropdown();
      const clearAllBtn = screen.getByRole("button", { name: /clear all/i });
      await user.click(clearAllBtn);
      expect(clearFilters).toHaveBeenCalled();
      expect(closeFilter).toHaveBeenCalled();
    });
  });

  describe("apply filters button", () => {
    it("calls applyFilters and closeFilter when clicked", async () => {
      selectedChips.Category.push("Coffee");
      filtersExist.mockReturnValue(true);
      renderDropdown();
      const applyBtn = screen.getByRole("button", {
        name: /apply/i,
      });
      await user.click(applyBtn);
      expect(applyFilters).toHaveBeenCalledWith(
        selectedChips,
        expect.anything(), // searchParams
        expect.any(Function), // setSearchParams
        categoryNameToId
      );
      expect(closeFilter).toHaveBeenCalled();
    });
  });
});
