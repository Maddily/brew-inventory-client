import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyFilters,
  clearFilters,
  filtersChanged,
  filtersExist,
  getAttributeValues,
  populateSelectedChips,
} from "./filterUtils";
import { categoryNameToId, idToCategory } from "../constants";

const emptyChips = {
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

describe("filtersChanged", () => {
  it("returns false when both params are empty", () => {
    const params = new URLSearchParams();
    const searchParams = new URLSearchParams();
    expect(filtersChanged(params, searchParams)).toBe(false);
  });

  it("returns false when params are identical", () => {
    const params = new URLSearchParams("category_id=1&category_id=2");
    const searchParams = new URLSearchParams("category_id=1&category_id=2");
    expect(filtersChanged(params, searchParams)).toBe(false);
  });

  it("returns false when params are identical but in different order", () => {
    const params = new URLSearchParams("category_id=2&category_id=1");
    const searchParams = new URLSearchParams("category_id=1&category_id=2");
    expect(filtersChanged(params, searchParams)).toBe(false);
  });

  it("returns true when a key exists in params but not in searchParams", () => {
    const params = new URLSearchParams("category_id=1");
    const searchParams = new URLSearchParams();
    expect(filtersChanged(params, searchParams)).toBe(true);
  });

  it("returns true when a key exists in searchParams but not in params", () => {
    const params = new URLSearchParams();
    const searchParams = new URLSearchParams("category_id=1");
    expect(filtersChanged(params, searchParams)).toBe(true);
  });

  it("returns true when values differ for the same key", () => {
    const params = new URLSearchParams("category_id=1");
    const searchParams = new URLSearchParams("category_id=2");
    expect(filtersChanged(params, searchParams)).toBe(true);
  });

  it("returns true when one has more values for the same key", () => {
    const params = new URLSearchParams("category_id=1&category_id=2");
    const searchParams = new URLSearchParams("category_id=1");
    expect(filtersChanged(params, searchParams)).toBe(true);
  });
});

describe("populateSelectedChips", () => {
  let setSelectedChips;

  beforeEach(() => {
    setSelectedChips = vi.fn();
  });

  it("calls setSelectedChips with all empty arrays when searchParams is empty", () => {
    const searchParams = new URLSearchParams();
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith(emptyChips);
  });

  it("correctly populates selectedChips when a category is selected", () => {
    const searchParams = new URLSearchParams("category_id=1");
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith({
      ...emptyChips,
      Category: ["Coffee"],
    });
  });

  it("maps multiple category_ids to category names", () => {
    const searchParams = new URLSearchParams("category_id=1&category_id=2");
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith({
      ...emptyChips,
      Category: ["Coffee", "Tea"],
    });
  });

  it("ignores unknown category_id", () => {
    const searchParams = new URLSearchParams("category_id=99");
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith(emptyChips);
  });

  it("populates availability", () => {
    const searchParams = new URLSearchParams("availability=low_stock");
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith({
      ...emptyChips,
      Availability: ["low_stock"],
    });
  });

  it("populates a known attribute param", () => {
    const searchParams = new URLSearchParams("category_id=1&Weight=250");
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith({
      ...emptyChips,
      Category: ["Coffee"],
      Weight: ["250"],
    });
  });

  it("ignores unknown params", () => {
    const searchParams = new URLSearchParams("unknownParam=value");
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith(emptyChips);
  });

  it("populates multiple params across different sections", () => {
    const searchParams = new URLSearchParams(
      "category_id=1&availability=in_stock&Origin=Ethiopia"
    );
    populateSelectedChips(searchParams, setSelectedChips, idToCategory);
    expect(setSelectedChips).toHaveBeenCalledWith({
      ...emptyChips,
      Category: ["Coffee"],
      Availability: ["in_stock"],
      Origin: ["Ethiopia"],
    });
  });
});

describe("getAttributeValues", () => {
  const products = [
    {
      id: 1,
      name: "Ethiopia Yirgacheffe",
      category_id: 1,
      category: "Coffee",
      price: 18.0,
      stock_quantity: 42,
      attributes: {
        Origin: "Ethiopia",
        "Roast Level": "Light",
        Format: "Whole Bean",
        Weight: "250",
      },
    },
    {
      id: 2,
      name: "Colombia Huila",
      category_id: 1,
      category: "Coffee",
      price: 16.0,
      stock_quantity: 28,
      attributes: {
        Origin: "Colombia",
        "Roast Level": "Medium",
        Format: "Ground",
        Weight: "250",
      },
    },
    {
      id: 3,
      name: "Japanese Sencha",
      category_id: 2,
      category: "Tea",
      price: 12.5,
      stock_quantity: 7,
      attributes: {
        Type: "Green",
        Origin: "Japan",
        Format: "Loose Leaf",
        "Caffeine Level": "Medium",
        Weight: "100",
      },
    },
    {
      id: 4,
      name: "Cold Brew Bottle",
      category_id: 3,
      category: "Ready-to-Drink",
      price: 5.0,
      stock_quantity: 0,
      attributes: {
        Base: "Coffee",
        Volume: "330",
      },
    },
  ];

  it("doesn't return duplicate values", () => {
    expect(getAttributeValues(products, "Weight")).toEqual(["250", "100"]);
  });

  it("returns all values of an attribute", () => {
    expect(getAttributeValues(products, "Origin")).toEqual([
      "Ethiopia",
      "Colombia",
      "Japan",
    ]);
  });

  it("returns an empty array when no products have the attribute", () => {
    expect(getAttributeValues(products, "Compatible With")).toEqual([]);
  });

  it("returns an empty array when products array is empty", () => {
    expect(getAttributeValues([], "Origin")).toEqual([]);
  });
});

describe("clearFilters", () => {
  let setSelectedChips;
  let setSearchParams;

  beforeEach(() => {
    setSelectedChips = vi.fn();
    setSearchParams = vi.fn();
  });

  it("clears selectedChips", () => {
    const searchParams = new URLSearchParams("category_id=2");
    clearFilters(setSelectedChips, searchParams, setSearchParams);
    expect(setSelectedChips).toHaveBeenCalledWith(emptyChips);
  });

  it("does not call setSearchParams when search params are already empty", () => {
    const searchParams = new URLSearchParams();
    clearFilters(setSelectedChips, searchParams, setSearchParams);
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it("clears search params when they are not empty", () => {
    const searchParams = new URLSearchParams("category_id=2");
    clearFilters(setSelectedChips, searchParams, setSearchParams);
    expect(setSearchParams).toHaveBeenCalledWith(new URLSearchParams());
  });
});

describe("applyFilters", () => {
  let setSearchParams;

  beforeEach(() => {
    setSearchParams = vi.fn();
  });

  it("calls setSearchParams with category_id when Category chip is selected", () => {
    const selectedChips = { ...emptyChips, Category: ["Coffee"] };
    const searchParams = new URLSearchParams();
    applyFilters(
      selectedChips,
      searchParams,
      setSearchParams,
      categoryNameToId
    );
    const expected = new URLSearchParams("category_id=1");
    expect(setSearchParams).toHaveBeenCalledWith(expected);
  });

  it("calls setSearchParams with availability when Availability chip is selected", () => {
    const selectedChips = { ...emptyChips, Availability: ["in_stock"] };
    const searchParams = new URLSearchParams();
    applyFilters(
      selectedChips,
      searchParams,
      setSearchParams,
      categoryNameToId
    );
    const expected = new URLSearchParams("availability=in_stock");
    expect(setSearchParams).toHaveBeenCalledWith(expected);
  });

  it("calls setSearchParams with attribute param when attribute chip is selected", () => {
    const selectedChips = { ...emptyChips, Origin: ["Ethiopia"] };
    const searchParams = new URLSearchParams();
    applyFilters(
      selectedChips,
      searchParams,
      setSearchParams,
      categoryNameToId
    );
    const expected = new URLSearchParams("Origin=Ethiopia");
    expect(setSearchParams).toHaveBeenCalledWith(expected);
  });

  it("calls setSearchParams with multiple params across sections", () => {
    const selectedChips = {
      ...emptyChips,
      Category: ["Coffee"],
      Availability: ["in_stock"],
      Origin: ["Ethiopia"],
    };
    const searchParams = new URLSearchParams();
    applyFilters(
      selectedChips,
      searchParams,
      setSearchParams,
      categoryNameToId
    );
    const expected = new URLSearchParams(
      "category_id=1&availability=in_stock&Origin=Ethiopia"
    );
    expect(setSearchParams).toHaveBeenCalledWith(expected);
  });

  it("does not call setSearchParams when filters haven't changed", () => {
    const selectedChips = { ...emptyChips, Category: ["Coffee"] };
    const searchParams = new URLSearchParams("category_id=1");
    applyFilters(
      selectedChips,
      searchParams,
      setSearchParams,
      categoryNameToId
    );
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it("does not call setSearchParams when all chips are empty", () => {
    const searchParams = new URLSearchParams();
    applyFilters(emptyChips, searchParams, setSearchParams, categoryNameToId);
    expect(setSearchParams).not.toHaveBeenCalled();
  });
});

describe("filtersExist", () => {
  it("returns true if filters are selected", () => {
    expect(filtersExist({ ...emptyChips, Availability: ["low_stock"] })).toBe(
      true
    );
  });

  it("returns false if no filters are selected", () => {
    expect(filtersExist(emptyChips)).toBe(false);
  });
});
