import PropTypes from "prop-types";
import { IconWifiOff, IconRefresh } from "@tabler/icons-react";
import styles from "./ErrorState.module.css";

function ErrorState({ setRetryCount, entity }) {
  return (
    <main className={styles["main"]}>
      <div className={styles["error-icon-container"]}>
        <IconWifiOff className={styles["error-icon"]} stroke={2} />
      </div>
      <p className={styles["error-title"]}>Couldn't load {entity}</p>
      <p className={styles["error-msg"]}>
        Something went wrong while fetching data.
        <br />
        Please try again.
      </p>
      <button
        className={styles["retry-btn"]}
        onClick={() => setRetryCount((c) => c + 1)}
      >
        <IconRefresh className={styles["retry-icon"]} stroke={2} />
        <span className={styles["retry-btn-text"]}>Try again</span>
      </button>
    </main>
  );
}

ErrorState.propTypes = {
  setRetryCount: PropTypes.func,
  data: PropTypes.string,
};

export default ErrorState;
