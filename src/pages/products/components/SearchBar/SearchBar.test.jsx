import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  afterEach,
  beforeAll,
} from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useSearchParams } from "react-router";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";
import { act } from "react";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useSearchParams: vi.fn(actual.useSearchParams),
  };
});

function ParamsDisplay() {
  const [searchParams] = useSearchParams();
  return <div data-testid="params">{searchParams.toString()}</div>;
}

describe("SearchBar", () => {
  let user;
  let actualUseSearchParams;

  function renderSearchBar() {
    render(
      <MemoryRouter>
        <SearchBar />
        <ParamsDisplay />
      </MemoryRouter>
    );
  }

  beforeAll(async () => {
    actualUseSearchParams = (await vi.importActual("react-router"))
      .useSearchParams;
  });

  beforeEach(() => {
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.mocked(useSearchParams).mockImplementation(actualUseSearchParams);
    vi.useRealTimers();
  });

  it("renders a search input with an accessible label", () => {
    renderSearchBar();
    expect(screen.getByLabelText("Search products")).toBeInTheDocument();
  });

  it("updates the input value as the user types", async () => {
    renderSearchBar();
    const searchField = screen.getByLabelText("Search products");
    await user.type(searchField, "c");
    expect(searchField).toHaveValue("c");

    await user.type(searchField, "ol");
    expect(searchField).toHaveValue("col");

    await user.type(searchField, "d ");
    expect(searchField).toHaveValue("cold ");

    await user.type(searchField, "br");
    expect(searchField).toHaveValue("cold br");

    await user.type(searchField, "ew");
    expect(searchField).toHaveValue("cold brew");
  });

  it("does not update the URL search param immediately when typing", async () => {
    vi.useFakeTimers();
    renderSearchBar();

    const searchField = screen.getByLabelText("Search products");
    fireEvent.change(searchField, { target: { value: "latte" } });
    expect(screen.getByTestId("params")).toHaveTextContent("");
  });

  it("sets the search URL param after the debounce delay", () => {
    vi.useFakeTimers();
    renderSearchBar();

    const searchField = screen.getByLabelText("Search products");
    fireEvent.change(searchField, { target: { value: "latte" } });

    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByTestId("params")).toHaveTextContent("latte");
  });

  it("removes the search URL param when the input is cleared", () => {
    vi.useFakeTimers();
    renderSearchBar();

    const searchField = screen.getByLabelText("Search products");
    fireEvent.change(searchField, { target: { value: "latte" } });

    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByTestId("params")).toHaveTextContent("latte");

    fireEvent.change(searchField, { target: { value: "" } });
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByTestId("params")).toHaveTextContent("");
  });

  it("does not call setSearchParams when the debounced value hasn't actually changed the params", () => {
    const mockSetSearchParams = vi.fn();
    useSearchParams.mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);

    vi.useFakeTimers();
    renderSearchBar();

    const searchField = screen.getByLabelText("Search products");
    fireEvent.change(searchField, { target: { value: "" } });

    act(() => vi.advanceTimersByTime(300));
    expect(mockSetSearchParams).not.toHaveBeenCalled();
  });
});
