import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import useIsWide from "../../../../hooks/useIsWide";
import ProductDetail from "./ProductDetail";
import Breadcrumb from "../../../../components/Breadcrumb/Breadcrumb";

// Mock react-router hooks
const mockNavigate = vi.fn();
let mockParams = { id: "1" };
let mockLocationState = {};

vi.mock("react-router", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
}));

vi.mock("../../../../hooks/useIsWide", () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock("../SkeletonProductDetail/SkeletonProductDetail", () => ({
  default: () => <div data-testid="skeleton">loading...</div>,
}));

vi.mock("../../../error/components/ErrorState/ErrorState", () => ({
  default: ({ setRetryCount }) => (
    <div data-testid="error-state">
      <button onClick={() => setRetryCount((c) => c + 1)}>retry</button>
    </div>
  ),
}));

vi.mock("../../../../components/Breadcrumb/Breadcrumb", () => ({
  default: vi.fn(() => <div data-testid="breadcrumb"></div>),
}));

vi.mock("../DeleteModal/DeleteModal", () => ({
  default: vi.fn(({ deleteModalRef, onDelete, deleteError }) => (
    <dialog ref={deleteModalRef} data-testid="delete-modal">
      {deleteError && <span data-testid="delete-error">{deleteError}</span>}
      <button onClick={() => onDelete("")}>confirm-no-password</button>
      <button onClick={() => onDelete("correct-password")}>
        confirm-with-password
      </button>
    </dialog>
  )),
}));

const mockProductRows = [
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description: "A bright coffee",
    price: 18,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Origin",
    attribute_value: "Columbia",
  },
  {
    id: 1,
    name: "Ethiopia Yirgacheffe",
    description: "A bright coffee",
    price: 18,
    stock_quantity: 42,
    category_id: 1,
    category: "Coffee",
    attribute_name: "Roast Level",
    attribute_value: "Light",
  },
];

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

