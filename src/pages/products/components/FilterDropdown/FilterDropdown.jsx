import { Fragment, useContext } from "react";
import { useParams, useSearchParams } from "react-router";
import styles from "./FilterDropdown.module.css";
import FilterSection from "../FilterSection/FilterSection";
import FilterEmptyState from "../FilterEmptyState/FilterEmptyState";
import useSections from "../../../../hooks/useSections";
import { applyFilters, clearFilters } from "../../../../utils/filterUtils";
import { SelectedChipsContext } from "../../../../contexts";
import PropTypes from "prop-types";

function FilterDropdown({ products, resetButtonStyle }) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category_id: categoryId } = useParams();
  const sections = useSections(categoryId, products);
  const sectionKeys = Object.keys(sections);

  function handleClearFilters() {
    clearFilters(setSelectedChips, setSearchParams);
    resetButtonStyle();
  }

  function handleApplyFilters() {
    applyFilters(selectedChips, searchParams, setSearchParams);
    resetButtonStyle();
  }

  return (
    <div className={styles["filter-dropdown"]}>
      {products.length ? (
        <div className={styles["sheet-body"]}>
          {sectionKeys.map((section, index) => (
            <Fragment key={section}>
              <FilterSection
                sections={sections}
                section={section}
                type="dropdown"
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
            Apply
          </button>
        ) : null}
      </div>
    </div>
  );
}

FilterDropdown.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  resetButtonStyle: PropTypes.func.isRequired,
};

export default FilterDropdown;
