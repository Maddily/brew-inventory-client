import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Breadcrumb
          prevPath="/categories/3"
          prev="Ready-to-Drink"
          current="Cold Brew Original"
          state={{}}
        />
      </MemoryRouter>
    );
  });

  it("renders the prev link with correct text, path and aria-label", () => {
    const prevLink = screen.getByRole("link");
    expect(prevLink).toHaveAccessibleName("Ready to Drink");
    expect(prevLink).toHaveAttribute("href", "/categories/3");
  });

  it("renders the current page label", () => {
    const current = screen.getByRole("heading");
    expect(current).toHaveAccessibleName("Cold Brew Original");
  });
});
