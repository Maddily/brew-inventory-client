import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import AddProduct from "./AddProduct";

// Mock react-router hooks
const mockNavigate = vi.fn();
let mockLocationState = {};

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: mockLocationState }),
}));

// Mock navigateBackAfterAdd
vi.mock("../../../../utils/utils", () => ({
  navigateBackAfterAdd: vi.fn(),
}));
import { navigateBackAfterAdd } from "../../../../utils/utils";
import { categoryNameToId } from "../../../../constants";

// Mock ProductForm to expose its props via test-friendly triggers
vi.mock("../../../../components/ProductForm/ProductForm", () => ({
  default: ({
    onSubmit,
    onCancel,
    onDismissError,
    error,
    categoryId,
    isEditing,
  }) => (
    <div>
      <span data-testid="error">{error}</span>
      <span data-testid="categoryId">{categoryId}</span>
      <span data-testid="isEditing">{String(isEditing)}</span>
      <button
        onClick={() =>
          onSubmit({
            category: "Coffee",
            name: "Test Coffee",
            description: "",
            price: "10",
            quantity: "5",
            Origin: "Ethiopia",
          })
        }
      >
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDismissError}>Dismiss</button>
    </div>
  ),
}));

describe("AddProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocationState = { categoryId: 1 };
    globalThis.fetch = vi.fn();
  });

  // Submitting
  it("sends a POST request with the correct payload when onSubmit is called", () => {
    globalThis.fetch.mockResolvedValue({ ok: true });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/products/"),
      expect.objectContaining({ method: "POST", body: expect.any(String) })
    );
  });
  it("maps the category name to a category_id in the request payload", () => {
    globalThis.fetch.mockResolvedValue({ ok: true });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));

    const [, options] = globalThis.fetch.mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.category_id).toBe(categoryNameToId["Coffee"]);
    expect(body.category).toBeUndefined();
  });
  it("includes the entered attributes in the request payload", () => {
    globalThis.fetch.mockResolvedValue({ ok: true });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));

    const [, options] = globalThis.fetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.Origin).toBe("Ethiopia");
  });

  // Success
  it("calls navigateBackAfterAdd with categoryId after a successful add", async () => {
    globalThis.fetch.mockResolvedValue({ ok: true });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));

    await vi.waitFor(() => {
      expect(navigateBackAfterAdd).toHaveBeenCalledWith(1, mockNavigate);
    });
  });
  it("clears any existing error before submitting", async () => {
    // First submission fails and sets an error
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));
    await screen.findByText("Something went wrong");

    // Second submission succeeds — error should clear
    globalThis.fetch.mockResolvedValueOnce({ ok: true });
    fireEvent.click(screen.getByText("Submit"));

    expect(screen.getByTestId("error")).toHaveTextContent("");
  });

  // Failure
  it("sets the error state with the server's error message when the response is not ok", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Something went wrong" }),
    });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));
    await screen.findByText("Something went wrong");
  });
  it("sets a generic HTTP error message when the response has no error message", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
      status: 500,
    });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));
    await screen.findByText("HTTP error. Status: 500");
  });
  it("does not call navigateBackAfterAdd when the submission fails", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
      status: 500,
    });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));
    // Wait for the error to actually surface, proving the async flow completed
    await screen.findByText("HTTP error. Status: 500");

    expect(navigateBackAfterAdd).not.toHaveBeenCalled();
  });

  // Error dismissal
  it("clears the error when onDismissError is called", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
      status: 500,
    });
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Submit"));
    await screen.findByText("HTTP error. Status: 500");

    fireEvent.click(screen.getByText("Dismiss"));
    expect(screen.getByTestId("error")).toHaveTextContent("");
  });

  // Cancel
  it("calls navigateBackAfterAdd with categoryId when Cancel is triggered", () => {
    render(<AddProduct />);
    fireEvent.click(screen.getByText("Cancel"));

    expect(navigateBackAfterAdd).toHaveBeenCalledWith(1, mockNavigate);
  });

  // Props passed to ProductForm
  it("passes isEditing as false to ProductForm", () => {
    render(<AddProduct />);
    expect(screen.getByTestId("isEditing")).toHaveTextContent("false");
  });
  it("passes the categoryId from location state to ProductForm", () => {
    render(<AddProduct />);
    expect(screen.getByTestId("categoryId")).toHaveTextContent(1);
  });
});
