import { IconAlertCircle, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./FormError.module.css";

function FormError({ message, onDismiss, onRetry }) {
  return (
    <div className={styles["error-banner"]}>
      <IconAlertCircle stroke={2} className={styles["error-icon"]} />
      <div className={styles["error-text"]}>
        <div className={styles["error-title"]}>Failed to save changes</div>
        <div className={styles["error-msg"]}>
          {message} — your changes were not saved.
        </div>
        <span className={styles["error-retry"]} onClick={onRetry}>
          Try again
        </span>
      </div>
      <IconX
        stroke={2}
        className={styles["error-dismiss"]}
        onClick={onDismiss}
      />
    </div>
  );
}

FormError.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default FormError;
