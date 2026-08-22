import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FormError from "./FormError";
import userEvent from "@testing-library/user-event";

describe("FormError", () => {
  let onDismiss;
  let onRetry;
  let user;

  beforeEach(() => {
    onDismiss = vi.fn();
    onRetry = vi.fn();
    user = userEvent.setup();

    render(
      <FormError
        message="Failed to fetch"
        onDismiss={onDismiss}
        onRetry={onRetry}
      />
    );
  });

  it("renders an element with alert role", () => {
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders the given message", () => {
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Failed to fetch — your changes were not saved."
    );
  });

  it("renders a retry button that calls the given onRetry function when clicked", async () => {
    const retryButton = screen.getByRole("button", {
      name: "Try again to save changes",
    });
    await user.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it("renders a dismiss button that calls the given onDismiss function when clicked", async () => {
    const dismissButton = screen.getByRole("button", {
      name: "Dismiss error",
    });
    await user.click(dismissButton);
    expect(onDismiss).toHaveBeenCalled();
  });
});
