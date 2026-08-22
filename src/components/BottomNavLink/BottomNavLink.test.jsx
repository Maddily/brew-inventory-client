import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import BottomNavLink from "./BottomNavLink";

describe("BottomNavLink", () => {
  it("applies active style when the current path matches", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={<BottomNavLink value="Categories" path="/" iconPath="" />}
          />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /categories/i });
    expect(link.className).toContain("active");
  });

  it("does not apply active style when the current path does not match", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <BottomNavLink
                value="All products"
                path="/products"
                iconPath=""
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /all products/i });
    expect(link.className).not.toContain("active");
  });

  it("does not apply active style when the current path matches but search params exist", () => {
    render(
      <MemoryRouter initialEntries={["/?category_id=3"]}>
        <Routes>
          <Route
            path="/"
            element={<BottomNavLink value="Categories" path="/" iconPath="" />}
          />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /categories/i });
    expect(link.className).not.toContain("active");
  });
});
