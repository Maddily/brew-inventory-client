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

export const closeSheetWithAnimation = (sheet, resetButtonStyle) => {
  sheet.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
    { duration: 300, easing: "ease-in" }
  ).onfinish = () => {
    sheet.close();
    resetButtonStyle && resetButtonStyle();
  };
};

export const closeModalWithAnimation = (modal) => {
  modal.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 150,
    easing: "ease-out",
  }).onfinish = () => modal.close();
};
