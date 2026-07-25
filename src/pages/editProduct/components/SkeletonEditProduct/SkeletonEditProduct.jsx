import styles from "./SkeletonEditProduct.module.css";

function SkeletonEditProduct() {
  return (
    <main
      className={styles["skel-container"]}
      aria-busy="true"
      aria-label="Loading edit form"
    >
      <div aria-hidden="true" className={styles["skel-breadcrumb"]}></div>

      <div className={styles["skel-layout"]}>
        <div className={styles["skel-main"]}>
          {/* Basic details card */}
          <div className={styles["skel-card"]}>
            <div aria-hidden="true" className={styles["skel-card-title"]}></div>
            <div
              aria-hidden="true"
              className={styles["skel-field-label"]}
            ></div>
            <div aria-hidden="true" className={styles["skel-input"]}></div>
            <div
              aria-hidden="true"
              className={styles["skel-field-label"]}
            ></div>
            <div aria-hidden="true" className={styles["skel-textarea"]}></div>
            <div className={styles["skel-two-col"]}>
              <div className={styles["skel-field-group"]}>
                <div
                  aria-hidden="true"
                  className={styles["skel-field-label"]}
                ></div>
                <div aria-hidden="true" className={styles["skel-input"]}></div>
              </div>
              <div className={styles["skel-field-group"]}>
                <div
                  aria-hidden="true"
                  className={styles["skel-field-label"]}
                ></div>
                <div aria-hidden="true" className={styles["skel-input"]}></div>
              </div>
            </div>
          </div>

          {/* Attributes card */}
          <div className={styles["skel-card"]}>
            <div aria-hidden="true" className={styles["skel-card-title"]}></div>
            <div className={styles["skel-two-col"]}>
              {Array(4)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className={styles["skel-field-group"]}>
                    <div
                      aria-hidden="true"
                      className={styles["skel-field-label"]}
                    ></div>
                    <div
                      aria-hidden="true"
                      className={styles["skel-input"]}
                    ></div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles["skel-sidebar"]}>
          <div className={styles["skel-card"]}>
            <div aria-hidden="true" className={styles["skel-btn"]}></div>
            <div
              aria-hidden="true"
              className={styles["skel-btn-secondary"]}
            ></div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SkeletonEditProduct;
