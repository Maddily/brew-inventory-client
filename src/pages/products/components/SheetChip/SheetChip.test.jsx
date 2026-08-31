import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SheetChip from "./SheetChip";
import { SelectedChipsContext } from "../../../../contexts";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

const initialChips = {
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

function renderSheetChip(overrides = {}) {
  const spy = vi.fn();

  function Wrapper() {
    const [selectedChips, setSelectedChips] = useState({
      ...initialChips,
      ...overrides,
    });

    function handleSetSelectedChips(value) {
      spy(value);
      setSelectedChips(value);
    }

    return (
      <SelectedChipsContext value={[selectedChips, handleSetSelectedChips]}>
        <SheetChip section="Category" value="Tea" />
      </SelectedChipsContext>
    );
  }

  render(<Wrapper />);
  return { spy };
}

describe("SheetChip", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("renders a button with the given value as its text", () => {
    renderSheetChip();
    expect(screen.getByRole("button", { name: "Tea" })).toBeInTheDocument();
  });

  it("sets aria-pressed to true when the chip is selected", async () => {
    renderSheetChip();
    const chip = screen.getByRole("button", { name: "Tea", pressed: false });
    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");
  });

  it("sets aria-pressed to false when the chip is not selected", () => {
    renderSheetChip();
    const chip = screen.getByRole("button", { name: "Tea" });
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("adds the chip's value to selectedChips if it does not exist", async () => {
    const { spy } = renderSheetChip();
    const chip = screen.getByRole("button", { name: "Tea" });
    await user.click(chip);
    expect(spy).toHaveBeenCalledWith({
      ...initialChips,
      Category: ["Tea"],
    });
  });

  it("removes the chip's value from selectedChips if it exists", async () => {
    const { spy } = renderSheetChip({ Category: ["Tea"] });
    const chip = screen.getByRole("button", { name: "Tea" });
    await user.click(chip);
    expect(spy).toHaveBeenCalledWith({
      ...initialChips,
      Category: [],
    });
  });

  it("does not modify chips in other sections when a chip is selected", async () => {
    const { spy } = renderSheetChip({
      Availability: ["In stock"],
      Type: ["Green"],
    });
    const chip = screen.getByRole("button", { name: "Tea" });
    await user.click(chip);
    expect(spy).toHaveBeenCalledWith({
      ...initialChips,
      Category: ["Tea"],
      Availability: ["In stock"],
      Type: ["Green"],
    });
  });
});
