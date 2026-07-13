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
  };
  const idToCategory = {
    1: "Coffee",
    2: "Tea",
    3: "Ready-to-Drink",
    4: "Accessories",
  };

  const categoryIds = searchParams.getAll("category_id");
  for (const id of categoryIds) {
    const category = idToCategory[id];
    newSelectedChips.Category.push(category);
  }

  const availability = searchParams.getAll("availability");
  for (const value of availability) {
    newSelectedChips.Availability.push(value);
  }

  setSelectedChips(newSelectedChips);
}
