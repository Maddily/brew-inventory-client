import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Categories from "./Categories";
import userEvent from "@testing-library/user-event";

describe("Categories", () => {
  // Loading state
  it("renders the loading skeleton while categories are being fetched", () => {
    globalThis.fetch = vi.fn(() => new Promise(() => {})); // never resolves

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("main", { name: /loading categories/i })
    ).toBeInTheDocument();
  });

  // Success state
  it("renders a category for each item returned by the API", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: "Coffee", description: "desc", product_count: 5 },
          { id: 2, name: "Tea", description: "desc", product_count: 3 },
          {
            id: 3,
            name: "Ready-to-Drink",
            description: "desc",
            product_count: 2,
          },
          { id: 4, name: "Accessories", description: "desc", product_count: 7 },
        ]),
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(await screen.findAllByRole("listitem")).toHaveLength(4);
  });
  it("renders the correct icon for each category id", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, name: "Coffee", description: "desc", product_count: 5 },
        { id: 2, name: "Tea", description: "desc", product_count: 3 },
        {
          id: 3,
          name: "Ready-to-Drink",
          description: "desc",
          product_count: 2,
        },
        { id: 4, name: "Accessories", description: "desc", product_count: 4 },
      ],
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    const links = await screen.findAllByRole("link");
    expect(links).toHaveLength(4);

    links.forEach((link) => {
      expect(link.querySelector("svg")).toBeInTheDocument();
    });
  });
  it("passes the correct name, description, and product count to each Category", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: "Coffee",
          description: "Single-origin and blended coffees.",
          product_count: 12,
        },
      ],
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(await screen.findByText("Coffee")).toBeInTheDocument();
    expect(
      screen.getByText("Single-origin and blended coffees.")
    ).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });
  it("renders the correct path for each category", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: "Coffee", description: "desc", product_count: 5 },
          { id: 2, name: "Tea", description: "desc", product_count: 3 },
          {
            id: 3,
            name: "Ready-to-Drink",
            description: "desc",
            product_count: 2,
          },
          { id: 4, name: "Accessories", description: "desc", product_count: 7 },
        ]),
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("link", { name: /coffee/i })
    ).toHaveAttribute("href", "/categories/1");
    expect(await screen.findByRole("link", { name: /tea/i })).toHaveAttribute(
      "href",
      "/categories/2"
    );
    expect(
      await screen.findByRole("link", { name: /ready-to-drink/i })
    ).toHaveAttribute("href", "/categories/3");
    expect(
      await screen.findByRole("link", { name: /accessories/i })
    ).toHaveAttribute("href", "/categories/4");
  });
  it("renders the page heading and description once loaded", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: "Coffee", description: "desc", product_count: 5 },
        ]),
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /categories/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Browse inventory by category")
    ).toBeInTheDocument();
  });

  // Error state
  it("renders the error state when the fetch fails", async () => {
    globalThis.fetch.mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /couldn't load categories/i })
    ).toBeInTheDocument();
  });
  it("renders the error state when the response is not ok", async () => {
    globalThis.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    expect(
      await screen.findByRole("heading", { name: /couldn't load categories/i })
    ).toBeInTheDocument();
  });

  // Retry behavior
  it("refetches categories when retryCount changes", async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <Categories />
      </MemoryRouter>
    );

    await screen.findByRole("heading", { name: /couldn't load categories/i });

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, name: "Coffee", description: "desc", product_count: 5 },
        ]),
    });

    // Simulate what ErrorState's retry button does — trigger a retryCount change
    const retryButton = screen.getByRole("button", { name: /try again/i });
    await userEvent.click(retryButton);

    expect(
      await screen.findByRole("link", { name: /coffee/i })
    ).toBeInTheDocument();
  });
});
