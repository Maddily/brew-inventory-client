import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProduct from "./EditProduct";
import * as utils from "../../../../utils/utils";

// Mock react-router hooks
const mockNavigate = vi.fn();
let mockParams = { id: "1" };
let mockLocationState = {};

vi.mock("react-router", () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
}));

// Mock ProductForm to inspect the props passed to it
vi.mock("../../../../components/ProductForm/ProductForm", () => ({
  default: vi.fn((props) => (
    <div data-testid="product-form">
      <button
        onClick={() =>
          props.onSubmit({
            name: "Updated Name",
            description: "desc",
            price: "10",
            quantity: "5",
            password: "admin123",
          })
        }
      >
        submit
      </button>
      <button onClick={props.onCancel}>cancel</button>
      <button onClick={props.onDismissError}>dismiss-error</button>
      <button onClick={props.onPasswordChange}>password-change</button>
      <span data-testid="form-error">{props.error}</span>
    </div>
  )),
}));

vi.mock("../SkeletonEditProduct/SkeletonEditProduct", () => ({
  default: () => <div data-testid="skeleton">loading...</div>,
}));

vi.mock("../../../error/components/ErrorState/ErrorState", () => ({
  default: ({ setRetryCount }) => (
    <div data-testid="error-state">
      <button onClick={() => setRetryCount((c) => c + 1)}>retry</button>
    </div>
  ),
}));

vi.mock("../../../../utils/utils", () => ({
  navigateBackAfterEdit: vi.fn(),
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
    attribute_value: "Ethiopia",
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

beforeEach(() => {
  vi.clearAllMocks();
  mockParams = { id: "1" };
  mockLocationState = { categoryId: "1" };
});

describe("EditProduct", () => {
  // Loading and error states
  it("renders SkeletonEditProduct while the product is loading", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})); // never resolves
    render(<EditProduct />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });
  it("renders ErrorState when the product fetch fails", async () => {
    mockFetchFailure("Product not found", 404);
    render(<EditProduct />);
    expect(await screen.findByTestId("error-state")).toBeInTheDocument();
  });

  // Data fetching and transformation
  it("fetches the product using the id from the URL params", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/1")
      );
    });
  });
  it("transforms the flat rows response into a single product object with an attributes map", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();
    const ProductForm = (
      await import("../../../../components/ProductForm/ProductForm")
    ).default;
    const lastCallProps = ProductForm.mock.calls.at(-1)[0];

    expect(lastCallProps.product).toEqual({
      id: 1,
      name: "Ethiopia Yirgacheffe",
      description: "A bright coffee",
      price: 18,
      stock_quantity: 42,
      category_id: 1,
      category: "Coffee",
      attributes: {
        Origin: "Ethiopia",
        "Roast Level": "Light",
      },
    });
  });
  it("passes the fetched product to ProductForm", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();
    const ProductForm = (
      await import("../../../../components/ProductForm/ProductForm")
    ).default;
    const lastCallProps = ProductForm.mock.calls.at(-1)[0];
    expect(lastCallProps.product.name).toBe("Ethiopia Yirgacheffe");
  });
  it("passes categoryId from location state to ProductForm", async () => {
    mockLocationState = { categoryId: "1" };
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    const ProductForm = (
      await import("../../../../components/ProductForm/ProductForm")
    ).default;
    const lastCallProps = ProductForm.mock.calls.at(-1)[0];
    expect(lastCallProps.categoryId).toBe("1");
  });
  it("passes isEditing as true to ProductForm", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    const ProductForm = (
      await import("../../../../components/ProductForm/ProductForm")
    ).default;
    const lastCallProps = ProductForm.mock.calls.at(-1)[0];
    expect(lastCallProps.isEditing).toBe(true);
  });
  it("refetches the product when retryCount changes", async () => {
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

    render(<EditProduct />);

    expect(await screen.findByTestId("error-state")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByText("retry"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    });
    expect(await screen.findByTestId("product-form")).toBeInTheDocument();
  });

  // Saving
  it("calls the PUT endpoint with the correct product id and payload on submit", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await userEvent.click(screen.getByText("submit"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/1"),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });
  it("includes the product's category_id in the PUT payload", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await userEvent.click(screen.getByText("submit"));

    await waitFor(() => {
      const call = globalThis.fetch.mock.calls[0];
      const body = JSON.parse(call[1].body);
      expect(body.category_id).toBe(1);
    });
  });
  it("navigates back to the correct location after a successful save", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await userEvent.click(screen.getByText("submit"));

    await waitFor(() => {
      expect(utils.navigateBackAfterEdit).toHaveBeenCalledWith(
        "1",
        "1",
        "Coffee",
        mockNavigate
      );
    });
  });
  it("sets saveError and does not navigate when the save request fails", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: "Incorrect password" }),
    });

    await userEvent.click(screen.getByText("submit"));

    expect(await screen.findByTestId("form-error")).toHaveTextContent(
      "Incorrect password"
    );
    expect(utils.navigateBackAfterEdit).not.toHaveBeenCalled();
  });
  it("passes the error message from the failed response to ProductForm", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Validation failed" }),
    });

    await userEvent.click(screen.getByText("submit"));

    expect(await screen.findByTestId("form-error")).toHaveTextContent(
      "Validation failed"
    );
  });
  it("clears saveError when onDismissError is called", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Some error" }),
    });

    await userEvent.click(screen.getByText("submit"));

    expect(await screen.findByTestId("form-error")).toHaveTextContent(
      "Some error"
    );

    await userEvent.click(screen.getByText("dismiss-error"));

    expect(await screen.findByTestId("form-error")).toHaveTextContent("");
  });
  it("clears saveError when onPasswordChange is called", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Incorrect password" }),
    });

    await userEvent.click(screen.getByText("submit"));

    expect(await screen.findByTestId("form-error")).toHaveTextContent(
      "Incorrect password"
    );

    await userEvent.click(screen.getByText("password-change"));

    expect(await screen.findByTestId("form-error")).toHaveTextContent("");
  });

  // Cancel
  it("navigates back to the correct location when onCancel is called", async () => {
    mockFetchSuccess(mockProductRows);
    render(<EditProduct />);

    expect(await screen.findByTestId("product-form")).toBeInTheDocument();

    await userEvent.click(screen.getByText("cancel"));

    expect(utils.navigateBackAfterEdit).toHaveBeenCalledWith(
      "1",
      "1",
      "Coffee",
      mockNavigate
    );
  });
});
