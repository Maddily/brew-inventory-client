import { Fragment, useContext } from "react";
import { useSearchParams } from "react-router";
import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./FilterBottomSheet.module.css";
import FilterSection from "../FilterSection/FilterSection";
import { SelectedChipsContext } from "../../../../contexts";
import { filtersChanged } from "../../../../utils/filterUtils";

const sections = {
  Category: ["Coffee", "Tea", "Ready-to-Drink", "Accessories"],
  Availability: ["In stock", "Low stock", "Out of stock"],
};
const categoryNameToId = {
  Coffee: 1,
  Tea: 2,
  "Ready-to-Drink": 3,
  Accessories: 4,
};

function FilterBottomSheet({ filterBottomSheetRef, resetButtonStyle }) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionKeys = Object.keys(sections);

  function clearFilters() {
    setSelectedChips({
      Category: [],
      Availability: [],
    });
  }

  function applyFilters() {
    const params = new URLSearchParams();

    if (
      selectedChips.Category.length > 0 ||
      selectedChips.Availability.length > 0
    ) {
      selectedChips.Category.forEach((category) =>
        params.append("category_id", categoryNameToId[category])
      );
      selectedChips.Availability.forEach((availability) =>
        params.append("availability", availability)
      );
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
};

export default FilterBottomSheet;