describe("ProductDetail", () => {
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocationState = { categoryId: "1" };
    user = userEvent.setup();
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  describe("Loading/error/data states", () => {
    it("renders SkeletonProductDetail while the product is loading", () => {
      globalThis.fetch = vi.fn(() => new Promise(() => {})); // never resolves
      render(<ProductDetail />);
      expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    });
    it("renders ErrorState when the fetch fails", async () => {
      mockFetchFailure("Product not found", 404);
      render(<ProductDetail />);
      expect(await screen.findByTestId("error-state")).toBeInTheDocument();
    });
    it("retries fetching the product when ErrorState triggers a retry", async () => {
      globalThis.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: "Server error" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockProductRows),
        });

      render(<ProductDetail />);

      expect(await screen.findByTestId("error-state")).toBeInTheDocument();
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);

      await userEvent.click(screen.getByText("retry"));

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledTimes(2);
      });

      expect(
        (await screen.findAllByText(mockProductRows[0].name)).length
      ).toBeGreaterThan(0);
      expect(screen.queryByTestId("error-state")).not.toBeInTheDocument();
    });
    it("correctly merges multiple attribute rows into a single product object", async () => {
      mockLocationState = { from: "all" };
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      // Product name appears in the breadcrumb and the info card
      expect(
        await screen.findByText("Ethiopia Yirgacheffe")
      ).toBeInTheDocument();

      // All attributes should be present under the single merged product
      // The extra attribute is screen-reader only (.sr-only)
      expect(screen.getByText("Origin")).toBeInTheDocument();
      expect(screen.getAllByText("Columbia")).toHaveLength(2);
      expect(screen.getByText("Roast Level")).toBeInTheDocument();
      expect(screen.getAllByText("Light")).toHaveLength(2);
    });
  });

  describe("Static rendering", () => {
    it("renders a breadcrumb navigation", async () => {
      render(<ProductDetail />);

      expect(await screen.findByTestId("breadcrumb")).toBeInTheDocument();
    });
    it("renders the breadcrumb with 'All products' when navigated from the all-products view", async () => {
      mockLocationState = { from: "all" };
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      await waitFor(() => {
        expect(Breadcrumb).toHaveBeenCalled();
      });

      const { prev, prevPath } = Breadcrumb.mock.calls.at(-1)[0];
      expect(prev).toBe("All products");
      expect(prevPath).toBe("/products");
    });
    it("renders the breadcrumb with the category name when navigated from a category view", async () => {
      mockLocationState = {
        from: "category",
        categoryId: "1",
        categoryName: "Coffee",
      };
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      await waitFor(() => {
        expect(Breadcrumb).toHaveBeenCalled();
      });

      const { prev, prevPath } = Breadcrumb.mock.calls.at(-1)[0];
      expect(prev).toBe("Coffee");
      expect(prevPath).toBe("/categories/1");
    });
    it("does not render the category's name in the hero on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("hero-category-label")
        ).not.toBeInTheDocument();
      });
    });
    it("renders the category's name in the hero on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(
        await screen.findByTestId("hero-category-label")
      ).toBeInTheDocument();
    });
    it("renders the product's name in the info card", async () => {
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(
        await screen.findByRole("heading", {
          level: 2,
          name: "Ethiopia Yirgacheffe",
        })
      ).toBeInTheDocument();
    });
    it("renders the product's availability in the info card", async () => {
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(await screen.findByText("In stock")).toBeInTheDocument();
    });
    it("does not render the product's description in the info card on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      await waitFor(() => {
        expect(screen.queryByText("A bright coffee")).not.toBeInTheDocument();
      });
    });
    it("renders the product's description in the info card on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(await screen.findByText("A bright coffee")).toBeInTheDocument();
    });
    it("renders the product's price and quantity in the info card on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(await screen.findByTestId("price-row")).toBeInTheDocument();
    });
    it("does not render the product's price and quantity in the info card on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      await waitFor(() => {
        expect(screen.queryByTestId("price-row")).not.toBeInTheDocument();
      });
    });
    it("renders the product's price and quantity sidebar card on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(
        await screen.findByTestId("price-quantity-card")
      ).toBeInTheDocument();
    });
    it("does not render the product's price and quantity sidebar card on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      await waitFor(() => {
        expect(
          screen.queryByTestId("price-quantity-card")
        ).not.toBeInTheDocument();
      });
    });
    it("renders a product's attributes and values", async () => {
      mockFetchSuccess(mockProductRows);

      render(<ProductDetail />);

      expect(await screen.findByText("Origin")).toBeInTheDocument();
      // The extra attribute is screen-reader only (.sr-only)
      expect(await screen.findAllByText("Columbia")).toHaveLength(2);
      expect(await screen.findByText("Roast Level")).toBeInTheDocument();
      expect(await screen.findAllByText("Light")).toHaveLength(2);
    });
  });

  describe("Responsive labels", () => {
    it("renders 'Edit' as the edit button text and 'Delete' as the delete button text on mobile screens", async () => {
      useIsWide.mockReturnValue(false);
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      expect(
        await screen.findByRole("button", { name: "Edit" })
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "Delete" })
      ).toBeInTheDocument();
    });
    it("renders 'Edit product' as the edit button text and 'Delete product' as the delete button text on desktop screens", async () => {
      useIsWide.mockReturnValue(true);
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      expect(
        await screen.findByRole("button", { name: "Edit product" })
      ).toBeInTheDocument();
      expect(
        await screen.findByRole("button", { name: "Delete product" })
      ).toBeInTheDocument();
    });
  });

  describe("Actions", () => {
    it("calls navigate with the correct path and state object when the edit button is clicked", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      const editBtn = await screen.findByRole("button", { name: /edit/i });
      await user.click(editBtn);
      expect(mockNavigate).toHaveBeenCalledWith("/products/1/edit", {
        state: { categoryId: "1" },
      });
    });
    it("calls showModal when the delete button is clicked", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      const deleteBtn = await screen.findByRole("button", { name: /delete/i });
      await user.click(deleteBtn);

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });
  });

  describe("Delete flow", () => {
    it("sets a delete error when onDelete is called without a password", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      await screen.findByTestId("delete-modal");

      await user.click(screen.getByText("confirm-no-password"));

      expect(await screen.findByTestId("delete-error")).toHaveTextContent(
        "Password is required"
      );
    });
    it("calls the delete endpoint with the correct product id and password", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      await screen.findByTestId("delete-modal");

      await user.click(screen.getByText("confirm-with-password"));
      await waitFor(() => {
        const [url, options] = globalThis.fetch.mock.calls.at(-1);
        expect(url).toContain("/api/products/1");
        expect(options.method).toBe("DELETE");
        expect(JSON.parse(options.body)).toEqual({
          password: "correct-password",
        });
      });
    });
    it("navigates to the category page after a successful delete when categoryId exists", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      await screen.findByTestId("delete-modal");
      await user.click(screen.getByText("confirm-with-password"));
      expect(mockNavigate).toHaveBeenCalledWith("/categories/1");
    });
    it("navigates to /products after a successful delete when there is no categoryId", async () => {
      mockLocationState = { from: "all" };
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      await screen.findByTestId("delete-modal");
      await user.click(screen.getByText("confirm-with-password"));
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
    it("sets a delete error when the delete request fails", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to delete" }),
      });

      await screen.findByTestId("delete-modal");
      await user.click(screen.getByText("confirm-with-password"));

      expect(await screen.findByTestId("delete-error")).toHaveTextContent(
        "Failed to delete"
      );
    });
    it("clears the delete error on a successful delete", async () => {
      mockFetchSuccess(mockProductRows);
      render(<ProductDetail />);

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Failed to delete" }),
      });

      await screen.findByTestId("delete-modal");
      await user.click(screen.getByText("confirm-with-password"));

      expect(await screen.findByTestId("delete-error")).toHaveTextContent(
        "Failed to delete"
      );

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(),
      });

      await user.click(screen.getByText("confirm-with-password"));
      await waitFor(() => {
        expect(screen.queryByTestId("delete-error")).not.toBeInTheDocument();
      });
    });
  });
});
