import { Fragment, useContext, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./FilterBottomSheet.module.css";
import FilterSection from "../FilterSection/FilterSection";
import { SelectedChipsContext } from "../../../../contexts";
import { applyFilters, clearFilters } from "../../../../utils/filterUtils";
import FilterEmptyState from "../FilterEmptyState/FilterEmptyState";
import useSections from "../../../../hooks/useSections";
import { closeSheetWithAnimation } from "../../../../utils/utils";

function FilterBottomSheet({
  filterBottomSheetRef,
  resetButtonStyle,
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
    closeSheetWithAnimation(filterBottomSheetRef.current, resetButtonStyle);
  }

  function handleApplyFilters() {
    applyFilters(selectedChips, searchParams, setSearchParams);
    closeSheetWithAnimation(filterBottomSheetRef.current, resetButtonStyle);
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
                type="bottom-sheet"
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
