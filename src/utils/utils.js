export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function shouldUseSelect(attr, category, categoryAttributes) {
  return !!categoryAttributes[category]?.[attr];
}

export const closeSheetWithAnimation = (sheet, closeFilterDropdown) => {
  sheet.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
    { duration: 300, easing: "ease-in" }
  ).onfinish = () => {
    sheet.close();
    closeFilterDropdown && closeFilterDropdown();
  };
};

export const closeModalWithAnimation = (modal) => {
  modal.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 150,
    easing: "ease-out",
  }).onfinish = () => modal.close();
};

export function navigateBackAfterEdit(id, categoryId, categoryName, navigate) {
  navigate(`/products/${id}`, {
    state: categoryId
      ? {
          from: "category",
          categoryId,
          categoryName,
        }
      : { from: "all" },
  });
}

export function navigateBackAfterAdd(categoryId, navigate) {
  if (categoryId) {
    navigate(`/categories/${categoryId}`);
  } else {
    navigate("/products");
  }
}
