import styles from "./SkeletonProducts.module.css";

function SkeletonProducts() {
  return (
    <main
      className={styles["skel-container"]}
      aria-busy="true"
      aria-label="Loading products"
    >
      <header className={styles["skel-header"]}>
        <div className={styles["skel-left"]}>
          <div aria-hidden="true" className={styles["skel-heading"]}></div>
          <div aria-hidden="true" className={styles["skel-paragraph"]}></div>
        </div>
        <div className={styles["skel-search-container"]}>
          <div aria-hidden="true" className={styles["skel-search"]}></div>
          <div aria-hidden="true" className={styles["skel-filter-btn"]}></div>
        </div>
      </header>

      {/* Mobile list */}
      <div aria-hidden="true" className={styles["skel-products-list"]}>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className={styles["skel-product-row"]}></div>
          ))}
      </div>

      {/* Desktop table */}
      <div aria-hidden="true" className={styles["skel-table"]}>
        <div className={styles["skel-table-head"]}></div>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <div key={index} className={styles["skel-table-row"]}></div>
          ))}
      </div>
    </main>
  );
}

export default SkeletonProducts;
