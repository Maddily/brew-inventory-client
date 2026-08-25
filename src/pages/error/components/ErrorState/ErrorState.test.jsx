import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorState from "./ErrorState";

describe("ErrorState", () => {
  const setRetryCount = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    render(<ErrorState setRetryCount={setRetryCount} entity="categories" />);
  });

  it("renders the entity name in the error title", () => {
    expect(screen.getByRole("heading")).toHaveTextContent(/categories/i);
  });

  it("calls setRetryCount with an incrementer function when Try again is clicked", async () => {
    const tryAgainBtn = screen.getByRole("button", { name: /try again/i });
    await user.click(tryAgainBtn);
    expect(setRetryCount).toHaveBeenCalledTimes(1);

    const incrementerFunction = setRetryCount.mock.calls[0][0];
    expect(incrementerFunction(1)).toBe(2);
  });
});
