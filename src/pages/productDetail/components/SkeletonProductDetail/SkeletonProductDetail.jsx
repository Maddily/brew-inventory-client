import styles from "./SkeletonProductDetail.module.css";

function SkeletonProductDetail() {
  return (
    <main
      className={styles["skel-container"]}
      aria-busy="true"
      aria-label="Loading product"
    >
      <div aria-hidden="true" className={styles["skel-breadcrumb"]}></div>
      <div className={styles["skel-layout"]}>
        <div className={styles["skel-main"]}>
          <div aria-hidden="true" className={styles["skel-hero"]}></div>
          <div className={styles["skel-card"]}>
            <div aria-hidden="true" className={styles["skel-name"]}></div>
            <div className={styles["skel-meta-row"]}>
              <div aria-hidden="true" className={styles["skel-tag"]}></div>
              <div aria-hidden="true" className={styles["skel-badge"]}></div>
            </div>
            <div aria-hidden="true" className={styles["skel-desc-1"]}></div>
            <div aria-hidden="true" className={styles["skel-desc-2"]}></div>
            <div className={styles["skel-divider"]}></div>
            <div className={styles["skel-price-row"]}>
              <div aria-hidden="true" className={styles["skel-price"]}></div>
              <div aria-hidden="true" className={styles["skel-qty"]}></div>
            </div>
          </div>

          <div className={styles["skel-card"]}>
            <div
              aria-hidden="true"
              className={styles["skel-attrs-title"]}
            ></div>
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div key={i} className={styles["skel-attr-row"]}>
                  <div
                    aria-hidden="true"
                    className={styles["skel-attr-key"]}
                  ></div>
                  <div
                    aria-hidden="true"
                    className={styles["skel-attr-val"]}
                  ></div>
                </div>
              ))}
          </div>
        </div>

        <div className={styles["skel-sidebar"]}>
          <div className={styles["skel-card"]}>
            <div
              aria-hidden="true"
              className={styles["skel-sidebar-title"]}
            ></div>
            <div
              aria-hidden="true"
              className={styles["skel-sidebar-price"]}
            ></div>
            <div className={styles["skel-stock-row"]}>
              <div
                aria-hidden="true"
                className={styles["skel-stock-label"]}
              ></div>
              <div
                aria-hidden="true"
                className={styles["skel-stock-val"]}
              ></div>
            </div>
          </div>

          <div className={styles["skel-card"]}>
            <div
              aria-hidden="true"
              className={styles["skel-sidebar-title"]}
            ></div>
            <div className={styles["skel-action-btns"]}>
              <div aria-hidden="true" className={styles["skel-btn"]}></div>
              <div aria-hidden="true" className={styles["skel-btn"]}></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SkeletonProductDetail;
