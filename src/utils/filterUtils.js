import { idToCategory } from "../constants";

export function filtersChanged(params, searchParams) {
  const keys = new Set([...params.keys(), ...searchParams.keys()]);

  return [...keys].some((key) => {
    const newValues = params.getAll(key).sort();
    const currentValues = searchParams.getAll(key).sort();

    return !(
      newValues.length === currentValues.length &&
      newValues.every((v, i) => v === currentValues[i])
    );
  });
}

export function populateSelectedChips(searchParams, setSelectedChips) {
  const newSelectedChips = {
    Category: [],
    Availability: [],
    Origin: [],
    "Roast Level": [],
    Format: [],
    Weight: [],
    Type: [],
    "Caffeine Level": [],
    Base: [],
    Volume: [],
    "Compatible With": [],
  };

  for (const [param, value] of searchParams.entries()) {
    if (param === "category_id") {
      const category = idToCategory[value];
      if (category) newSelectedChips.Category.push(category);
      continue;
    }

    if (param === "availability") {
      newSelectedChips.Availability.push(value);
      continue;
    }

    if (newSelectedChips[param] !== undefined) {
      newSelectedChips[param].push(value);
    }
  }

  setSelectedChips(newSelectedChips);
}

// Get all existing values for an attribute
export function getAttributeValues(products, attribute) {
  const values = [];

  for (const product of products) {
    const value = product.attributes[attribute];
    !values.includes(value) && values.push(value);
  }

  return values;
}

export function clearFilters(setSelectedChips, setSearchParams) {
  setSelectedChips({
    Category: [],
    Availability: [],
    Origin: [],
    "Roast Level": [],
    Format: [],
    Weight: [],
    Type: [],
    "Caffeine Level": [],
    Base: [],
    Volume: [],
    "Compatible With": [],
  });
  const params = new URLSearchParams();
  setSearchParams(params);
}

export function applyFilters(selectedChips, searchParams, setSearchParams) {
  const categoryNameToId = {
    Coffee: 1,
    Tea: 2,
    "Ready-to-Drink": 3,
    Accessories: 4,
  };

  const params = new URLSearchParams();

  for (const section in selectedChips) {
    if (section === "Category") {
      selectedChips[section].forEach((category) =>
        params.append("category_id", categoryNameToId[category])
      );
      continue;
    }

    if (section === "Availability") {
      selectedChips[section].forEach((a) => params.append("availability", a));
      continue;
    }

    selectedChips[section].forEach((value) => {
      params.append(section, value);
    });
  }

  if (filtersChanged(params, searchParams)) {
    setSearchParams(params);
  }
}

export const closeWithAnimation = (dialog, resetButtonStyle) => {
  dialog.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(100%)" }],
    { duration: 300, easing: "ease-in" }
  ).onfinish = () => {
    dialog.close();
    resetButtonStyle();
  };
};
