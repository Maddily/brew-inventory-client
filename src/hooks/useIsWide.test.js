import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useIsWide from "./useIsWide";

describe("useIsWide", () => {
  let mediaQueryListeners;
  let mockMatchMedia;

  beforeEach(() => {
    mediaQueryListeners = [];

    mockMatchMedia = vi.fn((query) => ({
      matches: window.innerWidth >= 600,
      media: query,
      addEventListener: vi.fn((_, handler) => {
        mediaQueryListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
    }));

    window.matchMedia = mockMatchMedia;
  });

  it("returns true when window width is above the default breakpoint", () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsWide());
    expect(result.current).toBe(true);
  });

  it("returns true when window width equals the breakpoint", () => {
    window.innerWidth = 600;
    const { result } = renderHook(() => useIsWide());
    expect(result.current).toBe(true);
  });

  it("returns false when window width is below the default breakpoint", () => {
    window.innerWidth = 599;
    const { result } = renderHook(() => useIsWide());
    expect(result.current).toBe(false);
  });

  it("updates when the media query fires a change event", () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsWide());
    expect(result.current).toBe(true);

    act(() => {
      mediaQueryListeners.forEach((handler) => handler({ matches: false }));
    });

    expect(result.current).toBe(false);
  });

  it("respects a custom breakpoint", () => {
    window.innerWidth = 540;

    mockMatchMedia = vi.fn((query) => ({
      matches: window.innerWidth >= 540,
      media: query,
      addEventListener: vi.fn((_, handler) => {
        mediaQueryListeners.push(handler);
      }),
      removeEventListener: vi.fn(),
    }));
    window.matchMedia = mockMatchMedia;

    const { result } = renderHook(() => useIsWide(540));
    expect(result.current).toBe(true);
  });

  it("removes the event listener on unmount", () => {
    const removeEventListener = vi.fn();
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
    }));
    const { unmount } = renderHook(() => useIsWide());

    unmount();
    expect(removeEventListener).toHaveBeenCalled();
  });
});
