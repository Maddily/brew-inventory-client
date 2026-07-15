import { categoryIdToAttributes } from "../constants";
import { getAttributeValues } from "../utils/filterUtils";

function useSections(categoryId, products) {
  const sections = {
    Category: ["Coffee", "Tea", "Ready-to-Drink", "Accessories"],
    Availability: ["In stock", "Low stock", "Out of stock"],
  };

  if (categoryId) {
    delete sections.Category;

    // Make a section for each attribute and add its values as chips
    const attributes = categoryIdToAttributes[categoryId];
    for (const attribute of attributes) {
      sections[attribute] = getAttributeValues(products, attribute);
    }
  }

  return sections;
}

export default useSections;
