import { describe, expect, it } from "vitest";
import useAvailability from "./useAvailability";

describe("useAvailability", () => {
  it("returns empty values when stockQuantity is null", () => {
    expect(useAvailability(null, null)).toEqual({
      availability: "",
      availabilityClassName: "",
      icon: null,
    });
  });

  it("returns empty values when stockQuantity is an empty string", () => {
    expect(useAvailability("", null)).toEqual({
      availability: "",
      availabilityClassName: "",
      icon: null,
    });
  });

  it("returns in stock when stockQuantity is above 10", () => {
    const { availability, availabilityClassName } = useAvailability(11, null);
    expect(availability).toBe("In stock");
    expect(availabilityClassName).toBe("in-stock");
  });

  it("returns low stock when stockQuantity is between 1 and 10", () => {
    const { availability, availabilityClassName } = useAvailability(5, null);
    expect(availability).toBe("Low stock");
    expect(availabilityClassName).toBe("low-stock");
  });

  it("returns low stock when stockQuantity is exactly 10", () => {
    const { availability } = useAvailability(10, null);
    expect(availability).toBe("Low stock");
  });

  it("returns low stock when stockQuantity is exactly 1", () => {
    const { availability } = useAvailability(1, null);
    expect(availability).toBe("Low stock");
  });

  it("returns out of stock when stockQuantity is 0", () => {
    const { availability, availabilityClassName } = useAvailability(0, null);
    expect(availability).toBe("Out of stock");
    expect(availabilityClassName).toBe("out-of-stock");
  });

  it("returns an icon when iconClassName is provided", () => {
    const { icon } = useAvailability(42, "availability-icon");
    expect(icon).not.toBeNull();
  });

  it("returns null icon when iconClassName is not provided", () => {
    const { icon } = useAvailability(42);
    expect(icon).toBeNull();
  });
});
