import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductEmptyState from "./ProductEmptyState";

describe("ProductEmptyState", () => {
  let user;
  const action = { label: "Clear filters", onClick: vi.fn() };

  beforeEach(() => {
    user = userEvent.setup();
    action.onClick.mockClear();
  });

  it("renders the given title as a heading", () => {
    render(<ProductEmptyState title="No products found" />);
    expect(
      screen.getByRole("heading", { name: /no products found/i, level: 2 })
    ).toBeInTheDocument();
  });

  it("renders the given subtitle", () => {
    render(
      <ProductEmptyState subtitle="No products match your current filters." />
    );
    expect(
      screen.getByText("No products match your current filters.")
    ).toBeInTheDocument();
  });

  it("does not render a button when not given an action object", () => {
    render(
      <ProductEmptyState
        title="No products found"
        subtitle="No products match your current filters."
      />
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a button when given an action object with action.label as its text", () => {
    render(
      <ProductEmptyState
        title="No products found"
        subtitle="No products match your current filters."
        action={action}
      />
    );

    expect(
      screen.getByRole("button", { name: action.label })
    ).toBeInTheDocument();
  });

  it("calls action.onClick when the button is clicked", async () => {
    render(
      <ProductEmptyState
        title="No products found"
        subtitle="No products match your current filters."
        action={action}
      />
    );

    const btn = screen.getByRole("button", { name: action.label });
    await user.click(btn);
    expect(action.onClick).toHaveBeenCalledTimes(1);
  });
});
