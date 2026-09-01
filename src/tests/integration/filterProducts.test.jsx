import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import userEvent from "@testing-library/user-event";
import Products from "../../pages/products/components/Products/Products";
import useIsWide from "../../hooks/useIsWide";

vi.mock("../../hooks/useIsWide", () => ({
  __esModule: true,
  default: vi.fn(),
}));

const mockProductRows = [
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description: "A bright, floral washed coffee.",
    price: 18.0,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Origin",
    attribute_value: "Ethiopia",
  },
  {
    id: 2,
    name: "Japanese Sencha",
    description: "Grassy, vegetal green tea.",
    price: 12.5,
    stock_quantity: 7,
    category_id: 2,
    category: "Tea",
    attribute_name: "Type",
    attribute_value: "Green",
  },
];

function mockFetchSuccess(data) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function renderProducts() {
  render(
    <MemoryRouter initialEntries={["/products"]}>
      <Routes>
        <Route path="/products" element={<Products />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("filtering products", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    useIsWide.mockReturnValue(true); // desktop -> FilterDropdown
    mockFetchSuccess(mockProductRows);
  });

  it("selects a Category chip, clicks Apply, and refetches with the correct category_id param", async () => {
    renderProducts();

    // Wait for initial product load
    await screen.findByText("Ethiopia Yirgacheffe");

    // Open the filter dropdown
    const filterBtn = screen.getByRole("button", { name: /filter products/i });
    await user.click(filterBtn);

    // Select the "Coffee" chip
    const coffeeChip = await screen.findByRole("button", { name: "Coffee" });
    await user.click(coffeeChip);
    expect(coffeeChip).toHaveAttribute("aria-pressed", "true");

    // Prepare the next fetch response to only return the filtered product
    mockFetchSuccess([mockProductRows[0]]);

    // Click Apply
    const applyBtn = screen.getByRole("button", { name: /apply/i });
    await user.click(applyBtn);

    // Assert the refetch happened with the right query param
    await waitFor(() => {
      const lastCall = globalThis.fetch.mock.calls.at(-1);
      expect(lastCall[0]).toContain("category_id=1");
    });

    // Assert the UI reflects the filtered result
    expect(await screen.findByText("Ethiopia Yirgacheffe")).toBeInTheDocument();
    expect(screen.queryByText("Japanese Sencha")).not.toBeInTheDocument();
  });
});
