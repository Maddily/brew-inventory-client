import { Fragment, useContext } from "react";
import { useParams, useSearchParams } from "react-router";
import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./FilterBottomSheet.module.css";
import FilterSection from "../FilterSection/FilterSection";
import { SelectedChipsContext } from "../../../../contexts";
import {
  filtersChanged,
  getAttributeValues,
} from "../../../../utils/filterUtils";
import FilterEmptyState from "../FilterEmptyState/FilterEmptyState";

const categoryNameToId = {
  Coffee: 1,
  Tea: 2,
  "Ready-to-Drink": 3,
  Accessories: 4,
};

const categoryIdToAttributes = {
  1: ["Origin", "Roast Level", "Format", "Weight"],
  2: ["Type", "Origin", "Format", "Caffeine Level", "Weight"],
  3: ["Base", "Volume"],
  4: ["Type", "Compatible With"],
};

function FilterBottomSheet({
  filterBottomSheetRef,
  resetButtonStyle,
  products,
}) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category_id: categoryId } = useParams();
  const sections = {
    Category: ["Coffee", "Tea", "Ready-to-Drink", "Accessories"],
    Availability: ["In stock", "Low stock", "Out of stock"],
  };

  // Specific attribute sections are added based on the current list of products
  // Category section is removed because the page displays products in one category
  if (categoryId) {
    delete sections.Category;

    // Make a section for each attribute and add its values as chips
    const attributes = categoryIdToAttributes[categoryId];
    for (const attribute of attributes) {
      sections[attribute] = getAttributeValues(products, attribute);
    }
  }

  const sectionKeys = Object.keys(sections);

  function clearFilters() {
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
    filterBottomSheetRef.current.close();
  }

  function applyFilters() {
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

    filterBottomSheetRef.current.close();
  }

  return (
    <dialog
      className={styles["filter-bottom-sheet"]}
      ref={filterBottomSheetRef}
      closedby="any"
      onClose={resetButtonStyle}
    >
      <div className={styles["sheet-handle-row"]}>
        <div className={styles["sheet-handle"]}></div>
      </div>
      <div className={styles["sheet-header"]}>
        <span className={styles["sheet-title"]}>Filter products</span>
        <IconX
          stroke={2}
          className={styles["sheet-close"]}
          aria-label="close filter modal"
          role="button"
          onClick={() => filterBottomSheetRef.current.close()}
        />
      </div>
      <div className={styles["sheet-body"]}>
        {sectionKeys.map((section, index) => (
          <Fragment key={section}>
            <FilterSection
              sections={sections}
              section={section}
              index={index}
            />
            {index !== sectionKeys.length - 1 && (
              <div className={styles["filter-divider"]}></div>
            )}
          </Fragment>
        ))}
      </div>
      <div className={styles["sheet-footer"]}>
        <button className={styles["sheet-btn-clear"]} onClick={clearFilters}>
          Clear all
        </button>
        <button className={styles["sheet-btn-apply"]} onClick={applyFilters}>
          Apply filters
        </button>
      </div>
    </dialog>
  );
}

FilterBottomSheet.propTypes = {
  filterBottomSheetRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  resetButtonStyle: PropTypes.func,
  products: PropTypes.array,
};

export default FilterBottomSheet;
