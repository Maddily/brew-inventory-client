import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  closeModalWithAnimation,
  closeSheetWithAnimation,
  formatPrice,
  getSearchResultDescription,
  navigateBackAfterAdd,
  navigateBackAfterEdit,
  shouldUseSelect,
} from "./utils";
import { categoryAttributes } from "../constants";

describe("formatPrice", () => {
  it("formats a price as USD currency", () => {
    expect(formatPrice(12)).toBe("$12.00");
  });

  it("formats a price with cents", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("shouldUseSelect", () => {
  it("returns true if a select element should be used", () => {
    expect(shouldUseSelect("Format", "Coffee", categoryAttributes)).toBe(true);
  });

  it("returns false if a select element should not be used", () => {
    expect(shouldUseSelect("Weight", "Coffee", categoryAttributes)).toBe(false);
  });
});

describe("closeSheetWithAnimation", () => {
  let sheet;

  beforeEach(() => {
    sheet = {
      animate: vi.fn().mockReturnValue({ onfinish: null }),
      close: vi.fn(),
    };
  });

  it("calls animate with the correct keyframes and options", () => {
    closeSheetWithAnimation(sheet);
    expect(sheet.animate).toHaveBeenCalledWith(
      [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
      { duration: 300, easing: "ease-in" }
    );
  });

  it("calls sheet.close() when animation finishes", () => {
    const animation = { onfinish: null };
    sheet.animate.mockReturnValue(animation);
    closeSheetWithAnimation(sheet);
    animation.onfinish();
    expect(sheet.close).toHaveBeenCalled();
  });

  it("calls closeFilter when animation finishes and closeFilter is provided", () => {
    const animation = { onfinish: null };
    sheet.animate.mockReturnValue(animation);
    const closeFilter = vi.fn();
    closeSheetWithAnimation(sheet, closeFilter);
    animation.onfinish();
    expect(closeFilter).toHaveBeenCalled();
  });

  it("does not call closeFilter when it isn't provided", () => {
    const animation = { onfinish: null };
    sheet.animate.mockReturnValue(animation);
    closeSheetWithAnimation(sheet);
    animation.onfinish();
    expect(sheet.close).toHaveBeenCalled();
    // no error thrown. closeFilter guard works
  });
});

describe("closeModalWithAnimation", () => {
  let modal;

  beforeEach(() => {
    modal = {
      animate: vi.fn().mockReturnValue({ onfinish: null }),
      close: vi.fn(),
    };
  });

  it("calls animate with the correct keyframes and options", () => {
    closeModalWithAnimation(modal);
    expect(modal.animate).toHaveBeenCalledWith(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 150, easing: "ease-out" }
    );
  });

  it("calls modal.close() when animation finishes", () => {
    const animation = { onfinish: null };
    modal.animate.mockReturnValue(animation);
    closeModalWithAnimation(modal);
    animation.onfinish();
    expect(modal.close).toHaveBeenCalled();
  });
});

describe("navigateBackAfterEdit", () => {
  it("Passes the navigate function a correct path", () => {
    const mockNavigate = vi.fn();
    navigateBackAfterEdit(5, undefined, "Ready-to-Drink", mockNavigate);
    expect(mockNavigate).toHaveBeenCalledWith("/products/5", {
      state: {
        from: "all",
      },
    });
  });

  it("Passes the navigate function a state object specific to a category when given a category id", () => {
    const mockNavigate = vi.fn();
    navigateBackAfterEdit(1, 1, "Coffee", mockNavigate);
    expect(mockNavigate).toHaveBeenCalledWith("/products/1", {
      state: {
        from: "category",
        categoryId: 1,
        categoryName: "Coffee",
      },
    });
  });

  it("Passes the navigate function a state object representing all products when not given a category id", () => {
    const mockNavigate = vi.fn();
    navigateBackAfterEdit(1, undefined, "Coffee", mockNavigate);
    expect(mockNavigate).toHaveBeenCalledWith("/products/1", {
      state: {
        from: "all",
      },
    });
  });
});

describe("navigateBackAfterAdd", () => {
  it("Navigates to a category's page when given a category id", () => {
    const mockNavigate = vi.fn();
    navigateBackAfterAdd(2, mockNavigate);
    expect(mockNavigate).toHaveBeenCalledWith("/categories/2");
  });

  it("Navigates to all products page when not given a category id", () => {
    const mockNavigate = vi.fn();
    navigateBackAfterAdd(undefined, mockNavigate);
    expect(mockNavigate).toHaveBeenCalledWith("/products");
  });
});

describe("getSearchResultDescription", () => {
  it("returns '<number of products> products match current filters' when there are search parameters and more than one product match", () => {
    expect(getSearchResultDescription(4, true, null)).toBe(
      "4 products match current filters"
    );
  });

  it("returns '1 product matches current filters' when there are search parameters and exactly one product matches", () => {
    expect(getSearchResultDescription(1, true, null)).toBe(
      "1 product matches current filters"
    );
  });

  it("returns '0 products match current filters' when there are search parameters and no products match", () => {
    expect(getSearchResultDescription(0, true, null)).toBe(
      "0 products match current filters"
    );
  });

  it("returns '<number of products> products across 1 category' when there are no search parameters and categoryId param exists", () => {
    expect(getSearchResultDescription(4, false, 1)).toBe(
      "4 products across 1 category"
    );
  });

  it("returns '<number of products> products across 4 categories' when there are no search parameters and there is no categoryId param", () => {
    expect(getSearchResultDescription(4, false, null)).toBe(
      "4 products across 4 categories"
    );
  });
});
