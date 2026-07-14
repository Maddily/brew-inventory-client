import { IconPackageOff, IconPlus } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./ProductEmptyState.module.css";

function ProductEmptyState({ title, subtitle, action }) {
  return (
    <div className={styles["empty-state"]}>
      <div className={styles["empty-icon-wrap"]}>
        <IconPackageOff stroke={2} className={styles["empty-icon"]} />
      </div>
      <div className={styles["empty-title"]}>{title}</div>
      <div className={`${styles["empty-sub"]} ${styles["mob-empty"]}`}>
        {subtitle}
      </div>
      {action && (
        <button className={styles["add-btn"]} onClick={action.onClick}>
          <IconPlus className={styles["add-icon"]} stroke={2} /> {action.label}
        </button>
      )}
    </div>
  );
}

ProductEmptyState.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  action: PropTypes.shape({ label: PropTypes.string, onClick: PropTypes.func }),
};

export default ProductEmptyState;
