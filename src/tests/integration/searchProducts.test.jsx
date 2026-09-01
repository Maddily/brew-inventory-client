import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import userEvent from "@testing-library/user-event";
import Products from "../../pages/products/components/Products/Products";

vi.mock("../../hooks/useIsWide", () => ({
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

describe("searching products", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    mockFetchSuccess(mockProductRows);
  });

  it("types in the search bar, waits for the debounce delay, and refetches with the correct search term", async () => {
    renderProducts();

    // Wait for initial product load
    await screen.findByText("Ethiopia Yirgacheffe");

    // Type in the search bar
    const searchBar = screen.getByLabelText("Search products");
    await user.type(searchBar, "sencha");

    // Prepare the next fetch response to return the result
    mockFetchSuccess([mockProductRows[1]]);

    // Assert the refetch happened with the right query param
    await waitFor(() => {
      const lastCall = globalThis.fetch.mock.calls.at(-1);
      expect(lastCall[0]).toContain("search=sencha");
    });

    // Assert the UI reflects the search result
    expect(await screen.findByText("Japanese Sencha")).toBeInTheDocument();
    expect(screen.queryByText("Ethiopia Yirgacheffe")).not.toBeInTheDocument();
  });
});
