import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FilterSection from "./FilterSection";
import SheetChip from "../SheetChip/SheetChip";

vi.mock("../SheetChip/SheetChip", () => ({
  default: vi.fn(() => <div data-testid="chip"></div>),
}));

describe("FilterSection", () => {
  const sections = {
    Category: ["Coffee", "Tea", "Ready-to-Drink", "Accessories"],
    Availability: ["In stock", "Low stock", "Out of stock"],
  };

  it("renders the section as a heading", () => {
    render(
      <FilterSection sections={sections} section="Category" type="dropdown" />
    );

    expect(
      screen.getByRole("heading", { name: /category/i, level: 3 })
    ).toBeInTheDocument();
  });

  it("renders a chip for each value in a section", () => {
    render(
      <FilterSection sections={sections} section="Category" type="dropdown" />
    );

    expect(screen.getAllByTestId("chip")).toHaveLength(4);
    expect(SheetChip).toHaveBeenCalledWith(
      expect.objectContaining({ section: "Category", value: "Coffee" }),
      undefined
    );
  });

  it("renders no chips when the section has an empty array of values", () => {
    render(
      <FilterSection
        sections={{ Category: [] }}
        section="Category"
        type="dropdown"
      />
    );

    expect(screen.queryAllByTestId("chip")).toHaveLength(0);
  });
});
