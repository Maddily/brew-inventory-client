import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FieldError from "./FieldError";

describe("FieldError", () => {
  it("returns nothing when message is empty/null", () => {
    render(<FieldError id="1" message="" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("correctly renders the given message", () => {
    render(<FieldError message="Name is required" id="name-error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Name is required");
  });
});
