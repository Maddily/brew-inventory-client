import { describe, expect, it } from "vitest";
import useSections from "./useSections";
import { categoryIdToAttributes } from "../constants";

describe("useSections", () => {
  const allProducts = [
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
  const coffeeProducts = [
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
  ];

  it("returns Category and Availability sections when no categoryId is provided", () => {
    const sections = useSections(null, allProducts, categoryIdToAttributes);
    expect(sections).toEqual({
      Category: ["Coffee", "Tea", "Ready-to-Drink", "Accessories"],
      Availability: ["In stock", "Low stock", "Out of stock"],
    });
  });

  it("excludes Category section when categoryId is provided", () => {
    const sections = useSections(1, coffeeProducts, categoryIdToAttributes);
    expect(sections.Category).toBeUndefined();
  });

  it("includes Availability section when categoryId is provided", () => {
    const sections = useSections(1, coffeeProducts, categoryIdToAttributes);
    expect(sections.Availability).toEqual([
      "In stock",
      "Low stock",
      "Out of stock",
    ]);
  });

  it("adds attribute sections for the given category", () => {
    const sections = useSections(1, coffeeProducts, categoryIdToAttributes);
    expect(sections).toMatchObject({
      Origin: expect.any(Array),
      "Roast Level": expect.any(Array),
      Format: expect.any(Array),
      Weight: expect.any(Array),
    });
  });

  it("populates attribute sections with values from products", () => {
    const sections = useSections(1, coffeeProducts, categoryIdToAttributes);
    expect(sections.Origin).toEqual(["Ethiopia", "Colombia"]);
  });
});
