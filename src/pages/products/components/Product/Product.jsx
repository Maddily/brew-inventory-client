import React from "react";
import { Link } from "react-router";
import { IconChevronRight } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./Product.module.css";
import useAvailability from "../../../../hooks/useAvailability";
import { formatPrice } from "../../../../utils/utils";

function Product({ name, price, stockQuantity, category, path, state }) {
  const { availability, availabilityClassName } =
    useAvailability(stockQuantity);
  const ariaPrice = `${parseFloat(price)} dollars`;
  const ariaCategory = category ? category.split("-").join(" ") : "";

  return (
    <Link
      className={styles["product"]}
      to={path}
      state={state}
      aria-label={`${name}, ${ariaCategory}, ${ariaPrice}, stock quantity ${stockQuantity}, ${availability}`}
      data-testid="product"
    >
      <div className={styles["left"]}>
        <p className={styles["name"]}>{name}</p>
        <p className={styles["category"]}>{category}</p>
        <div className={styles["meta"]}>
          <div className={styles["meta-item"]}>{formatPrice(price)}</div>
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
        <IconChevronRight className={styles["chevron"]} aria-hidden="true" />
      </div>
    </Link>
  );
}

Product.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  stockQuantity: PropTypes.string.isRequired,
  category: PropTypes.string,
  path: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
};

export default React.memo(Product);
