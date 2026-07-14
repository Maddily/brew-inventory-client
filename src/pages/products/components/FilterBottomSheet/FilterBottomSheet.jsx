import { Fragment, useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./FilterBottomSheet.module.css";
import FilterSection from "../FilterSection/FilterSection";
import { SelectedChipsContext } from "../../../../contexts";
import {
  applyFilters,
  clearFilters,
  closeWithAnimation,
  getAttributeValues,
} from "../../../../utils/filterUtils";
import FilterEmptyState from "../FilterEmptyState/FilterEmptyState";
import { categoryIdToAttributes } from "../../../../constants";

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

  // Handle close button click
  const handleCloseBtnClick = () => {
    closeWithAnimation(filterBottomSheetRef.current);
  };

  useEffect(() => {
    const dialog = filterBottomSheetRef.current;

    const handleCancel = (e) => {
      e.preventDefault();
      closeWithAnimation(dialog);
    };

    const handleBackdropClick = (e) => {
      if (e.target === dialog) closeWithAnimation(dialog);
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleBackdropClick);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, [filterBottomSheetRef]);

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

  function handleClearFilters() {
    clearFilters(setSelectedChips, setSearchParams);
    closeWithAnimation(filterBottomSheetRef.current);
  }

  function handleApplyFilters() {
    applyFilters(selectedChips, searchParams, setSearchParams);
    closeWithAnimation(filterBottomSheetRef.current);
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
          onClick={handleCloseBtnClick}
        />
      </div>
      {products.length ? (
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
      ) : (
        <FilterEmptyState />
      )}
      <div className={styles["sheet-footer"]}>
        <button
          className={styles["sheet-btn-clear"]}
          onClick={handleClearFilters}
        >
          Clear all
        </button>
        {products.length ? (
          <button
            className={styles["sheet-btn-apply"]}
            onClick={handleApplyFilters}
          >
            Apply filters
          </button>
        ) : null}
      </div>
    </dialog>
  );
}

FilterBottomSheet.propTypes = {
  filterBottomSheetRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  resetButtonStyle: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.object),
};

export default FilterBottomSheet;
