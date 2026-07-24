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

export const closeWithAnimation = (dialog, resetButtonStyle) => {
  dialog.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
    { duration: 300, easing: "ease-in" }
  ).onfinish = () => {
    dialog.close();
    resetButtonStyle && resetButtonStyle();
  };
};
