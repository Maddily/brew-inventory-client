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
  filtersExist,
} from "../../../../utils/filterUtils";
import FilterEmptyState from "../FilterEmptyState/FilterEmptyState";
import useSections from "../../../../hooks/useSections";
import { closeSheetWithAnimation } from "../../../../utils/utils";

function FilterBottomSheet({
  filterBottomSheetRef,
  closeFilterDropdown,
  products,
}) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category_id: categoryId } = useParams();
  const sections = useSections(categoryId, products);
  const sectionKeys = Object.keys(sections);

  // Handle close button click
  const handleCloseBtnClick = () => {
    closeSheetWithAnimation(filterBottomSheetRef.current);
  };

  useEffect(() => {
    const modal = filterBottomSheetRef.current;

    const handleCancel = (e) => {
      e.preventDefault();
      closeSheetWithAnimation(modal);
    };

    const handleBackdropClick = (e) => {
      if (e.target === modal) closeSheetWithAnimation(modal);
    };

    modal.addEventListener("cancel", handleCancel);
    modal.addEventListener("click", handleBackdropClick);

    return () => {
      modal.removeEventListener("cancel", handleCancel);
      modal.removeEventListener("click", handleBackdropClick);
    };
  }, [filterBottomSheetRef]);

  function handleClearFilters() {
    clearFilters(setSelectedChips, setSearchParams);
    closeSheetWithAnimation(filterBottomSheetRef.current, closeFilterDropdown);
  }

  function handleApplyFilters() {
    applyFilters(selectedChips, searchParams, setSearchParams);
    closeSheetWithAnimation(filterBottomSheetRef.current, closeFilterDropdown);
  }

  return (
    <dialog
      className={styles["filter-bottom-sheet"]}
      ref={filterBottomSheetRef}
      onClose={closeFilterDropdown}
      aria-modal="true"
    >
      <div className={styles["sheet-handle-row"]} aria-hidden="true">
        <div className={styles["sheet-handle"]}></div>
      </div>
      <header className={styles["sheet-header"]}>
        <h2 className={styles["sheet-title"]}>Filter products</h2>
        <button
          type="button"
          onClick={handleCloseBtnClick}
          aria-label="close filter panel"
        >
          <IconX
            stroke={2}
            aria-hidden="true"
            className={styles["sheet-close"]}
          />
        </button>
      </header>
      {products.length ? (
        <div className={styles["sheet-body"]}>
          {sectionKeys.map((section, index) => (
            <Fragment key={section}>
              <FilterSection
                sections={sections}
                section={section}
                type="bottom-sheet"
              />
              {index !== sectionKeys.length - 1 && (
                <div className={styles["filter-divider"]} aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>
      ) : (
        <FilterEmptyState />
      )}
      <footer className={styles["sheet-footer"]}>
        <button
          className={styles["sheet-btn-clear"]}
          onClick={handleClearFilters}
          disabled={!filtersExist(selectedChips)}
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
      </footer>
    </dialog>
  );
}

FilterBottomSheet.propTypes = {
  filterBottomSheetRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  closeFilterDropdown: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FilterBottomSheet;
