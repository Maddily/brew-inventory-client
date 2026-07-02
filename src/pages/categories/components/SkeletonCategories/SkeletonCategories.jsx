import styles from "./SkeletonCategories.module.css";

function SkeletonCategories() {
  return (
    <main
      className={styles["skel-container"]}
      aria-busy="true"
      aria-label="Loading categories"
    >
      <div aria-hidden="true" className={styles["skel-heading"]}></div>
      <div aria-hidden="true" className={styles["skel-paragraph"]}></div>
      <div aria-hidden="true" className={styles["skel-categories"]}>
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={index} className={styles["skel-category"]}></div>
          ))}
      </div>
    </main>
  );
}

export default SkeletonCategories;
