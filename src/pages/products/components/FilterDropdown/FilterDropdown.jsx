import { Fragment, useContext } from "react";
import { useParams, useSearchParams } from "react-router";
import styles from "./FilterDropdown.module.css";
import FilterSection from "../FilterSection/FilterSection";
import FilterEmptyState from "../FilterEmptyState/FilterEmptyState";
import useSections from "../../../../hooks/useSections";
import { applyFilters, clearFilters, filtersExist } from "../../../../utils/filterUtils";
import { SelectedChipsContext } from "../../../../contexts";
import PropTypes from "prop-types";

function FilterDropdown({ products, closeFilterDropdown }) {
  const [selectedChips, setSelectedChips] = useContext(SelectedChipsContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const { category_id: categoryId } = useParams();
  const sections = useSections(categoryId, products);
  const sectionKeys = Object.keys(sections);

  function handleClearFilters() {
    clearFilters(setSelectedChips, setSearchParams);
    closeFilterDropdown();
  }

  function handleApplyFilters() {
    applyFilters(selectedChips, searchParams, setSearchParams);
    closeFilterDropdown();
  }

  return (
    <div className={styles["filter-dropdown"]}>
      {products.length ? (
        <div className={styles["body"]}>
          {sectionKeys.map((section, index) => (
            <Fragment key={section}>
              <FilterSection
                sections={sections}
                section={section}
                type="dropdown"
              />
              {index !== sectionKeys.length - 1 && (
                <div
                  className={styles["filter-divider"]}
                  aria-hidden="true"
                ></div>
              )}
            </Fragment>
          ))}
        </div>
      ) : (
        <FilterEmptyState />
      )}
      <footer className={styles["footer"]}>
        <button
          className={styles["btn-clear"]}
          onClick={handleClearFilters}
          disabled={!filtersExist(selectedChips)}
        >
          Clear all
        </button>
        {products.length ? (
          <button className={styles["btn-apply"]} onClick={handleApplyFilters}>
            Apply
          </button>
        ) : null}
      </footer>
    </div>
  );
}

FilterDropdown.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeFilterDropdown: PropTypes.func.isRequired,
};

export default FilterDropdown;
