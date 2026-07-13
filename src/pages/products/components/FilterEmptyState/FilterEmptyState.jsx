import { IconFilterOff } from "@tabler/icons-react";
import styles from "./FilterEmptyState.module.css";

function FilterEmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <IconFilterOff className={styles["empty-icon"]} stroke={2} />
      <div className={styles["empty-title"]}>No filters available</div>
      <div className={styles["empty-sub"]}>
        No products match your current filters. Clear filters to see all
        products.
      </div>
    </div>
  );
}

export default FilterEmptyState;
