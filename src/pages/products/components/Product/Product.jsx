import { Link } from "react-router";
import { IconChevronRight } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./Product.module.css";

function Product({ name, price, stockQuantity, category, path, state }) {
  const [availability, availabilityClassName] =
    stockQuantity > 10
      ? ["In stock", "in-stock"]
      : stockQuantity > 0
      ? ["Low stock", "low-stock"]
      : ["Out of stock", "out-of-stock"];

  return (
    <Link className={styles["product"]} to={path} state={state}>
      <div className={styles["left"]}>
        <p className={styles["name"]}>{name}</p>
        <p className={styles["category"]}>{category}</p>
        <div className={styles["meta"]}>
          <div className={styles["meta-item"]}>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price)}
          </div>
          <div className={styles["meta-item"]}>
            <span>Qty</span>
            {stockQuantity}
          </div>
        </div>
      </div>
      <div className={styles["right"]}>
        <p
          className={`${styles["availability"]} ${styles[availabilityClassName]}`}
        >
          {availability}
        </p>
        <IconChevronRight className={styles["chevron"]} />
      </div>
    </Link>
  );
}

Product.propTypes = {
  name: PropTypes.string,
  price: PropTypes.string,
  stockQuantity: PropTypes.string,
  category: PropTypes.string,
  path: PropTypes.string,
  state: PropTypes.object,
};

export default Product;
