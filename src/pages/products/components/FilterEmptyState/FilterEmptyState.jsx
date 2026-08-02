import { IconFilterOff } from "@tabler/icons-react";
import styles from "./FilterEmptyState.module.css";

function FilterEmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <IconFilterOff
        className={styles["empty-icon"]}
        stroke={2}
        aria-hidden="true"
      />
      <h3 className={styles["empty-title"]}>No filters available</h3>
      <p className={styles["empty-sub"]}>
        No products match your current filters. Clear filters to see all
        products.
      </p>
    </div>
  );
}

export default FilterEmptyState;
