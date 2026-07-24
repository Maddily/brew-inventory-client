import { Link } from "react-router";
import { IconChevronRight } from "@tabler/icons-react";
import PropTypes from "prop-types";
import styles from "./Product.module.css";
import useAvailability from "../../../../hooks/useAvailability";
import { formatPrice } from "../../../../utils/utils";

function Product({ name, price, stockQuantity, category, path, state }) {
  const { availability, availabilityClassName } =
    useAvailability(stockQuantity);

  return (
    <Link className={styles["product"]} to={path} state={state}>
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
        <IconChevronRight className={styles["chevron"]} />
      </div>
    </Link>
  );
}

Product.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  stockQuantity: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
};

export default Product;
