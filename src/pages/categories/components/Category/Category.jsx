import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router";
import PropTypes from "prop-types";
import styles from "./Category.module.css";

function Category({
  icon: CatIcon,
  id,
  name,
  description,
  productCount,
  path,
}) {
  const iconName =
    id === 1 ? "coffee" : id === 2 ? "tea" : id === 3 ? "rtd" : "acc";

  return (
    <Link className={styles["category"]} to={path}>
      <div className={`${styles["icon-container"]} ${styles[iconName]}`}>
        <CatIcon
          stroke={2}
          className={`${styles["icon"]} ${styles[iconName]}`}
        />
      </div>
      <div className={styles["category-body"]}>
        <span className={styles["name"]}>{name}</span>
        <span className={styles["description"]}>{description}</span>
        <div className={styles["category-footer"]}>
          <span className={styles["product-count"]}>
            {productCount} {productCount === "1" ? "product" : "products"}
          </span>
          <IconChevronRight className={styles["chevron"]} />
        </div>
      </div>
    </Link>
  );
}

Category.propType = {
  icon: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  productCount: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default Category;
