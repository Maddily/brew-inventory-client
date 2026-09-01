import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import userEvent from "@testing-library/user-event";
import AddProduct from "../../pages/addProduct/components/AddProduct/AddProduct";

vi.mock("../../hooks/useIsWide", () => ({
  default: vi.fn(),
}));

function mockFetchSuccess() {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(),
  });
}

function renderAddProduct() {
  render(
    <MemoryRouter initialEntries={["/products/new"]}>
      <Routes>
        <Route path="/products/new" element={<AddProduct />} />
        <Route path="/products" element={<div>Products page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("adding a product", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it("fills the form, clicks Add product, and redirects back to the products page", async () => {
    renderAddProduct();

    // Select a category
    const category = screen.getByLabelText(/category/i);
    await user.selectOptions(category, "Ready-to-Drink");

    // Fill in the product name
    const name = screen.getByLabelText(/product name/i);
    await user.type(name, "Cold Brew Bottle");

    // Fill in the price
    const price = screen.getByLabelText(/price/i);
    await user.type(price, "5");

    // Fill in the stock quantity
    const quantity = screen.getByLabelText(/quantity/i);
    await user.type(quantity, "12");

    // Choose the base of the drink
    const base = screen.getByLabelText(/base/i);
    await user.selectOptions(base, "Coffee");

    // Fill in the volume
    const volume = screen.getByLabelText(/volume/i);
    await user.type(volume, "355");

    // Prepare the next fetch response to add the product to the database
    mockFetchSuccess();

    // Add the product
    const addBtn = screen.getByRole("button", { name: "Add product" });
    await user.click(addBtn);

    // Assert that fetch was called with the correct path and data
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products"),
        expect.objectContaining({ method: "POST" })
      );
    });
    const [, options] = globalThis.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      name: "Cold Brew Bottle",
      description: "",
      price: "5",
      stock_quantity: "12",
      category_id: 3,
      Base: "Coffee",
      Volume: "355",
    });

    expect(await screen.findByText("Products page")).toBeInTheDocument();
  });
});
