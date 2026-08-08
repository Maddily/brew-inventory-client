import { IconAlertCircle } from "@tabler/icons-react";
import styles from "./FieldError.module.css";
import PropTypes from "prop-types";

function FieldError({ message, id }) {
  if (!message) return null;

  return (
    <div id={id} className={styles["field-error"]} role="alert">
      <IconAlertCircle
        className={styles["field-error-icon"]}
        stroke={2}
        aria-hidden="true"
      />
      {message}
    </div>
  );
}

FieldError.propTypes = {
  message: PropTypes.string,
};

export default FieldError;
