import { IconAlertCircle, IconX } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./FormError.module.css";

function FormError({ message, onDismiss, onRetry }) {
  return (
    <div className={styles["error-banner"]} role="alert">
      <IconAlertCircle
        stroke={2}
        className={styles["error-icon"]}
        aria-hidden="true"
      />
      <div className={styles["error-text"]}>
        <p className={styles["error-title"]}>Failed to save changes</p>
        <p className={styles["error-msg"]}>
          {message} — your changes were not saved.
        </p>
        <button
          className={styles["error-retry"]}
          onClick={onRetry}
          aria-label="Try again to save changes"
        >
          Try again
        </button>
      </div>
      <button
        className={styles["dismiss-btn-wrap"]}
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        <IconX stroke={2} className={styles["error-dismiss"]} />{" "}
      </button>
    </div>
  );
}

FormError.propTypes = {
  message: PropTypes.string.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default FormError;
