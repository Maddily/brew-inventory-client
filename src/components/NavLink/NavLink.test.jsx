import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NavLink from "./NavLink";
import { MemoryRouter, Route, Routes } from "react-router";

describe("NavLink", () => {
  it("applies active style when the current path matches", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<NavLink value="Categories" path="/" />} />
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
            element={<NavLink value="All products" path="/products" />}
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
          <Route path="/" element={<NavLink value="Categories" path="/" />} />
        </Routes>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /categories/i });
    expect(link.className).not.toContain("active");
  });
});
