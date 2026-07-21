import { categoryAttributes } from "../constants";

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function shouldUseSelect(attr, category) {
  return !!categoryAttributes[category]?.[attr];
}
