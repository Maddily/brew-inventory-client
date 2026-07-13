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

  const idToCategory = {
    1: "Coffee",
    2: "Tea",
    3: "Ready-to-Drink",
    4: "Accessories",
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
