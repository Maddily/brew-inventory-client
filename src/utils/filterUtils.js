export function filtersChanged(params, searchParams) {
  const newCategoryIds = params.getAll("category_id").sort();
  const currentCategoryIds = searchParams.getAll("category_id").sort();
  const newAvailability = params.getAll("availability").sort();
  const currentAvailability = searchParams.getAll("availability").sort();

  return !(
    newCategoryIds.length === currentCategoryIds.length &&
    newCategoryIds.every((id, i) => id === currentCategoryIds[i]) &&
    newAvailability.length === currentAvailability.length &&
    newAvailability.every((v, i) => v === currentAvailability[i])
  );
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
